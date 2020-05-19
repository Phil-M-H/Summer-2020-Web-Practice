# ThingAWeek

Created with the goal of self-learning a lot of web development over the Summer. The general plan is to aim for a complete project or a fully developed part of a project every week.

## Week 1 Recap
Focused on creating a backend Node.js server to handle the game "Red Flags". It's a round-based cardgame, where players attempt to set up an ideal date for someone (the players take turns for this part) by playing 2 white cards (which have been distributed from a deck). The players then get to sabotage the player next to them by playing red flags.

### Week 1 Libraries & Technologies
Written using the Express.js web-framework in Node. Utilizes various http routes to play the game. JSON Web Tokens are used for authenticating players.
Manages a lobby-system, wherein users can create a lobby a password, and then give the lobby name and password to other players so that they can join. The creator is the 'admin', and is in control of when the game's rounds advance. 

