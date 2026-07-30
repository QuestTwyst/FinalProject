import "dotenv/config";
import pool from "./database.js";

/**
 * Adds "The Visitor" (Romance + Horror) to whichever database this
 * connects to -- run against the LIVE Render database by overriding
 * the PG* environment variables on the command line, e.g.:
 *
 *   PGHOST=... PGUSER=... PGPASSWORD=... PGPORT=5432 PGDATABASE=... \
 *     node config/seedTheVisitor.js
 *
 * Safe to re-run -- skips if a story with this title already exists.
 * Unlike the earlier seed scripts, this one supports MULTIPLE genres
 * per story (genres: [...]), matching the app's actual many-to-many
 * story_genres relationship.
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

  // Set start_passage_id right away, so this story never hits the
  // "Loading the first passage forever" bug we chased down earlier.
  await pool.query(
    "UPDATE stories SET start_passage_id = $1 WHERE id = $2",
    [idMap[story.startPassageId], storyId]
  );

  console.log(`Seeded "${story.title}" (id ${storyId}) - ${orderedIds.length} passages.`);
};

const story = {
  "title": "The Visitor",
  "genres": ["Romance", "Horror"],
  "description": "She followed him home three times. Tonight she finally breaks in.",
  "startPassageId": 1,
  "passages": {
    "1": {
      "id": 1,
      "content": "You've followed him home three times now, and tonight you finally worked up the nerve. His porch light glows warm and yellow, completely unaware that it's inviting the wrong kind of company. You crouch in the hedges, heart pounding, staring up at his house. There has to be a way in.",
      "isEnding": false,
      "choices": [
        { "text": "Try the window around back", "next": 2 },
        { "text": "Just knock on the front door", "next": 4 }
      ]
    },
    "2": {
      "id": 2,
      "content": "The window's painted shut. You yank at it twice, quietly cursing whoever last renovated this place. There's a chimney, though \u2014 wide, old-fashioned, practically an invitation. You've seen this work in movies.",
      "isEnding": false,
      "choices": [
        { "text": "Climb down the chimney", "next": 3 },
        { "text": "Give up and try the front door instead", "next": 4 }
      ]
    },
    "3": {
      "id": 3,
      "content": "You wedge yourself in further than you meant to. The bricks scrape your shoulders. You can't go up, and you definitely can't go down. Somewhere below, a floorboard creaks \u2014 he's heard something. Footsteps. A flashlight beam. Then his voice, high and panicked, already dialing 911: \u201cThere's someone \u2014 there's a WOMAN \u2014 she's STUCK IN MY CHIMNEY \u2014\u201d\n\nThey eventually get you out. He presses charges. It is, by any measure, not the meet-cute you imagined.",
      "isEnding": true,
      "choices": []
    },
    "4": {
      "id": 4,
      "content": "You knock. The door swings open and there he is \u2014 actually smiling, actually pleased to see you, completely unaware you've been in his hedges. \u201cHey! I was just thinking about you,\u201d he says, which is somehow worse than if he'd screamed.\n\nYou talk for twenty minutes on his porch. It's easy. It's nice. Then he asks you out.",
      "isEnding": false,
      "choices": [
        { "text": "Say yes", "next": 5 },
        { "text": "Panic and say you have somewhere to be", "next": 6 }
      ]
    },
    "5": {
      "id": 5,
      "content": "The date is a three-hour reenactment of the Battle of Hastings, performed entirely in period-accurate Latin, hosted by his uncle. You sit through it. You clap when everyone else claps. Somewhere around hour two, watching him mouth along to a monologue he's clearly memorized, you realize: you didn't fall for him. You fell for the idea of him. You break up with him in the parking lot, next to a man still wearing chainmail.\n\nYou drive home alone, oddly at peace. Some houses just aren't meant to be broken into.",
      "isEnding": true,
      "choices": []
    },
    "6": {
      "id": 6,
      "content": "\u201cSomewhere to be, actually \u2014 sorry!\u201d You're already backing off the porch. You don't stop moving until you're two blocks away, breathing hard, adrenaline finally catching up with the sheer scale of what you almost did.\n\nYou never do find out what the chimney would have been like. Some mysteries are better left unsolved \u2014 and some men are better left un-stalked.",
      "isEnding": true,
      "choices": []
    }
  }
};

const run = async () => {
  try {
    console.log("Seeding The Visitor...");
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
