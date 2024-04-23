CREATE TABLE movie (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    overview TEXT,
    release_date DATE,
    poster_path VARCHAR(255),
    comment VARCHAR(255)
);