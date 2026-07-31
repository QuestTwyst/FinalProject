import "dotenv/config";
import pool from "./database.js";

/**
 * Adds "Oops" (Sci-Fi + Adventure) to whichever database this
 * connects to -- run against the LIVE Render database by overriding
 * the PG* environment variables on the command line:
 *
 *   PGHOST=... PGUSER=... PGPASSWORD=... PGPORT=5432 PGDATABASE=... \
 *     node config/seedOops.js
 *
 * Safe to re-run -- skips if a story with this title already exists.
 *
 * Structure: 4 choice points that reconverge into 2 midpoints before
 * splitting into 4 final endings (13 passages total).
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

  for (const genreName of story.genres) {
    const genreId = await ensureGenre(genreName);
    await pool.query(
      "INSERT INTO story_genres (story_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [storyId, genreId]
    );
  }

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

  await pool.query(
    "UPDATE stories SET start_passage_id = $1 WHERE id = $2",
    [idMap[story.startPassageId], storyId]
  );

  console.log(`Seeded "${story.title}" (id ${storyId}) - ${orderedIds.length} passages.`);
};

const story = {
  "title": "Oops",
  "genres": ["Sci-Fi", "Adventure"],
  "description": "Mia's science fair project was supposed to be fertilizer. It was not supposed to shrink her to the size of an ant.",
  "startPassageId": 1,
  "passages": {
    "1": {
      "content": "Mia's science fair project was supposed to be a new kind of fertilizer. It was not supposed to turn her into the size of an ant, mid-mix, in her own backyard. The grass around her is suddenly a jungle. Her lost vial of antidote glints somewhere in the distance, way too far to see clearly.",
      "isEnding": false,
      "choices": [
        { "text": "Head toward the rose bushes", "next": 2 },
        { "text": "Stay near the porch steps", "next": 3 }
      ]
    },
    "2": {
      "content": "A massive bumblebee lands nearby, wings thrumming like an engine.",
      "isEnding": false,
      "choices": [
        { "text": "Hitch a ride", "next": 4 },
        { "text": "Climb the rose stem yourself", "next": 5 }
      ]
    },
    "3": {
      "content": "A line of ants marches past, oddly organized.",
      "isEnding": false,
      "choices": [
        { "text": "Follow them", "next": 6 },
        { "text": "Climb the porch steps alone", "next": 7 }
      ]
    },
    "4": {
      "content": "The bee lifts off before Mia can think twice, climbing fast \u2014 this is definitely help, but not the kind she can steer.",
      "isEnding": false,
      "choices": [
        { "text": "Continue", "next": 8 }
      ]
    },
    "5": {
      "content": "The thorns are brutal and slow going, but at least she's in control of where she ends up.",
      "isEnding": false,
      "choices": [
        { "text": "Continue", "next": 9 }
      ]
    },
    "6": {
      "content": "The ants move fast and sure, clearly headed somewhere specific \u2014 help, again, but not on her terms.",
      "isEnding": false,
      "choices": [
        { "text": "Continue", "next": 8 }
      ]
    },
    "7": {
      "content": "Slow, exhausting, entirely her own effort.",
      "isEnding": false,
      "choices": [
        { "text": "Continue", "next": 9 }
      ]
    },
    "8": {
      "content": "Whatever's leading her \u2014 the bee, the ants \u2014 deposits her somewhere she didn't choose: a shaded gap under a flowerpot, close to the vial but not quite there, with something moving in the dark nearby.",
      "isEnding": false,
      "choices": [
        { "text": "Trust whatever led you here and wait it out", "next": 10 },
        { "text": "Break off on your own from here", "next": 11 }
      ]
    },
    "9": {
      "content": "She's made real progress on her own, but a shadow falls over her \u2014 something huge, closer than the vial, blocking the only path forward.",
      "isEnding": false,
      "choices": [
        { "text": "Hide and let it pass", "next": 12 },
        { "text": "Face it head-on", "next": 13 }
      ]
    },
    "10": {
      "content": "The shape moving in the dark turns out to be a pill bug, utterly uninterested in her, ambling off after a minute. The vial's right there once the coast is clear. She's back to normal size and lying in the grass within minutes, badly needing to explain this to somebody.",
      "isEnding": true,
      "choices": []
    },
    "11": {
      "content": "She squeezes out from under the pot and makes the last stretch herself, dragging the vial's stopper loose with both arms. The formula tastes terrible. She doesn't care. Normal-sized again, grass-stained, victorious.",
      "isEnding": true,
      "choices": []
    },
    "12": {
      "content": "The shadow belongs to her own cat, prowling the yard, thankfully oblivious to a girl the size of a grain of rice. Once he wanders off, the path's clear, and the antidote's close enough to reach on foot.",
      "isEnding": true,
      "choices": []
    },
    "13": {
      "content": "Turns out standing your ground works differently at ant-size \u2014 the \"threat\" was a garden gnome, knocked loose from its post, rocking gently in the breeze. She laughs, climbs over it, and finishes the walk to the vial with her nerves thoroughly tested for nothing.",
      "isEnding": true,
      "choices": []
    }
  }
};

const run = async () => {
  try {
    console.log("Seeding Oops...");
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
