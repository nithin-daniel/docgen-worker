import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API;

// Initialize Google Generative AI with the API key
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
    Feedback:${event_feedback} 
    Don't change the above format and also use professional sentences and make the program description and outcome more DESCRIPTIVE for that use some gap contents (Only give the proper result only).`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  // console.log(text);

  // Extract data from the generated text using regular expressions
  //   const extractData = (text, label) => {
  //     const regex = new RegExp(`\\*\\*${label}:\\*\\* ([^\\n]+)`);
  //     const match = text.match(regex);
  //     return match ? match[1].trim() : "";
  //   };

  //   const extractMultilineData = (text, label) => {
  //     const regex = new RegExp(`\\*\\*${label}:\\*\\*([\\s\\S]*?)(\\*\\*|$)`);
  //     const match = text.match(regex);
  //     return match ? match[1].trim() : "";
  //   };

  //   const data = {
  //     eventName: extractData(text, "Event/Program Name"),
  //     date: extractData(text, "Date"),
  //     time: extractData(text, "Time"),
  //     organizingDept: extractData(text, "Organizing Department/Club/Cell"),
  //     studentParticipants: extractData(text, "Total Student Participants"),
  //     facultyParticipants: extractData(text, "Total Faculty Participants"),
  //     mode: extractData(text, "Mode of Event (Online/Offline)"),
  //     coordinator: extractData(text, "Faculty Coordinator"),
  //     description: extractMultilineData(text, "Brief Event/Program Description"),
  //     Highlight: extractMultilineData(text, "Key Highlights"),
  //     outcome: extractMultilineData(text, "Program Outcome"),
  //     plan: extractMultilineData(text, "Future Plans"),
  //     Feedback: extractMultilineData(text, "Feedback"),
  //   };
  // console.log(data);
  return text;
}
