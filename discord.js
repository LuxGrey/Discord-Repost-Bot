export async function sendMessage(channelId, content) {
    const response = await fetch(
        `https://discord.com/api/channels/${channelId}/messages`,
        {
            method: 'POST',
            body: JSON.stringify({content: content}),
            headers: {
                'Authorization': `Bot ${process.env.BOT_TOKEN}`,
                'Content-type': 'application/json; charset=UTF-8'
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to send Discord message: ${response.body}`);
    }

    return response;
}