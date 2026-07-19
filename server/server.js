import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import storiesRoutes from "./routes/stories.js";
import passagesRoutes from "./routes/passages.js";
import genresRouter from "./routes/genres.js";
import storyGenresRouter from "./routes/storyGenres.js";
import readingProgressRouter from "./routes/readingProgress.js";
import storyHistoryRouter from "./routes/storyHistory.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/stories", passagesRoutes);
app.use("/stories", storiesRoutes);

app.use("/api/genres", genresRouter);
app.use("/api/stories", storyGenresRouter);
app.use("/api/progress", readingProgressRouter);
app.use("/api/story-history", storyHistoryRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "QuestTwyst backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`QuestTwyst server running at http://localhost:${PORT}`);
});
