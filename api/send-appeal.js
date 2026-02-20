export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const APPEAL_WEBHOOK = "https://discord.com/api/webhooks/1474488844622762129/z3hjBSD-9MCgROZyx9qgeb0GxiJUxvvLaOgRhOY6xyjD-AMerkQYJaVnabQKWeGmQXrI";

    try {
        const { content } = req.body;

        const response = await fetch(APPEAL_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
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
