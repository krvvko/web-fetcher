import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files from the 'public' folder


app.get('/fetchWeb', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        res.status(400).send('Missing URL parameter');
        return;
    }
    try {
        const response = await fetch(url);
        const html = await response.text();
        res.send(html);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error fetching data');
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
