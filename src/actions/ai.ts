"use server";

// import { InferenceClient } from "@huggingface/inference";
import { GoogleGenAI } from "@google/genai";

// const HF_TOKEN = process.env.HF_TOKEN;
// const inference = new InferenceClient(HF_TOKEN);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// export async function generateImage(prompt: string) {
//   try {
//     console.log("start generating...");
//     const result = await inference.textToImage({
//       model: "black-forest-labs/FLUX.1-dev",
//       inputs: prompt,
//     });
//     console.log(result)
//     return result;

//     // const buffer = Buffer.from(result.);
//     // console.log("stop generating...");
//     // return {
//     //   type: result.type,
//     //   buffer,
//     // };
//   } catch (error) {
//     console.error(error);
//     throw new Error("Image generation failed: " + error.message);
//   }
// }

export async function talkToAI(userInput: string, currentPage: string, lastResponse: string) {
  const prompt = `
You are an intelligent assistant inside a social media app.  
Return EXACTLY ONE JSON object (no markdown, no extra text).  

RULES:
- Always include "response".
- "response" must be a natural description of the action done.  
- If an action is not valid on the current page, output {"action":"unsupported","message":"...","response":"..."}.

--- Page Rules ---
Home: navigate, like_post, unlike_post, save_post, unsave_post, delete_post, comment  
Create-post: create_post, navigate  
Edit-post: edit_post, delete_post, navigate  
Post-details: like_post, unlike_post, save_post, unsave_post, comment, delete_post, navigate  
Bookmarks: unsave_post, navigate  
Profile: delete_post, navigate  
People: search, navigate  
Search: search, navigate 

--- JSON Schemas:

1) Greet
{
  "action": "greet",
  "response": "Friendly greeting"
}

2) Home page (allowed: navigate, like_post, unlike_post, save_post, delete_post, unsave_post, comment)
Unsupported:
{
  "action": "unsupported",
  "message": "Explanation why unsupported",
  "response": "Natural response explaining why the action can’t be done here"
}

3) Create Post page
Create:
{
  "action": "create_post",
  "title": "Required - Generated title",
  "image_prompt": "Required - Generated image prompt",
  "location": "Required - Generated location (max 2 words)",
  "tags": Required - ["Generated tags (max length 3)"],
  "response": "Required - Natural response of action done about post creation"
}

4) Edit Post page
Edit:
{
  "action": "edit_post",
  "title": "New title or null",
  "image_prompt": "New prompt or null",
  "location": "New location or null",
  "tags": ["Generated tags (or \\"null\\" if not provided, max length 3)"],
  "response": "Natural response of action done about post update"
}

5) Like / Unlike / Save / Unsave
{ "action": "like_post", "response": "Natural response of action done" }
{ "action": "unlike_post", "response": "Natural response of action done" }
{ "action": "save_post", "response": "Natural response of action done" }
{ "action": "unsave_post", "response": "Natural response of action done" }

6) Comment
{ "action": "comment", "message": "Comment text", "response": "Natural response of action done" }

7) Delete
Normal flow:
{
  "action": "confirm_delete",
  "response": "Natural response of telling the user if the want to go ahead",
}
If user explicitly allows without confirmation:
{ "action": "delete_post", "response": "Natural response of action done" }
If user cancels:
{ "action": "cancel_delete", "response": "Natural response telling the user the cancellation" }

8) Search
{ "action": "search", "query": "Search query", "response": "Natural response of action done about search" }

9) Navigate
{ "action": "navigate", "destination": "/ (as home)|create-post|edit-post|bookmarks|people|search|profile|post-details", "response": "Natural response of action done about navigation" }

10) Unknown/Unsupported
{ "action": "unsupported", "message": "Explanation why unsupported", "response": "Natural response explaining why the action can’t be done" }

--- End schemas.  
USER INPUT: "${userInput}"
CURRENT PAGE: "${currentPage}"
LAST RESPONSE: "${lastResponse}"  
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const contentText = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!contentText) throw new Error("No response from AI");

    const cleaned = cleanAIResponse(contentText);
    return cleaned;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error(error instanceof Error ? error.message : "AI interaction failed");
  }
}

function cleanAIResponse(contentText: string): string {
  let cleaned = contentText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  cleaned = cleaned.replace(/```[a-z]*/gi, "").trim();

  return cleaned;
}