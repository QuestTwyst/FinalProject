import "dotenv/config";
import pool from "./database.js";

/**
 * Adds "Gone in the Night" (Mystery) to whichever database this
 * connects to -- run against the LIVE Render database by overriding
 * the PG* environment variables on the command line:
 *
 *   PGHOST=... PGUSER=... PGPASSWORD=... PGPORT=5432 PGDATABASE=... \
 *     node config/seedGoneInTheNight.js
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
  "title": "Gone in the Night",
  "genres": ["Mystery"],
  "description": "Delia's car vanished from her own driveway overnight, without a trace.",
  "startPassageId": 1,
  "passages": {
    "1": {
      "content": "Delia's car was parked right outside her house last night. This morning, the driveway is empty \u2014 no broken glass, no tire marks, nothing. Just gone. Someone in this neighborhood knows something.",
      "isEnding": false,
      "choices": [
        { "text": "Question the nosy neighbor across the street", "next": 2 },
        { "text": "Walk the block yourself, looking for any sign of it", "next": 3 }
      ]
    },
    "2": {
      "content": "Mrs. Halloran's seen everything that's happened on this street since 1987, and she's thrilled someone finally asked.",
      "isEnding": false,
      "choices": [
        { "text": "She swears she saw a stranger lurking near the car around midnight", "next": 4 },
        { "text": "She insists it \"just rolled off on its own,\" and nobody believes her", "next": 5 }
      ]
    },
    "3": {
      "content": "You start canvassing on foot, checking every side street within walking distance.",
      "isEnding": false,
      "choices": [
        { "text": "You find fresh tire tracks leading toward the highway on-ramp", "next": 6 },
        { "text": "A block over, something catches your eye in a patch of overgrown bushes", "next": 7 }
      ]
    },
    "4": {
      "content": "The \"stranger\" turns out to be the delivery driver who'd been dropping off a package two doors down \u2014 timestamped, on camera, nowhere near the car. Dead end. Delia's back to square one, more confused than when she started.",
      "isEnding": true,
      "choices": []
    },
    "5": {
      "content": "Mrs. Halloran is, against all odds, completely right. Further down the street, exactly where she pointed, the truth turns out to be smaller and stranger than anyone guessed \u2014 and considerably less human than a car theft.",
      "isEnding": true,
      "choices": []
    },
    "6": {
      "content": "Following the tracks leads to an abandoned lot near the highway, tire treads circling once and stopping cold \u2014 a dead end that goes nowhere, probably some unrelated car that happened to pass through. Delia's no closer to an answer.",
      "isEnding": true,
      "choices": []
    },
    "7": {
      "content": "There it is \u2014 her car, nose-first in an overgrown hedge a full block from her house. As Delia steps closer and peers through the window, she spots it: a squirrel, frozen mid-crouch on the driver's seat, staring right back at her. It lets out one sharp, startled chirp \u2014 and bolts, scrambling straight across the gearshift in a panic. The car lurches, rolls another ten feet through the hedge, and comes to a stop half-buried in somebody's rosebushes, the squirrel long gone by the time it stops moving. Delia just stands there, staring at the new dent in a stranger's garden, trying to figure out how she's supposed to explain any of this to her insurance company.",
      "isEnding": true,
      "choices": []
    }
  }
};

const run = async () => {
  try {
    console.log("Seeding Gone in the Night...");
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
