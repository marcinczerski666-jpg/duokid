export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST only" });
    }

    // PRAWIDŁOWE pobranie JSON – zgodne z Vercel Serverless
    const { userText } = req.body;

    if (!userText) {
      return res.status(400).json({ reply: "Missing userText" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ reply: "Missing API key" });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are DuoKid – a friendly assistant for children.",
          },
          {
            role: "user",
            content: userText,
          },
        ],
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error("OpenAI Error:", data);
      return res.status(500).json({ reply: "OpenAI error" });
    }

    const reply = data.choices?.[0]?.message?.content || "No response.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ reply: "Server error" });
  }
}
