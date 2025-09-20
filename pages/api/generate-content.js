import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is missing on Vercel" });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Missing topic" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful content generator." },
        { role: "user", content: `Write about: ${topic}` },
      ],
      max_tokens: 300,
    });

    const text = completion.choices[0].message.content;
    return res.status(200).json({ content: text });
  } catch (err) {
    console.error("OpenAI API error:", err);
    return res.status(500).json({ error: err.message || "Error generating content" });
  }
}
