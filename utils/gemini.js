import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function run(
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
) {
  const prompt = `Please provide the following details for generating a README report: 
    (Event/Program Name: ${event_name} 
    Date: ${event_date} 
    Time: ${event_time} 
    Organizing Department/Club/Cell:${event_organizing_club} 
    Total Student Participants:${student_count} 
    Total Faculty Participants:${faculty_count} 
    Mode of Event (Online/Offline): ${event_mode}  
    Faculty Coordinator: ${faculty_cooridinator} 
    Brief Event/Program Description: ${event_description} 
    Program Outcome: ${program_outcome}
    Feedback:${event_feedback})
    Give the output in json format,avoid \n and \t in the output`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Remove markdown code block syntax and parse JSON
    const cleanJson = text.replace(/```json\n|\n```/g, "");
    let parsedData;
    try {
      const cleanJson = text.replace(/```json\n|\n```/g, "").trim();
      parsedData = JSON.parse(cleanJson);
    } catch (parseError) {
      // If JSON parsing fails, extract data using regex
      parsedData = extractDataFromText(text);
    }

    // Structure the response with proper formatting
    return {
      event: {
        title: "Event Details",
        name: parsedData.eventName || event_name || "Not specified",
        date: parsedData.date || event_date || "Not specified",
        time: parsedData.time || event_time || "Not specified",
        mode: parsedData.mode || event_mode || "Not specified",
        organizer:
          parsedData.organizingDepartment ||
          event_organizing_club ||
          "Not specified",
        coordinator:
          parsedData.facultyCoordinator ||
          faculty_cooridinator ||
          "Not specified",
      },
      participants: {
        title: "Participation Details",
        students: Number(
          parsedData.totalStudentParticipants || student_count || 0
        ),
        faculty: Number(
          parsedData.totalFacultyParticipants || faculty_count || 0
        ),
        total:
          Number(parsedData.totalStudentParticipants || student_count || 0) +
          Number(parsedData.totalFacultyParticipants || faculty_count || 0),
      },
      content: {
        title: "Event Content",
        description:
          parsedData.description || event_description || "Not specified",
        outcome:
          parsedData.programOutcome || program_outcome || "Not specified",
        feedback: parsedData.feedback || event_feedback || "Not specified",
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        status: "success",
      },
    };
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    return {
      error: "Failed to parse event report",
      details: error.message,
      status: "error",
      timestamp: new Date().toISOString(),
    };
  }
}
function extractDataFromText(text) {
  const patterns = {
    eventName: /Event\/Program Name:\s*([^\n]+)/,
    date: /Date:\s*([^\n]+)/,
    time: /Time:\s*([^\n]+)/,
    organizingDepartment: /Organizing Department\/Club\/Cell:\s*([^\n]+)/,
    totalStudentParticipants: /Total Student Participants:\s*(\d+)/,
    totalFacultyParticipants: /Total Faculty Participants:\s*(\d+)/,
    mode: /Mode of Event \(Online\/Offline\):\s*([^\n]+)/,
    facultyCoordinator: /Faculty Coordinator:\s*([^\n]+)/,
    description:
      /Brief Event\/Program Description:\s*([^\n]+(?:\n(?!Program Outcome)[^\n]+)*)/,
    programOutcome: /Program Outcome:\s*([^\n]+(?:\n(?!Feedback)[^\n]+)*)/,
    feedback: /Feedback:\s*([^\n]+(?:\n[^\n]+)*)/,
  };

  const extracted = {};
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    extracted[key] = match ? match[1].trim() : null;
  }

  return extracted;
}
