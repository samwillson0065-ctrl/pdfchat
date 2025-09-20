import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { topic } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful content generator." },
        { role: "user", content: `Write about: ${topic}` },
      ],
      max_tokens: 300,
    });

    const text = completion.choices[0].message.content;
    res.status(200).json({ content: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating content." });
  }
}