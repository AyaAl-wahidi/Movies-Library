'use strict'

require('dotenv').config();
const axios = require('axios');
const express = require('express');
const PORT = process.env.PORT || 3003;
const API_KEY = process.env.API_KEY;
const app = express();
const bodyParser = require('body-parser')
const data = require("./MovieData/data.json");

//bodyParser json part
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const { Client } = require('pg');
// const url = 'postgres://aya:0000@localhost:5432/demo';
const url = 'postgres://feopbypv:s1o738imrXWDMI_Q7liE6m5ehmvRoavW@lallah.db.elephantsql.com/feopbypv';
const client = new Client(url);

// To connect the server
client.connect()
    .then(() => {
        app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
    })
    .catch();

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
    const url = `https://api.themoviedb.org/3/search/movie?query=${searchMovieName}&api_key=${API_KEY}&language=en-US&page=1`;
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

// Rout to add new Movie
app.post('/addMovie', (req, res) => {
    console.log(req.body);
    const { title, overview, release_date, poster_path, comment } = req.body;

    const sql = 'INSERT INTO movie ( title, overview, release_date, poster_path, comment) VALUES($1, $2, $3, $4, $5) RETURNING *;'
    const values = [title, overview, release_date, poster_path, comment];
    client.query(sql, values).then((result) => {
        console.log(result.rows);
        res.status(201).json(result.rows);
    })
        .catch(error => {
            console.log(error);
        })
});

// Rout to get all the Movies
app.get('/getMovies', (req, res) => {
    const sql = 'SELECT * FROM movie;'

    client.query(sql)
        .then((result) => {
            const data = result.rows;
            res.json(data);
        })
        .catch(error => {
            console.log(error);
        })
});

// Rout to edit specific movie bi the id
app.put('/editMovieById/:id', (req, res) => {

    let editData = req.params.id;
    let { title, overview, release_date, poster_path, comment } = req.body;
    const sql = `UPDATE movie SET title = $1, overview = $2, release_date = $3, poster_path = $4, comment = $5 WHERE id = ${editData};`
    const values = [title, overview, release_date, poster_path, comment];
    client.query(sql, values).then((result) => {
        if (result.rowCount === 0) {
            // No row was deleted, send a different response
            res.status(404).send(`No movie found with id: ${id}`);
        } else {
            // A row was deleted, send a success response
            res.send("Successfully edited");
        }
    })
        .catch(error => {
            console.log("An error occurred while deleting the movie.", error);
        })
});

// Rout to delete a record data based by id from movies list
app.delete('/deleteMovieById/:id', (req, res) => {

    let { id } = req.params;
    const sql = 'DELETE FROM movie WHERE id = $1;'
    const values = [id];
    client.query(sql, values).then((result) => {
        if (result.rowCount === 0) {
            // No row was deleted, send a different response
            res.status(404).send(`No movie found with id: ${id}`);
        } else {
            // A row was deleted, send a success response
            res.send(`Successfully deleted the movie with id: ${id}`);
        }
    })
        .catch(error => {
            console.log("An error occurred while deleting the movie.", error);
        })
});

// Rout to get one specific movie based by id
app.get('/getMovie/:id', (req, res) => {

    let { id } = req.params;
    const sql = 'SELECT * FROM movie WHERE id = $1;'
    const values = [id];
    client.query(sql, values).then((result) => {
        if (result.rowCount === 0) {
            // No row was deleted, send a different response
            res.status(404).send(`No movie found with id: ${id}`);
        } else {
            res.json(result.rows);
        }
    })
        .catch(error => {
            console.log("An error occurred while gitting the movie data.", error);
        })
});

// Error handler for server errors (status 500)
app.use((req, res) => {
    res.status(500).json({ stutus: 500, responseText: "Sorry, something went wrong." });
});

// Error handler for server errors (status 500)
app.use((req, res, next) => {
    res.status(404).json({ stutus: 404, responseText: "Page not found." });
});