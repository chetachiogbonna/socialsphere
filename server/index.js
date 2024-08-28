import express from "express"
import cors from "cors"
import { HfInference } from "@huggingface/inference";
import { configDotenv } from "dotenv";
import { GoogleGenerativeAI } from '@google/generative-ai';

configDotenv()
const PORT = process.env.PORT || 3500;

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const inference = new HfInference(HF_TOKEN);

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
const genAI  = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const generateImage = async ({ inputs }) => {
  try {
    console.log("start generating...")
    const result = await inference.textToImage({
      model: 'black-forest-labs/FLUX.1-dev',
      inputs
    })
    console.log("stop generating...")
  
    console.log(result)
    return result;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

const talkToAI = async (userInput) => {
	const prompt = `
  You are an intelligent assistant designed to interpret user commands within a social media application. Analyze the following user input and determine the intended action. Based on the identified action, extract or generate the necessary details and respond in the specified JSON format.

  **Actions to identify:**

  1. **Greet AI**:
     - **Details to extract/generate**:
       - None
     - **Response format**:
       \`\`\`json
       {
         "action": "greet",
         "response": "Generate or extract"
       }
       \`\`\`

	**Guidelines:**

  2. **Home Page ("/"):**
     - **Allowed Actions:**
       - Navigate to another page
       - Like a post
       - Save a post
       - Comment on a post
     - **Response for Unsupported Actions:**
       - If the user attempts an action not listed above, respond with:
         \`\`\`json
         {
           "action": "unsupported",
           "message": "This action cannot be performed on the Home page."
         }
         \`\`\`
       - If the action can be performed on a different page, ask the user if they would like to navigate to that page:
         \`\`\`json
         {
           "action": "navigate_suggestion",
           "message": "This action can be performed on the [Page Name] page. Would you like to navigate there?"
         }
         \`\`\`

  3. **Create Post Page ("/create-post"):**
     - **Allowed Actions:**
       - Create a new post
       - Navigate to another page
     - **Response for Unsupported Actions:**
       - If the user attempts an action not listed above, respond with:
         \`\`\`json
         {
           "action": "unsupported",
           "message": "This action cannot be performed on the Create Post page."
         }
         \`\`\`
       - If the action can be performed on a different page, ask the user if they would like to navigate to that page:
         \`\`\`json
         {
           "action": "navigate_suggestion",
           "message": "This action can be performed on the [Page Name] page. Would you like to navigate there?"
         }
         \`\`\`

  4. **Create Post:**
    - **Title:** The heading of the post.
    - **Image Prompt:** The description for the image associated with the post.
    - **Location:** The geographical location related to the post.
    - **Tags:** Keywords or hashtags associated with the post.

    - **Response Format:**
      - Provide the updated components in JSON format:
        \`\`\`json
        {
          "title": "Generated title (required)",
          "image_prompt": "Generated image prompt (required)",
          "location": "Generated location (required)",
          "tags": ["Generated tags (required)"]
        }
        \`\`\`

  5. **Edit Post Page ("/edit-post"):**
     - **Allowed Actions:**
       - Create a new post
       - Navigate to another page
     - **Response for Unsupported Actions:**
       - If the user attempts an action not listed above, respond with:
         \`\`\`json
         {
           "action": "unsupported",
           "message": "This action cannot be performed on the Create Post page."
         }
         \`\`\`
       - If the action can be performed on a different page, ask the user if they would like to navigate to that page:
         \`\`\`json
         {
           "action": "navigate_suggestion",
           "message": "This action can be performed on the [Page Name] page. Would you like to navigate there?"
         }
         \`\`\`

  6. **Edit Post:**
    - **Title:** The heading of the post.
    - **Image Prompt:** The description for the image associated with the post.
    - **Location:** The geographical location related to the post.
    - **Tags:** Keywords or hashtags associated with the post.

    - **User Intent:**
      - Identify which components the user wishes to edit.
      - If the user specifies certain components (e.g., only the title), generate updates for only those parts.
      - If the user requests multiple components to be edited, generate updates accordingly.
  
    - **Response Format:**
      - Provide the updated components in JSON format:
        \`\`\`json
        {
          "title": "Generated title (or "null" if not provided)",
          "image_prompt": "Generated image prompt (or "null" if not provided)",
          "location": "Generated location (or "null" if not provided)",
          "tags": ["Generated tags (or "null" if not provided)"]
        }
        \`\`\`

  7. **Like Post**:
     - **Details to extract/generate**:
       - **User intent to like a post**
     - **Response format**:
       \`\`\`json
       {
         "action": "like_post"
       }
       \`\`\`

  8. **Unlike Post**:
     - **Details to extract/generate**:
       - **User intent to unlike a post**
     - **Response format**:
       \`\`\`json
       {
         "action": "unlike_post"
       }
       \`\`\`

  9. **Save Post**:
     - **Details to extract/generate**:
       - **User intent to save a post**
     - **Response format**:
       \`\`\`json
       {
         "action": "save_post"
       }
       \`\`\`

  10. **Unsave Post**:
     - **Details to extract/generate**:
       - **User intent to unsave a post**
     - **Response format**:
       \`\`\`json
       {
         "action": "unsave_post"
       }
       \`\`\`

  11. **Comment on Post**:
     - **Details to extract/generate**:
       - Comment message
     - **Response format**:
       \`\`\`json
       {
         "action": "comment",
         "message": "Generated or extracted comment message"
       }
       \`\`\`

  12. **Delete a Post**:
     - **Details to extract/generate**:
       - User intent to delete a post.
     - **Response format**:
       \`\`\`json
       {
         "action": "delete_post",
       }
       \`\`\`

  13. **Messaging with a friend**
      - **Details to extract/generate**:
        - **User intent to unsave a post**
          - ** If the user intent talks about sending image 
            - **Response format**:
              \`\`\`json
              {
                "action": "send_image",
                "image_description": "Generate or extract with description"
              }
              \`\`\`
          - ** Else if the user intent talks about sending a text
            - **Response format**:
              \`\`\`json
              {
                "action": "send_text",
                "text_message": "Generate or extract text message"
              }
              \`\`\`


  14. **Navigate to Page**:
     - **Details to extract/generate**:
       - Destination page
     - **Available pages**:
       - create-post
       - edit-post
       - home
       - bookmarks
       - people
       - messages
       - profile
       - post-details
     - **Response format**:
       \`\`\`json
       {
         "action": "navigate",
         "destination": "Generated or extracted destination page"
       }
       \`\`\`

  15. **Unknown Page Navigation**:
     - If the user mentions navigating to a page not listed above, respond with:
       \`\`\`json
       {
         "action": "ai_speak",
         "description": Generate/extract"
       }
       \`\`\`

  **User input**: "${userInput}"
`;

  console.log("ai start action")
	try {
		const response = await model.generateContent(prompt);
		return response;
	} catch (error) {
		console.error('Error generating post details:', error);
		throw error;
	}
}

app.get("/", async (_, res) => {
	res.status(200).send("Hello, from socialsphere server.")
})

app.post("/generate-image", async (req, res) => {
	try {
		const imageBlob = await generateImage({ "inputs": req.body.prompt });
    const imageBuffer = await imageBlob.arrayBuffer()
    res.writeHead(200, { "Content-Type": imageBlob.type });
    const buffer = Buffer.from(imageBuffer);
    res.end(buffer);
	} catch (error) {
		console.log(error)
		throw error;
	}
})

app.post("/talk-to-ai", async (req, res) => {
  console.log("start generating")
	try {
		const { response } = await talkToAI(req.body.prompt)
    const contentText = response.candidates[0].content.parts[0].text;
    const jsonString = contentText.replace(/```json\n|```/g, '').trim();

		console.log(JSON.stringify(response))
		res.json(jsonString)
	} catch (error) {
		console.log(error)
		throw error;
	}
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});