import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    try {
        const { prompt, data, temperature = 0.4 } = req.body;

        if (!prompt || !data) {
            return res.status(400).json({ error: "Prompt and data are required" });
        }

        const finalPrompt = `${prompt}\n\nDATA:\n${JSON.stringify(data)}`;

        const response = await client.responses.create({
            model: "gpt-4.1-mini", // faster
            input: finalPrompt,
            temperature,
            text: {
                format: {
                    type: "json_object",
                },
            },

        });

        res.status(200).json({
            result: response.output_text,
        });
    } catch (error) {
        console.error("AI ERROR 👉", error);
        res.status(500).json({
            error: error.message || "AI generation failed",
        });
    }
}
