export async function generateCodeSummary(diff, env) {
    if (!env.OPENAI_KEY) {
        throw new Error('OpenAI API key not configured');
    }

    try {
        // Create a cache key based on the diff content
        const cacheKey = await createCacheKey(diff);
        
        // Try to get cached summary
        const cachedSummary = await env.SUMMARIES_CACHE.get(cacheKey);
        if (cachedSummary) {
            return JSON.parse(cachedSummary);
        }

        // Split the diff into chunks of roughly 4000 characters each
        const chunkSize = 4000;
        const diffChunks = [];
        for (let i = 0; i < diff.length; i += chunkSize) {
            diffChunks.push(diff.slice(i, i + chunkSize));
        }

        // If we have multiple chunks, analyze each separately and combine
        const summaries = await Promise.all(diffChunks.map(async (chunk, index) => {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${env.OPENAI_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    response_format: { "type": "json_object" },
                    messages: [
                        {
                            role: "system",
                            content: `You are a helpful assistant that summarizes code changes.
                            You MUST return your response in the following JSON structure:
                            {
                                "overview": "A one-sentence summary of the overall change",
                                "keyChanges": [
                                    "First key change",
                                    "Second key change",
                                    "etc..."
                                ]
                            }
                            Keep each section concise and focused on the most important aspects.
                            ${diffChunks.length > 1 ? 'This is part ' + (index + 1) + ' of ' + diffChunks.length + ' parts.' : ''}
                            The response must be valid JSON.`
                        },
                        {
                            role: "user",
                            content: `Please provide a structured summary of these code changes:\n\n${chunk}`
                        }
                    ],
                    max_tokens: 250,
                    temperature: 0.3
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'OpenAI API error');
            }

            const data = await response.json();
            const content = data.choices[0].message.content.trim();
            
            try {
                return JSON.parse(content);
            } catch (e) {
                console.error('Failed to parse OpenAI response as JSON:', content);
                throw new Error('Invalid response format from OpenAI');
            }
        }));

        let finalSummary;

        // Combine summaries if we had multiple chunks
        if (summaries.length > 1) {
            const combinedResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${env.OPENAI_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    response_format: { "type": "json_object" },
                    messages: [
                        {
                            role: "system",
                            content: `You are a helpful assistant that combines multiple code change summaries.
                            You MUST return your response in the following JSON structure:
                            {
                                "overview": "A one-sentence summary of the overall changes",
                                "keyChanges": [
                                    "Most important changes across all summaries",
                                    "Limited to 5-7 key points"
                                ]
                            }
                            The response must be valid JSON.`
                        },
                        {
                            role: "user",
                            content: `Please combine these summaries into a single coherent summary:\n\n${JSON.stringify(summaries, null, 2)}`
                        }
                    ],
                    max_tokens: 250,
                    temperature: 0.3
                })
            });

            if (!combinedResponse.ok) {
                const error = await combinedResponse.json();
                throw new Error(error.error?.message || 'OpenAI API error');
            }

            const data = await combinedResponse.json();
            const content = data.choices[0].message.content.trim();
            
            try {
                finalSummary = JSON.parse(content);
            } catch (e) {
                console.error('Failed to parse OpenAI response as JSON:', content);
                throw new Error('Invalid response format from OpenAI');
            }
        } else {
            finalSummary = summaries[0];
        }

        // Cache the final summary for 24 hours
        await env.SUMMARIES_CACHE.put(cacheKey, JSON.stringify(finalSummary), {
            expirationTtl: 86400 // 24 hours in seconds
        });

        return finalSummary;
    } catch (error) {
        console.error('Error generating code summary:', error);
        throw error;
    }
}

async function createCacheKey(diff) {
    // Create a hash of the diff content to use as a cache key
    const encoder = new TextEncoder();
    const data = encoder.encode(diff);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `summary_${hashHex}`;
} 