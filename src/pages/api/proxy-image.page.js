export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(500).json({ error: 'Failed to fetch image' });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = response.headers.get('content-type') || 'image/jpeg';
        const base64 = buffer.toString('base64');

        return res.status(200).json({
            base64: `data:${mimeType};base64,${base64}`
        });

    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch image' });
    }
}