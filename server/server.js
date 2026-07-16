import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "QuestTwyst backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`QuestTwyst server running at http://localhost:${PORT}`);
});