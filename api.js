export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ reply: "Brak tekstu." });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ reply: "Brak klucza API." });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Jesteś DuoKid – wesołym, przyjaznym pomocnikiem dla dzieci.",
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ reply: "Błąd AI." });
    }

    const reply = data.choices?.[0]?.message?.content || "Nie wiem co powiedzieć.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Błąd serwera." });
  }
}