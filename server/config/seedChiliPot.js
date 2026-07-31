import "dotenv/config";
import pool from "./database.js";

/**
 * Adds "High Noon at the Chili Pot" (Comedy + Western) to whichever
 * database this connects to -- run against the LIVE Render database
 * by overriding the PG* environment variables on the command line:
 *
 *   PGHOST=... PGUSER=... PGPASSWORD=... PGPORT=5432 PGDATABASE=... \
 *     node config/seedChiliPot.js
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
  "title": "High Noon at the Chili Pot",
  "genres": ["Comedy", "Western"],
  "description": "The little town of Redwater, Nebraska hasn't seen sabotage like this since the county fair burned down in '09.",
  "startPassageId": 1,
  "passages": {
    "1": {
      "content": "The little town of Redwater, Nebraska hadn't seen a crowd this big since the county fair burned down in '09. Every rancher, farmhand, and their dog had come out for the annual chili cook-off, and everybody knew the smart money was on Randy \u2014 grandson of Old Ma Kessler, whose secret chili recipe was practically scripture around these parts.\n\nRob had entered four years running and lost four years running. This year, he wasn't leaving it to chance. He slips into the prep tent with a little vial tucked in his boot.",
      "isEnding": false,
      "choices": [
        { "text": "Go with something truly dangerous \u2014 poison", "next": 2 },
        { "text": "Go with something more \"practical\" \u2014 a laxative", "next": 3 }
      ]
    },
    "2": {
      "content": "The judge \u2014 a leathery old rancher named Judge Colton, who'd never met a chili he didn't finish \u2014 takes one bite, turns the color of a Nebraska sky before a tornado, and loses his lunch right on Randy's boots in front of the whole town.\n\nThe contest's over before it started. Nobody wins, and Rob slips off into the crowd looking a little too pleased with himself.",
      "isEnding": false,
      "choices": [
        { "text": "Continue", "next": 6 }
      ]
    },
    "3": {
      "content": "Rob eyes the two chili pots on the judging table. Someone's going to eat this batch \u2014 the only question is who.",
      "isEnding": false,
      "choices": [
        { "text": "The judge eats it", "next": 4 },
        { "text": "Randy eats it", "next": 5 }
      ]
    },
    "4": {
      "content": "Judge Colton takes a big approving spoonful, tips his hat to Randy \u2014 and then makes a beeline for the outhouse behind the grain silo faster than anyone figured a man his age could move.\n\nTwenty minutes later, pale and hollowed out, he stumbles back into the crowd, spots Rob smirking by the fence, and loses what's left of his stomach right on Rob's boots.",
      "isEnding": false,
      "choices": [
        { "text": "Continue", "next": 6 }
      ]
    },
    "5": {
      "content": "Turns out Rob's the one who'd been backed up tighter than a fence post for a week straight, and he'd tested his own sabotage batch on himself first \u2014 worked a little too well. Feeling suddenly generous (and suspiciously relieved), he hands what's left of the \"extra batch\" to Randy as a friendly gesture before judging starts.\n\nRandy spends the whole judging window locked in the outhouse instead of serving his chili. Rob's plan works \u2014 just not the way he figured.",
      "isEnding": false,
      "choices": [
        { "text": "Continue", "next": 6 }
      ]
    },
    "6": {
      "content": "However it happened, one thing's for certain: nobody's walking away from Redwater's chili cook-off with a trophy this year. The crowd grumbles, the pots get packed up half-eaten, and somebody's already talking about next year.",
      "isEnding": false,
      "choices": [
        { "text": "Enter again next year", "next": 7 },
        { "text": "Call it quits", "next": 8 }
      ]
    },
    "7": {
      "content": "A quiet ranch hand nobody's ever heard of shows up with a pot of chili so good even Old Ma Kessler's ghost would've tipped her hat. Neither Randy nor Rob comes close. The stranger wins clean, no drama, and rides off before anybody catches his name.",
      "isEnding": true,
      "choices": []
    },
    "8": {
      "content": "The town packs up and goes home disappointed, and Redwater's chili cook-off quietly becomes the stuff of local legend \u2014 \"the year nobody won.\"",
      "isEnding": true,
      "choices": []
    }
  }
};

const run = async () => {
  try {
    console.log("Seeding High Noon at the Chili Pot...");
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
