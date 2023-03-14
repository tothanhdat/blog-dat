const route             = require('express').Router();
const { renderToView }  = require('../utils/childRouting');
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration);

route.get('/new-vocabulary', async (req, res) => {
    let { topic } = req.query;
    let addTopic = topic ? `on ${topic} topic` : '';
    let questionRespondVocabulary = `
        Please give me random an English vocabulary word ${addTopic} and its Vietnamese meaning, then provide two example sentences using that word by english and vietnamese. 
        The structure is as follows:
        english word (type word): vietnamese meaning
        pronunciation english word

        English: english example sentences 1
        Vietnamese: Vietnamese meaning

        English: english example sentences 2
        Vietnamese: Vietnamese meaning`

    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'user', content: questionRespondVocabulary }
        ],
        temperature: 0.5,
        max_tokens: 550,
    })
    renderToView(req, res, 'pages/learning-english.ejs', {contentShall: completion.data.choices[0].message.content});

})


module.exports = route;