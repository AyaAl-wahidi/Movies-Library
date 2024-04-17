'use strict'

const PORT = 3000;
const app = express();
const express = require('express');
const data = require("./MovieData/data.json");

// To connect the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

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
    const resData = new Movie(data.title, data.poster_path, data.overview);
    res.json(resData);
});

// Error handler for server errors (status 500)
app.use((res) =>{
    res.status(500).json({ stutus : 500 , responseText: "Sorry, something went wrong." });
});

// Error handler for server errors (status 500)
app.use((res) =>{
    res.status(404).json({stutus : 404 , responseText: "Page not found." });
});