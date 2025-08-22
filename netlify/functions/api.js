export async function handler(event, context) {
  const state = event.queryStringParameters.state;
  const metro = event.queryStringParameters.metro;

  const url = `http://myhousingdataapi.us-east-1.elasticbeanstalk.com/api?state=${state}&metro=${metro}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Proxy fetch failed', detail: err.message }),
    };
  }
}