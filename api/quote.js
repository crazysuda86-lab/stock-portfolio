export default async function handler(req, res) {
  try {
    const symbol = String(req.query.symbol || "").trim().toUpperCase();

    if (!symbol) {
      return res.status(400).json({ error: "symbol is required" });
    }

    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing FINNHUB_API_KEY" });
    }

    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch quote" });
    }

    const data = await response.json();

    return res.status(200).json({
      symbol,
      currentPrice: Number(data.c || 0),
      previousClose: Number(data.pc || 0),
      change: Number(data.d || 0),
      changePercent: Number(data.dp || 0)
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Unknown error"
    });
  }
}
