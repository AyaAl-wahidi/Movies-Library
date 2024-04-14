# Aya Movies App - v 1.0.0

**Author Name**: Aya Al-wahidi

## WRRC
![Web Request Response Cycle](/WRRC.jpg)

## Overview
The Movies app is a web server that serves data related to the latest movies and their details, as well as providing access to a favorite page. It allows users to fetch movie data using different endpoints and provides an error handling mechanism for a better user experience.

## Getting Started
- Clone the repository
- Install dependencies
- Start the server
- The server should now be running on port 3000 (or the specified port in your server configuration). You can test the server using a tool like Postman or by visiting the following URLs in your web browser:

Home Page: http://localhost:3000/
Favorite Page: http://localhost:3000/favorite

## Project Features
List the features of the app:

Home Page Endpoint: Provides information about the latest movies in JSON format.
Favorite Page Endpoint: Returns a welcome message.
Error Handling: Handles errors such as 404 (page not found) and 500 (server error) gracefully and returns appropriate JSON responses.