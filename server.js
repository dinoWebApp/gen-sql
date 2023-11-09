const { OpenAI } = require('openai');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
require('dotenv').config();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
})

app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.post('/convert', async (req, res)=>{
  
  const naturalLanguage = req.body.data;
  try {
    const openai = new OpenAI({
      apiKey : process.env.API_KEY
    });
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: `give me sql for "${naturalLanguage}". I will use your response in code directly. So you must not use any other words without sql.` }],
      model: "gpt-3.5-turbo",
    });
    res.send({
      message : 'convert success',
      sql : response.choices[0].message.content
    })
  } catch (error) {
    console.log(error);
  }

})
