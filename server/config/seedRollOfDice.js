import "dotenv/config";
import pool from "./database.js";

const ensureGenre = async (name) => {
  const existing = await pool.query("SELECT id FROM genres WHERE name = $1", [name]);
  if (existing.rows.length > 0) return existing.rows[0].id;
  const inserted = await pool.query(
    "INSERT INTO genres (name) VALUES ($1) RETURNING id",
    [name]
  );
  return inserted.rows[0].id;
};

const story = {
  title: "Roll of the Dice",
  description: "A man lets a twenty-year-old board game die decide the rest of his life.",
  genres: ["Comedy"],
  coverImageUrl: "https://res.cloudinary.com/a9s5uskh/image/upload/v1785694421/wdnrsdsfhgfgktax8c86.png",
  startPassageId: 1,
  passages: {
    "1": {
      content: "A man has an important decision to make, and he wants to roll the dice and see which way he should go.",
      isEnding: false,
      choices: [{ text: "Roll the dice", next: 2 }],
    },
    "2": {
      content: "He found the die in a board game from 2003, wedged between the couch cushions next to a fossilized french fry. Didn't matter. A decision's a decision, and dice don't lie \u2014 probably.\n\nHe gives it a dramatic shake, like he's about to determine the fate of nations instead of whether to take a job that pays $2 more an hour.\n\nIt rolls off the table, bounces once, and lands under the fridge.",
      isEnding: false,
      choices: [
        { text: "Get down on the floor and actually retrieve it, because rules are rules", next: 3 },
        { text: "Declare that \"under the fridge\" obviously means the universe wants him to decide some other way", next: 4 },
      ],
    },
    "3": {
      content: "He gets down on his hands and knees, one arm shoved shoulder-deep under the fridge, feeling around through eleven years of dust bunnies and at least one AA battery he does not remember losing. His fingers finally close around the die. He pulls it out along with a Cheeto that has fused to his sleeve.\n\nSix. Even number. Take the job.\n\nHe stares at it for a long moment, then says out loud, to an empty kitchen, \"Okay but what if I roll again.\"",
      isEnding: true,
      choices: [],
    },
    "4": {
      content: "\"Right,\" he says, nodding slowly, as if he's just received a message from a higher power via kitchen appliance. \"Under the fridge. Very clear. Very obvious. The universe does not want me taking that job.\"\n\nHis roommate walks in, looks at him crouched on the floor talking to a Whirlpool, and quietly backs out of the room without asking a single question.\n\nHe feels, somehow, extremely validated.",
      isEnding: true,
      choices: [],
    },
  },
};

const run = async () => {
  try {
    const existing = await pool.query("SELECT id FROM stories WHERE title = $1", [story.title]);
    if (existing.rows.length > 0) {
      console.log(`Already exists (id ${existing.rows[0].id}), skipping.`);
      return;
    }

    const storyResult = await pool.query(
      "INSERT INTO stories (title, description, cover_image_url) VALUES ($1, $2, $3) RETURNING id",
      [story.title, story.description, story.coverImageUrl]
    );
    const storyId = storyResult.rows[0].id;

    for (const genreName of story.genres) {
      const genreId = await ensureGenre(genreName);
      await pool.query(
        "INSERT INTO story_genres (story_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [storyId, genreId]
      );
    }

    const idMap = {};
    const orderedIds = [1, 2, 3, 4];

    for (const localId of orderedIds) {
      const passage = story.passages[localId];
      const result = await pool.query(
        "INSERT INTO passages (story_id, content, is_ending) VALUES ($1, $2, $3) RETURNING id",
        [storyId, passage.content, passage.isEnding]
      );
      idMap[localId] = result.rows[0].id;
    }

    for (const localId of orderedIds) {
      const passage = story.passages[localId];
      for (const choice of passage.choices) {
        await pool.query(
          "INSERT INTO choices (passage_id, choice_text, next_passage_id) VALUES ($1, $2, $3)",
          [idMap[localId], choice.text, idMap[choice.next]]
        );
      }
    }

    await pool.query("UPDATE stories SET start_passage_id = $1 WHERE id = $2", [idMap[1], storyId]);

    console.log(`Seeded "${story.title}" (id ${storyId}) with cover image.`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
};

run();
