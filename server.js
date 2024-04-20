'use strict'

require('dotenv').config();
const axios = require('axios');
const express = require('express');
const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;
const app = express();
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

function MovieData(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

// Rout to get Trending movies
app.get('/trending', (req, res) => {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`;
    axios.get(url)
        .then(key => {
            let movieData = key.data.results.map(key => {
                return new MovieData(key.id, key.title, key.release_date, key.poster_path, key.overview);
            })
            res.json(movieData);
        })
        .catch(error => {
            console.error(error);
        });
});

// Rout to search on specific movie
app.get('/search', (req, res) => {
    let searchMovieName = req.query.title;
    const url = `https://api.themoviedb.org/3/search/movie?query=${searchMovieName}&api_key=${API_KEY}&language=en-US`;
    axios.get(url)
        .then(result => {
            let movieData = result.data.results.map(key => {
                return new MovieData(key.id, key.original_title, key.release_date, key.poster_path, key.overview);
            })
            res.json(movieData);
        })
        .catch(error => {
            console.log(error);
        })
})

// Rout to get movies depends on region
app.get('/region', (req, res) => {
    let regionName = req.query.title;
    const url = `https://api.themoviedb.org/3/search/movie?query=Whiplash&region=${regionName}&api_key=${API_KEY}&language=en-US`;
    axios.get(url)
        .then(result => {
            let movieData = result.data.results.map(key => {
                return new MovieData(key.id, key.title, key.release_date, key.poster_path, key.overview);
            })
            res.json(movieData);
        })
        .catch(error => {
            console.log(error);
        })
});

// Rout to get popular movies
app.get('/popular', (req, res) => {
    const url = `https://api.themoviedb.org/3/discover/tv?include_adult=false&page=1&sort_by=popularity.desc&api_key=${API_KEY}&language=en-US`;
    axios.get(url)
        .then(result => {
            let movieData = result.data.results.map(key => {
                return new MovieData(key.id, key.original_name, key.first_air_date, key.poster_path, key.overview);
            })
            res.json(movieData);
        })
        .catch(error => {
            console.log(error);
        })
});

// Rout to get favorite page
app.get('/favorite', (req, res) => {
    const resData = new DataFormat("Welcome to Favorite Page");
    res.json(resData);
});

// Rout to get home page movies
app.get('/', (req, res) => {
    const resData = new Movie(data.title, data.poster_path, data.overview);
    res.json(resData);
});

// Error handler for server errors (status 500)
app.use((req, res) => {
    res.status(500).json({ stutus: 500, responseText: "Sorry, something went wrong." });
});

// Error handler for server errors (status 500)
app.use((req, res, next) => {
    res.status(404).json({ stutus: 404, responseText: "Page not found." });
});