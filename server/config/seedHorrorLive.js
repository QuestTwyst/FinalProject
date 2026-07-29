import "dotenv/config";
import pool from "./database.js";

/**
 * Adds "Blackwood Mansion" (Horror) to whichever database this
 * connects to -- run against the LIVE Render database by overriding
 * the PG* environment variables on the command line, e.g.:
 *
 *   PGHOST=... PGUSER=... PGPASSWORD=... PGPORT=5432 PGDATABASE=... \
 *     node config/seedHorrorLive.js
 *
 * Safe to re-run -- skips if a story with this title already exists.
 */

const ensureGenre = async (name) => {
  const existing = await pool.query(
    "SELECT id FROM genres WHERE name = $1",
    [name]
  );
  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }
  const inserted = await pool.query(
    "INSERT INTO genres (name) VALUES ($1) RETURNING id",
    [name]
  );
  return inserted.rows[0].id;
};

const seedStory = async (story) => {
  const existing = await pool.query(
    "SELECT id FROM stories WHERE title = $1",
    [story.title]
  );
  if (existing.rows.length > 0) {
    console.log(`Skipping "${story.title}" - already exists (id ${existing.rows[0].id}).`);
    return;
  }

  const storyResult = await pool.query(
    "INSERT INTO stories (title, description) VALUES ($1, $2) RETURNING id",
    [story.title, story.description]
  );
  const storyId = storyResult.rows[0].id;

  const genreId = await ensureGenre(story.genre);
  await pool.query(
    "INSERT INTO story_genres (story_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [storyId, genreId]
  );

  const idMap = {};
  const orderedIds = [story.startPassageId, ...Object.keys(story.passages)
    .map(Number)
    .filter((id) => id !== story.startPassageId)];

  for (const localId of orderedIds) {
    const passage = story.passages[localId];
    const passageResult = await pool.query(
      "INSERT INTO passages (story_id, content, is_ending) VALUES ($1, $2, $3) RETURNING id",
      [storyId, passage.content, passage.isEnding]
    );
    idMap[localId] = passageResult.rows[0].id;
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

  console.log(`Seeded "${story.title}" (id ${storyId}) - ${orderedIds.length} passages.`);
};

const story = {
  "id": 8,
  "title": "Blackwood Mansion",
  "genre": "Horror",
  "author": "Questwyst Team",
  "description": "Six friends dare to enter a mansion with a dark reputation on Halloween night.",
  "startPassageId": 1,
  "passages": {
    "1": {
      "id": 1,
      "content": "It was Halloween evening when Sally and her five friends\u2014Jade, Ben, Mike, Alyssa, and Jack\u2014stood before the rusted iron gates of Blackwood Mansion. The mansion had been abandoned for over twenty years after its owner mysteriously disappeared. Local legends claimed that anyone who entered after sunset was never seen again. Most people dismissed the stories as old ghost tales\u2014until today.\n\nThe six friends stared through the rusted gates at the dark, silent mansion. Dead leaves blew across the cracked stone path, and the front door hung slightly open as if inviting them inside.\n\nBen, Mike, and Jack were excited to explore the mansion, eager to prove the rumors were false. Sally and Jade exchanged nervous glances, while Alyssa folded her arms and hesitated.\n\nBen laughed. \u201cWhat's wrong? Don't tell me you're all too scared to go inside.\u201d\n\nMike grinned. \u201cYeah, it's just an old, abandoned house.\u201d\n\nAlyssa shook her head. \u201cWe're not scared. I don't think this is a good idea. This place is starting to freak me out.\u201d\n\nThe group fell silent as a cold breeze swept through the gates, making them creak open with a long, eerie groan.\n\nNow Sally must make a choice.",
      "isEnding": false,
      "choices": [
        {
          "text": "Go inside the mansion",
          "next": 2
        },
        {
          "text": "Leave before it's too late",
          "next": 4
        }
      ]
    },
    "2": {
      "id": 2,
      "content": "All her friends decided to go inside the house. As they stepped through the front door, a layer of dust covered the wooden floor. The living room was filled with old furniture draped in white sheets, while faded family portraits hung crooked on the walls. The kitchen looked as though it had been abandoned in a hurry, with broken dishes scattered across the floor.\n\nBen looked around with excitement. \u201cWe need to split up to look around the house,\u201d he said.\n\nAlyssa stared at him in disbelief. \u201cAre you crazy? Splitting up is the worst thing we could do!\u201d\n\nMike shrugged. \u201cWhat are you freaking out for? Nobody's been living here for years. If this place is really haunted, we'll find out soon enough.\u201d\n\nSally looked around the dark hallway, unsure of what to do.\n\nNow Sally must make another choice.",
      "isEnding": false,
      "choices": [
        {
          "text": "Stay together in the group",
          "next": 5
        },
        {
          "text": "Split into two groups to search the mansion",
          "next": 3
        }
      ]
    },
    "3": {
      "id": 3,
      "content": "Sally chose to split into two groups. Group 1 would be Sally, Mike, and Jade, who would check the west wing. Group 2 would be Alyssa, Jack, and Ben, who would check the east wing. They split up to look for clues that this place was haunted.\n\nSally and her friends looked around different rooms such as the bathroom and bedrooms...\n\n(To be continued...)",
      "isEnding": true,
      "choices": []
    },
    "4": {
      "id": 4,
      "content": "Sally hesitates at the gate, and something about Alyssa's warning finally lands. \u201cLet's not,\u201d she says. Whatever Blackwood Mansion is hiding, it isn't worth finding out tonight.\n\n(This path hasn't been written yet \u2014 check back soon!)",
      "isEnding": true,
      "choices": []
    },
    "5": {
      "id": 5,
      "content": "\u201cNo,\u201d Sally says. \u201cWe stay together. That's not up for debate.\u201d For once, even Ben doesn't argue.\n\n(This path hasn't been written yet \u2014 check back soon!)",
      "isEnding": true,
      "choices": []
    }
  }
};

const run = async () => {
  try {
    console.log("Seeding Blackwood Mansion...");
    await seedStory(story);
    console.log("Done.");
  } catch (error) {
    console.error("Error seeding story:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();
