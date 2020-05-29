# ThingAWeek

Created with the goal of self-learning a lot of web development over the Summer. The general plan is to aim for a complete project or a fully developed part of a project every week.

## Week 1 Recap
Focused on creating a backend Node.js server to handle the game "Red Flags". It's a round-based cardgame, where players attempt to set up an ideal date for someone (the players take turns for this part) by playing 2 white cards (which have been distributed from a deck). The players then get to sabotage the player next to them by playing red flags.
Manages a lobby-system, wherein users can create a lobby a password, and then give the lobby name and password to other players so that they can join. The creator is the 'admin', and is in control of when the game's rounds advance. 

#### Week 1 Libraries & Technologies
Written using the Express.js web-framework in Node. Utilizes various http routes to play the game. [JSON Web Tokens](https://www.npmjs.com/package/jsonwebtoken) are used for authenticating players. Utilized the [bcrypt](https://www.npmjs.com/package/bcrypt) for password storage.

#### Week 1 Reflection
I'm pretty happy with the amount of work I've accomplished over the past week - especially given the complete absence of oversight. I'd really love to go back to this in a few weeks, and try to make it more robust. Such as using MongoDB for long term storage, taking precautions againt XSS-attacks, more standardized input verification, and transitioning the JWT and bcrypt secrets to something more secure than a .json file. In addition, I should have made better use of url/route parameters, rather than such a heavy emphasis on the body of the request. The route parameters would result in slightly less input-verification, but also allow simpler page-refresh and a simpler front end. I think it would also simplify the backend a good bit as well.

### Week 2 Recap
Spent multiple days getting the login page *just* right with html & css, before realizing I should be using Angular Materials. Then spent a day understanding how to properly use Angular binding. What really dragged me down this week was distractions - helping out around the house, looking for summer employment, wastes of time.

### Week 2 Reflection
Pretty disappointing week, in regards to this project. Had to focus more on summer employment which is rather abysmal with the coronavirus still circulating. Began to create the front end using Angular. I think it was a lot harder to learn Angular because it has been months since a class briefly went over it, so there was less foundational knowledge I could draw on. Also html & css needed and received heavy refreshers, only for me to find out that it was infinitely better to use the Angular Material library after wasting days getting the html & css *just* right. 
