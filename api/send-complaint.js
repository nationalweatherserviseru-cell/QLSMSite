export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const COMPLAINT_WEBHOOK = "https://discord.com/api/webhooks/1464345787067535452/4RI1poDTMkQRhFGRyPbycsGFZHXza0b55gCuELtXAMEzNkovCdV4-4zPegnf1M4XeMJy";

    try {
        const formData = new FormData();
        
        if (req.body.content) {
            formData.append('content', req.body.content);
        }

        const response = await fetch(COMPLAINT_WEBHOOK, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ error: 'Discord webhook failed' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
