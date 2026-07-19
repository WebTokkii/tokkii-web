async function test() {
  const url = 'http://127.0.0.1:5174/Imagenes/minijuego_covers.png';
  try {
    const res = await fetch(url);
    console.log(`Status for ${url}:`, res.status);
    console.log(`Content-Type:`, res.headers.get('content-type'));
  } catch (err) {
    console.error('Error fetching image:', err.message);
  }
}
test();
