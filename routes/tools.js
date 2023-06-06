const route             = require('express').Router();
const { renderToView }  = require('../utils/childRouting');
const Replicate = require("replicate");
// import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

route.get('/', async (req, res) => {
    renderToView(req, res, 'pages/tools.ejs', {});
})

route.get('/ai-draws/:paramsX', async (req, res) => {
    const { paramsX } = req.params;
    console.log(paramsX);
    const model = "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf";
    const input = { prompt: paramsX };
    const output = await replicate.run(model, { input });
    res.json(output)
})

route.post('/ai-analysis', async (req, res) => {
    const {image, question} = req.body;
    const model = "andreasjansson/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608";
    const input = {image, question};
    const output = await replicate.run(model, { input });
    res.json(output);
})

module.exports = route;