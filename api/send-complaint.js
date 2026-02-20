export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const COMPLAINT_WEBHOOK = "https://discord.com/api/webhooks/1464345787067535452/4RI1poDTMkQRhFGRyPbycsGFZHXza0b55gCuELtXAMEzNkovCdV4-4zPegnf1M4XeMJy";

    try {
        const formData = new FormData();
        
        const buffers = [];
        for await (const chunk of req) {
            buffers.push(chunk);
        }
        const data = Buffer.concat(buffers).toString();
        const boundary = req.headers['content-type'].split('boundary=')[1];
        
        const parts = data.split(`--${boundary}`);
        
        for (const part of parts) {
            if (part.includes('name="content"')) {
                const match = part.match(/Content-Disposition: form-data; name="content"\r\n\r\n(.*?)\r\n$/s);
                if (match) {
                    formData.append('content', match[1].trim());
                }
            }
            if (part.includes('name="file"')) {
                const match = part.match(/filename="(.+?)"/);
                const fileContent = part.split('\r\n\r\n')[1]?.split(`\r\n--${boundary}`)[0];
                if (match && fileContent) {
                    const filename = match[1];
                    const blob = new Blob([Buffer.from(fileContent, 'binary')]);
                    formData.append('file', blob, filename);
                }
            }
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
