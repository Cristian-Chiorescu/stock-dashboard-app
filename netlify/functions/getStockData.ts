import { Handler, HandlerEvent } from "@netlify/functions";

// Using modern import syntax
import fetch from 'node-fetch';

export const handler: Handler = async (event: HandlerEvent) => {
  const symbol = event.queryStringParameters?.symbol;
  
  // --- DEBUGGING LOGS ---
  console.log("Function invoked for symbol:", symbol);
  console.log("Attempting to read API key...");
  
  const API_KEY = process.env.FINNHUB_API_KEY;

  if (!API_KEY) {
    // This log will tell us if the key is missing
    console.error("FINNHUB_API_KEY is not defined in the environment!");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key is not configured on the server." }),
    };
  }
  
  // Let's log a redacted version to confirm it was read
  console.log("API Key loaded successfully:", `${API_KEY.substring(0, 4)}...`);
  // --- END DEBUGGING ---


  if (!symbol) {
    return { statusCode: 400, body: JSON.stringify({ error: "Stock symbol is required" }) };
  }

  try {
    const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
    const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`;
    
    console.log("Fetching data from Finnhub...");
    const [quoteResponse, profileResponse] = await Promise.all([
      fetch(quoteUrl),
      fetch(profileUrl),
    ]);

    if (!quoteResponse.ok || !profileResponse.ok) {
      console.error("Finnhub API response was not ok:", quoteResponse.status, profileResponse.status);
      throw new Error('Failed to fetch data from Finnhub');
    }

    const quoteData = await quoteResponse.json();
    const profileData = await profileResponse.json();
    console.log("Data fetched successfully.");

    const combinedData = {
      name: profileData.name,
      symbol: profileData.ticker,
      quote: {
        price: quoteData.c,
        change: quoteData.d,
        percentChange: quoteData.dp,
      },
      stats: {
        marketCap: profileData.marketCapitalization * 1e6,
        peRatio: 0,
        week52High: 0,
        week52Low: 0,
        volume: 0,
      },
    };

    return {
      statusCode: 200,
      body: JSON.stringify(combinedData),
    };
  } catch (error) {
    console.error("An error occurred in the try block:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
