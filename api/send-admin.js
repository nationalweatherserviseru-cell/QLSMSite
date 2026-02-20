export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const ADMIN_WEBHOOK = "https://discord.com/api/webhooks/1474132958758572083/GJez82EbK5h5TLuQ9uhQgyDj8L_PIu8I7URC0MAdV9KaTkgz5AlmsIk-Hm7VhYJZ04uV";

    try {
        const buffers = [];
        for await (const chunk of req) {
            buffers.push(chunk);
        }
        const data = Buffer.concat(buffers).toString();
        const boundary = req.headers['content-type'].split('boundary=')[1];
        
        const parts = data.split(`--${boundary}`);
        let content = '';
        
        for (const part of parts) {
            if (part.includes('name="content"')) {
                const match = part.match(/Content-Disposition: form-data; name="content"\r\n\r\n(.*?)\r\n$/s);
                if (match) {
                    content = match[1].trim();
                }
            }
        }

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
