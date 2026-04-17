import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function testTwitch() {
  try {
    console.log("Obteniendo token...");
    const tokenResponse = await axios.post(
      `https://id.twitch.tv/oauth2/token`,
      null,
      {
        params: {
          client_id: process.env.TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_CLIENT_SECRET,
          grant_type: "client_credentials",
        },
      }
    );

    const token = tokenResponse.data.access_token;
    console.log("Token obtenido:", token.substring(0, 5) + "...");

    console.log("Checking streams for eviltokkii...");
    const streamResponse = await axios.get(
      "https://api.twitch.tv/helix/streams",
      {
        params: { user_login: "eviltokkii" },
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Stream data:", JSON.stringify(streamResponse.data, null, 2));
    
    if (streamResponse.data.data.length > 0) {
      console.log("STATUS: ONLINE");
    } else {
      console.log("STATUS: OFFLINE");
    }

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

testTwitch();
