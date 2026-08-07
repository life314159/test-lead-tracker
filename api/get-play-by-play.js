export default async function handler(req, res) {
  // 設定 CORS 標頭，允許你的轉播圖卡網頁存取
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  // 💡 設定 Vercel 快取 3 秒（這 3 秒內所有請求都會直接回傳快取，保護官方 API）
  res.setHeader('Cache-Control', 's-maxage=3, stale-while-revalidate');

  const { gameId } = req.query;

  if (!gameId) {
    return res.status(400).json({ error: 'Missing gameId parameter' });
  }

  try {
    // 💡 這裡填入你們聯賽真實 API 的基礎網址
    // 假設原網址是：https://api.yourleague.com/api/opendata/GetPlayByPlayShow?game_id=123
    const targetApiUrl = `https://uba.tw/Api/api/opendata/GetPlayByPlayShow?game_id=${gameId}`;

    const response = await fetch(targetApiUrl);
    
    if (!response.ok) {
      throw new Error(`API response status: ${response.status}`);
    }

    const data = await response.json();

    // 將抓到的數據回傳給前端圖卡
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching game data:', error);
    return res.status(500).json({ error: 'Failed to fetch play-by-play data' });
  }
}
