'use strict'

const express = require('express');
const app = express();
const PORT = 3000;

function DataFormat(Message) {
    this.Message = Message;
}

function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

app.get('/favorite', (req, res) => {
    const resData = new DataFormat("Welcome to Favorite Page");
    res.json(resData);
});

app.get('/', (req, res) => {
    const resData = new Movie("Spider-Man: No Way Home", "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.");
    res.json(resData);
});

// To connect the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

// Error handler for server errors (status 500)
function handleServerError(err, req, res, next) {
    res.status(500).json({ stutus : 500 , responseText: "Sorry, something went wrong." });
}

// Error handler for page not found (status 404)
function handlePageNotFound(req, res, next) {
    res.status(404).json({stutus : 404 , responseText: "Page not found." });
}

app.use(handlePageNotFound);
app.use(handleServerError);