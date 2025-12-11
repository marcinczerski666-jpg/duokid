export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { userText } = JSON.parse(req.body);

    if (!process.env.OPENAI_API_KEY) {
      console.error("Brak klucza OPENAI_API_KEY!");
      return res.status(500).json({ reply: "Server error: missing API key" });
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
            content: "You are DuoKid – a friendly voice assistant for children. Respond simply, kindly and clearly."
          },
          {
            role: "user",
            content: userText
          }
        ],
      }),
    });

    const data = await openaiRes.json();

    if (!data.choices || !data.choices[0].message) {
      console.error("OpenAI error:", data);
      return res.status(500).json({ reply: "Server error" });
    }

    const reply = data.choices[0].message.content || "I cannot answer now.";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ reply: "Server error" });
  }
}
