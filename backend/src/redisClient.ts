import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("Erro no cliente Redis:", err);
});

redisClient.on("connect", () => {
  console.log("Conectado ao Redis com sucesso!");
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Erro ao conectar ao Redis:", err);
  }
})();

export default redisClient;
