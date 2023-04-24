// require("dotenv").config();
import express from 'express'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const port = process.env.PORT || 5050;

const app = express();
// app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Codex',
  })
});

app.post("/ask", async (req, res) => {
    const prompt = req.body.question;

    try {
      if (prompt == null) {
        throw new Error("請提供問題 Please provide a prompt");
      }

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user", 
          content: prompt 
        }],
        // model: "text-davinci-003",
        // prompt,
        // temperature: 0.7,
        // max_tokens: 64,
        //top_p:1,
        // frequency_penalty: 0,
        // presence_penalty: 0,
        // stop: ["\"\"\""],    
      })
      // const completion = response.data.choices[0].text;
       const completion = response.data.choices[0].message.content;

      return res.status(200).json({
        success: true,
        message: completion
      });
    } 
    catch (err) {
      console.error(err);
      res.status(500).send({err});
      console.log(err.message);
    }
  });
  
  app.listen(port, 
    () => console.log(`Server is running on port http://localhost:${port} !`)
  );
