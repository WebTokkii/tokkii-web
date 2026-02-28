import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
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

app.get("/api/twitch-status", async (req, res) => {
  try {
    if (!twitchToken || Date.now() > tokenExpiration) {
      await getTwitchToken();
    }

    // 1. Verificamos si está en vivo
    const streamResponse = await axios.get(
      "https://api.twitch.tv/helix/streams",
      {
        params: {
          user_login: "tokkiixa",
        },
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${twitchToken}`,
        },
      }
    );

    const stream = streamResponse.data.data[0];

    if (stream) {
      return res.json({
        isLive: true,
        title: stream.title,
        game: stream.game_name,
        viewers: stream.viewer_count,
        thumbnail: stream.thumbnail_url
          .replace("{width}", "1280")
          .replace("{height}", "720"),
      });
    }

    // 2. Si está offline, buscamos el último VOD
    // Primero necesitamos el ID de usuario si no lo tenemos
    const userResponse = await axios.get(
      "https://api.twitch.tv/helix/users",
      {
        params: {
          login: "tokkiixa",
        },
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${twitchToken}`,
        },
      }
    );

    const userId = userResponse.data.data[0]?.id;

    if (userId) {
      const videoResponse = await axios.get(
        "https://api.twitch.tv/helix/videos",
        {
          params: {
            user_id: userId,
            first: 1,
            type: "archive", // Solo transmisiones pasadas
          },
          headers: {
            "Client-ID": process.env.TWITCH_CLIENT_ID,
            Authorization: `Bearer ${twitchToken}`,
          },
        }
      );

      const lastVideo = videoResponse.data.data[0];
      if (lastVideo) {
        return res.json({
          isLive: false,
          lastVideoId: lastVideo.id,
          title: lastVideo.title,
          thumbnail: lastVideo.thumbnail_url
            .replace("{width}", "1280")
            .replace("{height}", "720"),
        });
      }
    }

    res.json({ isLive: false });
  } catch (error) {
    console.error("ERROR TWITCH:", error.response?.data || error.message);
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
    });

    res.json({ success: true });
  } catch (error) {
    console.error("ERROR SORTEOS:", error.response?.data || error.message);
    res.status(500).json({ error: "Error enviando a Discord (Sorteos)" });
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
    });

    res.json({ success: true });
  } catch (error) {
    console.error("ERROR EVENTOS:", error.response?.data || error.message);
    res.status(500).json({ error: "Error enviando a Discord (Eventos)" });
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