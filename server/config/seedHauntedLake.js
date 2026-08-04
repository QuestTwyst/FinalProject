import "dotenv/config";
import pool from "./database.js";

/**
 * Adds "The Mystery of the Haunted Lake" (Horror) to whichever
 * database this connects to -- run against the LIVE Render database
 * by overriding the PG* environment variables on the command line:
 *
 *   PGHOST=... PGUSER=... PGPASSWORD=... PGPORT=5432 PGDATABASE=... \
 *     node config/seedHauntedLake.js
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
  "title": "The Mystery of the Haunted Lake",
  "genres": ["Horror"],
  "description": "Four friends heading to Haunted Lake for a weekend of camping find their trip interrupted by a fallen tree \u2014 and something watching from the woods.",
  "startPassageId": 1,
  "passages": {
    "1": {
      "content": "It was a warm afternoon when four friends\u2014Brian, Luke, Jessica, and Lucy\u2014were driving to Haunted Lake for a weekend of camping and fishing.\n\nBrian smiled. \"I can't wait to get to the lake.\"\n\nJessica nodded. \"Me too! It's going to be fun.\"\n\nLuke grinned. \"We'll be spending three days out there.\"\n\nLucy laughed. \"This is going to be an awesome trip.\"\n\nSuddenly, a huge tree crashed onto the road in front of them.\n\n\"Watch out!\" Luke shouted.\n\nBrian slammed on the brakes, and the car came to a screeching stop.\n\nLuke looked around. \"Is everyone okay?\"\n\n\"We're fine,\" Jessica and Lucy replied.\n\nLuke stepped out of the car. \"We should see what happened.\"\n\nJessica shook her head. \"I don't think that's a good idea.\"\n\nLucy agreed. \"Something doesn't feel right. Maybe we should turn back.\"\n\nLuke crossed his arms. \"No way. I've been looking forward to this trip all week.\"\n\nBrian looked at the fallen tree, unsure of what to do.\n\nNow Brian must make a choice.",
      "isEnding": false,
      "choices": [
        { "text": "Get out and investigate the road.", "next": 2 },
        { "text": "Turn the car around and go home.", "next": 3 }
      ]
    },
    "2": {
      "content": "Brian slowly stepped out of the car while Luke followed close behind. A massive fallen tree blocked the road.\n\nAs they walked closer, Brian noticed deep claw marks carved into the tree trunk.\n\n\"What could have made these?\" Brian whispered.\n\nBefore Luke could answer, they heard branches snapping deep in the woods.\n\nThe forest fell silent.\n\n\"Move it,\" Luke said, already grabbing for a branch. \"We can't just sit here all night.\"\n\nBrian's eyes stayed fixed on the treeline. \"I don't think we're alone out here.\"\n\n\"Then let's hurry.\"\n\nNow Brian must make another choice.",
      "isEnding": false,
      "choices": [
        { "text": "Help Luke clear the tree from the road.", "next": 4 },
        { "text": "Run back to the car and warn the girls.", "next": 5 }
      ]
    },
    "3": {
      "content": "Brian shook his head. \"You're right. Something about this doesn't feel right.\"\n\nHe climbed back in and threw the car into reverse, gravel spitting under the tires as they pulled away from the fallen tree. Nobody spoke for the first few miles.\n\nIt wasn't until they stopped for gas that Jessica noticed the long, deep scratch running down the length of the trunk \u2014 the car's trunk, not the tree's. None of them could explain how it got there, or when.",
      "isEnding": true,
      "choices": []
    },
    "4": {
      "content": "Brian grabbed the other end of the branch, and together they hauled at the fallen tree. It barely budged. Behind them, the girls sat frozen in the car, watching the treeline.\n\nThen Luke stopped pulling. \"Brian. Look.\"\n\nDeep in the trees, something was watching them \u2014 low to the ground, perfectly still, two pale eyes catching what little light was left in the sky.\n\nNeither of them moved. Neither of them breathed. And then, just as quietly as it appeared, it was gone.\n\nThey cleared the road in under a minute after that.",
      "isEnding": true,
      "choices": []
    },
    "5": {
      "content": "Brian didn't wait to see what was in the trees. He grabbed Luke's arm and they sprinted back toward the car, gravel crunching under their shoes.\n\n\"Drive, drive, drive!\" Luke shouted, throwing himself into the back seat.\n\nJessica didn't ask questions. She threw the car into reverse and didn't stop until Haunted Lake was thirty miles behind them \u2014 and none of them ever found out what had been in those woods, watching, waiting for them to leave.",
      "isEnding": true,
      "choices": []
    }
  }
};

const run = async () => {
  try {
    console.log("Seeding The Mystery of the Haunted Lake...");
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
