export default async function handler(request) {
  // Set CORS headers for cross-origin requests
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle OPTIONS request for CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // Handle GET request
  if (request.method === "GET") {
    return new Response(
      JSON.stringify({
        message: "Send a POST request with JSON data to see it echoed back",
      }),
      { status: 200, headers }
    );
  }

  // Handle POST request
  if (request.method === "POST") {
    try {
      // Parse the JSON body
      const jsonData = await request
        .json()
        .catch(() => ({ error: "No valid JSON data provided" }));

      // Simply return the same JSON data that was received
      return new Response(JSON.stringify(jsonData), { status: 200, headers });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Error processing request",
          details: error.message,
        }),
        { status: 500, headers }
      );
    }
  }

  // Handle other HTTP methods
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers,
  });
}
