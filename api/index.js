const gemini = require("../utils/gemini");
const express = require("express");
const app = express();

app.post("/gemini", async (req, res) => {
  const {
    event_name,
    event_date,
    event_time,
    event_organizing_club,
    student_count,
    faculty_count,
    event_mode,
    faculty_cooridinator,
    event_description,
    program_outcome,
    event_feedback,
  } = req.body;
  const result = await gemini.run(
    event_name,
    event_date,
    event_time,
    event_organizing_club,
    student_count,
    faculty_count,
    event_mode,
    faculty_cooridinator,
    event_description,
    program_outcome,
    event_feedback
  );
  res.json(result);
});
module.exports = app;
