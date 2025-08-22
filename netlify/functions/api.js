// netlify/functions/api.js
export async function handler(event) {
  const { state, metro } = event.queryStringParameters || {};
  if (!state || !metro) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing state or metro" }) };
  }
  const url = `http://myhousingdataapi.us-east-1.elasticbeanstalk.com/api?state=${encodeURIComponent(state)}&metro=${encodeURIComponent(metro)}`;
  try {
    const res = await fetch(url);
    const body = await res.text();
    return {
      statusCode: res.status,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: "Proxy fetch failed", detail: String(e) }) };
  }
}
