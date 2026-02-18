import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/users";
import missionRoutes from "./routes/missions";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(userRoutes);
app.use(missionRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Sassy Coach API running on port ${PORT}`);
});
