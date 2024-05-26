# Project setup
First instal all dependecies with command `npm i`
Second build project with command `npm run build`
Third to start project use command `npm start`

# Questions and answers

1. What is a URL shortening system?
- URL shortening system is a way where you give long, original URL and want to transform it to be short. You would get an alias for that long URL or just a shorter URL. 

2. What's the main value? Who needs such a system and why?
- The main value is to save space and get shorter URL, easier to manage and use it. This system is needed because URL are displayed on twitter, instagram.. and it is easier for people to remember and not to mistype it. 

3. Describe The main mechanism of work and system components ?
- The system has multiple parts. The idea is when user gives long URL to get short one, store it in the database, give user back shortened URL and when he uses that short URL system redirects it to the original URL. In the database what needs to be stored is original URL, short URL, number of clicks (we want to know how many times short URL was used), Date of usage and/or creation, short part of URL without http base. There has to be a redirection system to redirect to original URL when short is used and a system of transforming to short. There are various ways to transform, many libraries (I have used nanoid which gives it uses random alphabet, number and dash), the goal is to set short part to be string of 6,7 length and store it in the database. When the user inserts a short URL, we need to find in database the original and take that and redirect it.

4. What do you think are the main challenges in implementing and running the system ?
- Challenges that I have encountered were trying to get URLs from database in last 24h, the logic and how to do it. In general, the main challenges would be to design a good bulletproof logic system and database.

5. Try to suggest some ideas for advanced features.
- Some ideas for advanced system would be to give option for user to choose his alias for short URL link, set time for short URL after which it is invalid