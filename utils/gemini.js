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
    const parsedData = JSON.parse(cleanJson);

    // Structure the response with proper formatting
    return {
      event: {
        title: "Event Details",
        name: parsedData.eventName || "Not specified",
        date: parsedData.date || "Not specified",
        time: parsedData.time || "Not specified",
        mode: parsedData.mode || "Not specified",
        organizer: parsedData.organizingDepartment || "Not specified",
        coordinator: parsedData.facultyCoordinator || "Not specified",
      },
      participants: {
        title: "Participation Details",
        students: parsedData.totalStudentParticipants || 0,
        faculty: parsedData.totalFacultyParticipants || 0,
        total:
          (parsedData.totalStudentParticipants || 0) +
          (parsedData.totalFacultyParticipants || 0),
      },
      content: {
        title: "Event Content",
        description: parsedData.description || "Not specified",
        outcome: parsedData.programOutcome || "Not specified",
        feedback: parsedData.feedback || "Not specified",
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
