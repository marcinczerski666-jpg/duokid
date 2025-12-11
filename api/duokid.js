export default async function handler(req, res) {
  try {
    const { userText } = JSON.parse(req.body);

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content: "You are DuoKid — a friendly assistant for children."
          },
          {
            role: "user",
            content: userText
          }
        ]
      })
    });

    const data = await openaiRes.json();

    const reply =
      data.output_text ??
      data.output[0].content ??
      "I cannot answer now.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).json({ reply: "Server error." });
  }
}
