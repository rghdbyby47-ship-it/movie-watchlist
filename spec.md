# Letterboxd Premium
## Movie watchlist web application that allows people to rate movies from 1-10, write detailed reviews, read comments of other users, create lists of movies, and decore their personal profiles.
---
## Features
- allow users to log the movies they watched
- allow users to create the lists where they can categorize different movies and name these lists 
- create rating system from 1-10 , use trees as design
- each user must have personal profiles where they can post their top 4 movies, show their recent movie activities, and change their pfp
- suggest users to write a review after they rated the movie
- Movie search
## Scope cut
- Comments on reviews
- Stats Dashboard
- Likes system
## Table 1 (for users)
{
  "id": "string",
  "email": "string",
  "nickname": "string",
  "password": "string",
  "createdAt": "string"
}
## Table 2 (movie database)
{
  "id": "string",
  "title": "string",
  "year": "number",
  "description": "string",
  "genre": ["string"],
  "averageRating": "number"
}
## Tabble 3 (combination of tables 1 and 2)
{
  "id": "string",
  "userId": "string",
  "movieId": "string",
  "userRating": "number",
  "createdAt": "string",
}
---
## Updated Letterboxd is better because we are planning to add AI assistant which will suggest similar movies to users based on their individual preferences and taste.