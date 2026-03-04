import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({
  origin: ["https://tokkii.online", "https://webtokkii.github.io", "http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

/* =====================================================
   🔐 TWITCH TOKEN
===================================================== */

let twitchToken = null;
let tokenExpiration = null;

async function getTwitchToken() {
  try {
    const response = await axios.post(
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

    twitchToken = response.data.access_token;

    // Guardamos expiración (normalmente 60 días)
    tokenExpiration = Date.now() + response.data.expires_in * 1000;

    console.log("Token de Twitch actualizado");
  } catch (error) {
    console.error("Error obteniendo token Twitch:", error.response?.data || error.message);
  }
}

/* =====================================================
   📡 TWITCH STATUS (LIVE / OFFLINE)
===================================================== */

let cachedStatus = null;
let lastCacheUpdate = 0;
let cachedUserId = null;
const CACHE_DURATION = 15 * 1000; // 15 segundos

app.get("/api/twitch-status", async (req, res) => {
  try {
    // 1. Check cache
    if (cachedStatus && (Date.now() - lastCacheUpdate < CACHE_DURATION)) {
      return res.json(cachedStatus);
    }

    if (!twitchToken || Date.now() > tokenExpiration) {
      await getTwitchToken();
    }

    // 2. Check if Live (Fastest call)
    const streamResponse = await axios.get(
      "https://api.twitch.tv/helix/streams",
      {
        params: { user_login: "tokkiixa" },
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${twitchToken}`,
        },
      }
    );

    const stream = streamResponse.data.data[0];

    if (stream) {
      const liveStatus = {
        isLive: true,
        title: stream.title,
        game: stream.game_name,
        viewers: stream.viewer_count,
        thumbnail: stream.thumbnail_url.replace("{width}", "1280").replace("{height}", "720"),
      };
      cachedStatus = liveStatus;
      lastCacheUpdate = Date.now();
      return res.json(liveStatus);
    }

    // 3. If Offline, get Last Video
    // Cache User ID to avoid unnecessary calls
    if (!cachedUserId) {
      const userResponse = await axios.get("https://api.twitch.tv/helix/users", {
        params: { login: "tokkiixa" },
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${twitchToken}`,
        },
      });
      cachedUserId = userResponse.data.data[0]?.id;
    }

    if (cachedUserId) {
      const videoResponse = await axios.get("https://api.twitch.tv/helix/videos", {
        params: { user_id: cachedUserId, first: 1, type: "archive" },
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${twitchToken}`,
        },
      });

      const lastVideo = videoResponse.data.data[0];
      if (lastVideo) {
        const offlineStatus = {
          isLive: false,
          lastVideoId: lastVideo.id,
          title: lastVideo.title,
          thumbnail: lastVideo.thumbnail_url.replace("{width}", "1280").replace("{height}", "720"),
        };
        cachedStatus = offlineStatus;
        lastCacheUpdate = Date.now();
        return res.json(offlineStatus);
      }
    }

    const simpleOffline = { isLive: false };
    cachedStatus = simpleOffline;
    lastCacheUpdate = Date.now();
    res.json(simpleOffline);
  } catch (error) {
    console.error("ERROR TWITCH:", error.response?.data || error.message);
    if (cachedStatus) return res.json(cachedStatus);
    res.status(500).json({ error: "Error verificando Twitch" });
  }
});

/* =====================================================
   🔹 SORTEOS
===================================================== */

app.post("/api/contacto", async (req, res) => {
  const { nombre, eventoPremio, mensaje } = req.body;

  if (!nombre || !eventoPremio || !mensaje) {
    return res.status(400).json({ error: "Faltan campos" });
  }

  if (!process.env.DISCORD_WEBHOOK_SORTEOS) {
    return res.status(500).json({ error: "Webhook de sorteos no configurado" });
  }

  try {
    await axios.post(process.env.DISCORD_WEBHOOK_SORTEOS, {
      embeds: [
        {
          title: "🎉 Reclamo de Premio",
          color: 5814783,
          fields: [
            { name: "👤 Nombre", value: nombre },
            { name: "🏆 Premio", value: eventoPremio },
            { name: "💬 Mensaje", value: mensaje },
          ],
          timestamp: new Date(),
        },
      ],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    res.json({ success: true });
  } catch (error) {
    const errorMsg = error.response?.data || error.message;
    console.error("ERROR SORTEOS:", errorMsg);

    let userFriendlyMessage = "Error enviando a Discord (Sorteos)";
    if (error.response?.status === 429) {
      userFriendlyMessage = "Discord está limitando las peticiones temporalmente. Por favor, espera un minuto e intenta de nuevo ⏳";
    }

    res.status(500).json({
      success: false,
      error: userFriendlyMessage,
      details: errorMsg
    });
  }
});

/* =====================================================
   🔹 EVENTOS
===================================================== */

app.post("/api/eventos", async (req, res) => {
  const { nombre, eventoPremio, mensaje } = req.body;

  if (!nombre || !eventoPremio || !mensaje) {
    return res.status(400).json({ error: "Faltan campos" });
  }

  if (!process.env.DISCORD_WEBHOOK_EVENTOS) {
    return res.status(500).json({ error: "Webhook de eventos no configurado" });
  }

  try {
    await axios.post(process.env.DISCORD_WEBHOOK_EVENTOS, {
      embeds: [
        {
          title: "🏆 Nuevo Registro de Evento",
          color: 15844367,
          fields: [
            { name: "👤 Nombre", value: nombre },
            { name: "🎯 Evento", value: eventoPremio },
            { name: "💬 Mensaje", value: mensaje },
          ],
          timestamp: new Date(),
        },
      ],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    res.json({ success: true });
  } catch (error) {
    const errorMsg = error.response?.data || error.message;
    console.error("ERROR EVENTOS:", errorMsg);

    let userFriendlyMessage = "Error enviando a Discord (Eventos)";
    if (error.response?.status === 429) {
      userFriendlyMessage = "Discord está limitando las peticiones temporalmente. Por favor, espera un minuto e intenta de nuevo ⏳";
    }

    res.status(500).json({
      success: false,
      error: userFriendlyMessage,
      details: errorMsg
    });
  }
});

/* =====================================================
   🚀 SERVER
===================================================== */
app.get("/", (req, res) => {
  res.send("Servidor de Tokkiixa funcionando correctamente 🚀");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    webhooks: {
      sorteos: !!process.env.DISCORD_WEBHOOK_SORTEOS,
      eventos: !!process.env.DISCORD_WEBHOOK_EVENTOS
    }
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});