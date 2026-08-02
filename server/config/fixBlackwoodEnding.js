import "dotenv/config";
import pool from "./database.js";

const newEnding = `Sally and her friends searched room after room, but the mansion gave up nothing \u2014 no ghosts, no secrets, just dust and silence. As the group finally regrouped by the front door, ready to call the night a bust, a floorboard creaked upstairs. All six of them froze. Nobody had gone up there.

Sally looked at the staircase, then at her friends, then back at the staircase. \u201cNope,\u201d she said. \u201cWe are absolutely coming back for that.\u201d

They left Blackwood Mansion that night with more questions than answers \u2014 and a promise to return.

To be continued in Blackwood Mansion 2 (Coming next year)....`;

const run = async () => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.content
       FROM passages p
       JOIN stories s ON s.id = p.story_id
       WHERE s.title = 'Blackwood Mansion'
       ORDER BY p.id;`
    );

    if (result.rows.length === 0) {
      console.log("No Blackwood Mansion passage found.");
      return;
    }

    const passage = result.rows[0];
    const oldMarker = "(To be continued...)";

    let updatedContent;
    if (passage.content.includes(oldMarker)) {
      updatedContent = passage.content.replace(oldMarker, newEnding);
    } else {
      // Fallback: just append the ending if the marker text isn't
      // found exactly as expected.
      updatedContent = passage.content + "\n\n" + newEnding;
    }

    await pool.query(
      `UPDATE passages SET content = $1, is_ending = true WHERE id = $2;`,
      [updatedContent, passage.id]
    );

    console.log(`Updated passage ${passage.id} with a real ending.`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
};

run();
