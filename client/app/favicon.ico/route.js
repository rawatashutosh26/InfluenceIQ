export async function GET() {
  // Return a tiny transparent icon payload so browsers stop requesting a missing favicon.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"></svg>`;
  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
