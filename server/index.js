import express from "express"
import cors from "cors"
import axios from "axios"
import { configDotenv } from "dotenv";

configDotenv()
const PORT = process.env.PORT || 3500;

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const generateImage = async (data) => {
	try {
		const url = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";
		const response = await axios.post(url, data, {
			headers: {
				Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
				"Content-Type": "application/json",
			},
			responseType: "arraybuffer"
		});
		const result = await response.data;
		return result;
	} catch (error) {
		console.log(error)
		throw error;
	}
}

app.get("/", async (req, res) => {
	res.status(200).send("Hello, from socialsphere server.")
})

app.post("/", async (req, res) => {
  console.log("start generating")
	try {
		const binaryImage = await generateImage({ "inputs": req.body.prompt });
		console.log("stop generating")
		res.writeHead(200, { "Content-Type": "image/jpeg" });
		res.end(binaryImage);
	} catch (error) {
		console.log(error)
		throw error;
	}
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});