async function searchYouTube(query) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await response.text();
    
    // Look for videoId in the page content
    const regex = /"videoId":"([^"]+)"/g;
    let match;
    const ids = [];
    while ((match = regex.exec(html)) !== null && ids.length < 5) {
      if (!ids.includes(match[1])) {
        ids.push(match[1]);
      }
    }
    return ids[0] || null;
  } catch (error) {
    console.error(`Error searching YouTube for: ${query}`, error);
    return null;
  }
}

async function test() {
  console.log("Searching YouTube for Zelda Lullaby piano cover...");
  const videoId = await searchYouTube("Zelda Lullaby piano cover");
  console.log("Found Video ID:", videoId);
}

test();
