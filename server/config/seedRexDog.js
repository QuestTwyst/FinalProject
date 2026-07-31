import "dotenv/config";
import pool from "./database.js";

/**
 * Adds "Rex 2.0" (Sci-Fi) to whichever database this connects to --
 * run against the LIVE Render database by overriding the PG*
 * environment variables on the command line:
 *
 *   PGHOST=... PGUSER=... PGPASSWORD=... PGPORT=5432 PGDATABASE=... \
 *     node config/seedRexDog.js
 *
 * Safe to re-run -- skips if a story with this title already exists.
 *
 * Structure: 4 sequential A/B choice levels, fully branching, ending
 * in 16 distinct endings (a complete binary tree).
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
  "title": "Rex 2.0",
  "genres": ["Sci-Fi"],
  "description": "Max's mom said no to a real dog, so he built one instead. Sixteen ways this could go.",
  "startPassageId": 1,
  "passages": {
    "1": {
      "content": "Max had asked for a dog every birthday since he was six. His mom always said the same thing: too expensive, too much work. So Max stopped asking \u2014 and started building. Six months of scavenged parts and one very patient robotics tutorial channel later, Rex powers on for the first time.",
      "isEnding": false,
      "choices": [
        { "text": "Show him off at school", "next": 2 },
        { "text": "Test him quietly in the backyard first", "next": 3 }
      ]
    },
    "2": {
      "content": "Rex is a sensation. Someone films it for the local news.",
      "isEnding": false,
      "choices": [
        { "text": "Keep showing him off", "next": 4 },
        { "text": "A man in a gray suit is watching \u2014 hide him", "next": 5 }
      ]
    },
    "3": {
      "content": "Rex chases a squirrel through the tomatoes with unsettling enthusiasm for a pile of scrap metal.",
      "isEnding": false,
      "choices": [
        { "text": "Let him roam free", "next": 6 },
        { "text": "Keep him close", "next": 7 }
      ]
    },
    "4": {
      "content": "The demo draws bigger crowds every day.",
      "isEnding": false,
      "choices": [
        { "text": "Push his power further", "next": 8 },
        { "text": "Let a stranger \"test\" him", "next": 9 }
      ]
    },
    "5": {
      "content": "The gray-suit man doesn't stop asking around town.",
      "isEnding": false,
      "choices": [
        { "text": "He tracks Max down anyway", "next": 10 },
        { "text": "Max moves Rex somewhere new every night", "next": 11 }
      ]
    },
    "6": {
      "content": "Rex explores like he actually enjoys it.",
      "isEnding": false,
      "choices": [
        { "text": "He bolts toward the busy road chasing a dog", "next": 12 },
        { "text": "He dives into the creek chasing a squirrel", "next": 13 }
      ]
    },
    "7": {
      "content": "Money's tight at home this month.",
      "isEnding": false,
      "choices": [
        { "text": "Mom starts eyeing Rex's chassis", "next": 14 },
        { "text": "Rex scares off a prowler and earns his keep", "next": 15 }
      ]
    },
    "8": {
      "content": "The crowd loves it, but something in Rex's core starts running hot.",
      "isEnding": false,
      "choices": [
        { "text": "One more demo, just to be sure", "next": 16 },
        { "text": "Shut him down early, just in case", "next": 17 }
      ]
    },
    "9": {
      "content": "The stranger seems oddly confident handling Rex.",
      "isEnding": false,
      "choices": [
        { "text": "He runs off with him", "next": 18 },
        { "text": "Max grabs Rex back just in time", "next": 19 }
      ]
    },
    "10": {
      "content": "The man corners Max after school with an offer.",
      "isEnding": false,
      "choices": [
        { "text": "Max's mom takes the deal", "next": 20 },
        { "text": "Max refuses, and they run", "next": 21 }
      ]
    },
    "11": {
      "content": "It's exhausting, but it's working \u2014 for now.",
      "isEnding": false,
      "choices": [
        { "text": "Max finally tells his mom everything", "next": 22 },
        { "text": "He keeps the secret going alone", "next": 23 }
      ]
    },
    "12": {
      "content": "Rex is faster than Max expected, and the road is close.",
      "isEnding": false,
      "choices": [
        { "text": "He makes it across safely", "next": 24 },
        { "text": "A delivery truck clips him", "next": 25 }
      ]
    },
    "13": {
      "content": "Water and circuitry were never meant to mix.",
      "isEnding": false,
      "choices": [
        { "text": "He short-circuits and shuts down", "next": 26 },
        { "text": "Something resets wrong, and right", "next": 27 }
      ]
    },
    "14": {
      "content": "She sits Max down at the kitchen table.",
      "isEnding": false,
      "choices": [
        { "text": "She goes through with it", "next": 28 },
        { "text": "She can't bring herself to", "next": 29 }
      ]
    },
    "15": {
      "content": "Word spreads about the robot dog who scared off a break-in.",
      "isEnding": false,
      "choices": [
        { "text": "Neighbors start asking Max to build them one too", "next": 30 },
        { "text": "Rex gets quietly damaged in the scuffle, and Max has to rebuild him", "next": 31 }
      ]
    },
    "16": {
      "content": "Rex's core cracks under the strain mid-demo, sparks pouring from his chest panel, and he collapses dead in front of the whole crowd. Max carries the pieces home in a backpack.",
      "isEnding": true,
      "choices": []
    },
    "17": {
      "content": "Max shuts him down just as the first warning light flickers \u2014 a close call, but Rex survives, humming quietly back in the garage that night, safe.",
      "isEnding": true,
      "choices": []
    },
    "18": {
      "content": "The stranger sprints off down the street with Rex under his arm before Max even understands what's happening. He never sees him again.",
      "isEnding": true,
      "choices": []
    },
    "19": {
      "content": "Max tackles the stranger's leg and drags Rex back, scraped but intact. Word gets around school that Max isn't someone to mess with.",
      "isEnding": true,
      "choices": []
    },
    "20": {
      "content": "The offer has more zeros than Max's mom has ever seen. Government research, cutting-edge robotics, they call it. Rex is loaded into a van by lunchtime while Max watches from the window.",
      "isEnding": true,
      "choices": []
    },
    "21": {
      "content": "Max and Rex slip out the back and don't stop until they're three towns over, staying with an aunt who doesn't ask questions. Not a normal life. Theirs, though.",
      "isEnding": true,
      "choices": []
    },
    "22": {
      "content": "His mom listens to the whole story without saying a word, then hugs him and says they'll figure it out together. Rex stays in the family, out in the open, for good.",
      "isEnding": true,
      "choices": []
    },
    "23": {
      "content": "The secret gets harder to keep every week. Eventually Max slips up, and the whole town finds out anyway \u2014 but by then, everyone's just impressed instead of suspicious.",
      "isEnding": true,
      "choices": []
    },
    "24": {
      "content": "Rex clears the road just as the light changes, skidding to a stop on the far curb, sensors blinking wildly. Max has never run so fast in his life.",
      "isEnding": true,
      "choices": []
    },
    "25": {
      "content": "The truck clips his back leg and he drags himself to the curb, sparking uselessly, and doesn't move again. Max sits with him until the streetlights come on.",
      "isEnding": true,
      "choices": []
    },
    "26": {
      "content": "Rex shuts down completely in the creek, waterlogged and dark. Max spends the whole summer trying to rebuild him from spare parts, and mostly succeeds.",
      "isEnding": true,
      "choices": []
    },
    "27": {
      "content": "Something in his core resets wrong \u2014 and right. He climbs out of the creek shaking water off like an actual dog, quirks and glitches Max never programmed in. Not quite a real dog. Not quite what he was, either.",
      "isEnding": true,
      "choices": []
    },
    "28": {
      "content": "Rent's due, and Rex is worth more in parts than as a pet. Max holds his paw one last time before the scrapyard truck comes.",
      "isEnding": true,
      "choices": []
    },
    "29": {
      "content": "She looks at Rex, looks at Max, and quietly decides some things matter more than money this month. They figure out rent another way.",
      "isEnding": true,
      "choices": []
    },
    "30": {
      "content": "Turns out there's a business in building robot guard dogs for a whole town full of nervous homeowners. Mom stops worrying about money entirely.",
      "isEnding": true,
      "choices": []
    },
    "31": {
      "content": "Rex comes out of the fight with a cracked panel and a limp, but very much alive. Max spends the next month rebuilding him better than before \u2014 scars and all.",
      "isEnding": true,
      "choices": []
    }
  }
};

const run = async () => {
  try {
    console.log("Seeding Rex 2.0...");
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
