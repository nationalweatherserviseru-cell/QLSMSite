export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const ADMIN_WEBHOOK = "https://discord.com/api/webhooks/1474132958758572083/GJez82EbK5h5TLuQ9uhQgyDj8L_PIu8I7URC0MAdV9KaTkgz5AlmsIk-Hm7VhYJZ04uV";

    try {
        const { content } = req.body;

        const response = await fetch(ADMIN_WEBHOOK, {
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
