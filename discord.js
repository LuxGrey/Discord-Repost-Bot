export async function sendMessage(content) {
    const response = await fetch(
        process.env.DISCORD_WEBHOOK_URL,
        {
            method: 'POST',
            body: JSON.stringify({ content: content }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to send Discord message: ${response.body}`);
    }

    return response;
}