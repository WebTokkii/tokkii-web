async function searchITunes(term) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=1`;
  try {
    const response = await fetch(url);
    const json = await response.json();
    if (json.results && json.results.length > 0) {
      const track = json.results[0];
      return {
        trackName: track.trackName,
        artistName: track.artistName,
        previewUrl: track.previewUrl
      };
    }
  } catch (error) {
    console.error(`Error searching iTunes for: ${term}`, error);
  }
  return null;
}

async function test() {
  console.log("Searching iTunes for Mario Overworld Theme...");
  const track = await searchITunes("Super Mario Bros Overworld Theme instrumental");
  console.log("Found Track:", track);
}

test();
