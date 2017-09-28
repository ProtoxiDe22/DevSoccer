
# DevSoccer
A Javascript game about programming a soccer team
# Overview
DevSoccer is a javascript game in which the user can submit a javascript file, containing the istructions which will serve as the players AI of one of the teams, in a soccer match played in an HTML 5 canvas. Your AI can compete with any other AI written by other developers.
The game will create 11 players for each of the two given AIs, it will give them the needed info about the match and it will ask each "player" what to do for each turn (or frame) of the match
# Instructions
### basics
The submitted file should contain a javascript prototype called CustomPlayer, this prototype should have two functions: `init(team, number, matchinfo)` and `turn(status)`.

The `init` function is called once per game, at the beginning and should return an array of two integers which will be the starting coordinates of that player (see Rules paragraph to know what these should be exactly).  
The three arguments give you basic information about the match and the player:  
team (`0` or `1`) represents the team you are on.  
number (integer from `0` to `10`) represent the index of the player in the team. Note that player 0 will be you goalkeeper, more on that later.  
matchinfo is an object which will contain useful information about the setup of the match, like the size of the playing field and more (check the matchinfo paragraph to know exactly what do they mean)

The `turn` function is called once per frame and should return an object with info about what the player will do for that frame, what a player can do will be explained in the next section.  
The argument is an object which contains all information about the current state of the game, that is position and movement of each player and the ball.

A template for the file you should submit is included in the code (js/testTeam.js).  
once you are done writing you AI (or you want to test it), open index.html, select the two AI files and click "Start Game".

the players and the ball always move on the field with a given speed (the number of units that entity moves per frame) and the coordinates start at (0,0) in the top left corner, this means that moving with positive x speed means moving to the right, negative x speed means left, positive y means down and negative y means up.

The objective of each team is (obviously i would say) to put the ball in their opponents goal, and defend their one.  
The goals are placed at `x = 0` and `x = MAXX` (the left and right edges of the field), and their width and Y coordinates are supplied in the variables `GOALSIZE` and `GOALCOORDINATES`.  
Team0 starts in the left side of the field must defend the goal at `x = 0` and score in the goal at `x = MAXX`, team1 starts on the right side of the field and... you get it.

### turns and what you can do
in DevSoccer each frame every player decides what he should do next. A player can increase/decrease his speed  in a given direction and try to kick the ball simultaneously.

Kicking the ball means to set its exact speed and a player can do that only if is close enough to the ball (the distance from the player to the ball should be less than the value set in the match variable `INFLUENCEZONE`, except for the goalkeeper which i'll talk about later).  
To try kick the ball a player should set at least one between `ball.speedX` and `ball.speedY` in the `turn()` return object.  
If more than a player tries to kick the ball in the same frame, the successful kick will be selected at random between all of kick attempts, the closer a player is to the ball, the highest is the probability of his kick to succeed over the others.  
Regardless of how many try to kick the ball there will always be a probability of missing the ball.  
The ball's speed also decays over time if noone kicks it.  
If the ball is kicked against the border of the field, it will be simply bounced off it, as if there was a wall

Moving the players is a different story. A player cannot go from standing to his top speed in just a frame, nor can it invert his direction alltogether while mantaining full speed, that's why, for each turn a player can only modify his speed by a certain amount.  
To modify the speed of a player, you should set at least one between `player.deltaSpeedX` and `player.deltaSpeedY` in the `turn()` return object.  
If both of them are left 0, the speed of the player will remain the same as the previous frame.   
The maximum variation each player can apply to his speed each turn is defined in the match variable `MAXVARIATION`, while the maximum speed he can achieve is defined in the variable `MAXSPEED`  
If a player tries to move outside the field... he moves out of the field. please try not to overflow the coordinate variables :blue_heart:

### the Goalkeeper

as already stated, in both teams, player number 0 is the goalkeeper of the team. the goalkeeper works the same as any other player, but if close enough to his team's goal (on the x axis) he will be able to hit the ball from further than the others and it will have more probability than the normal to be the one who kicks the ball.  
This means that if the goalkeeper X distance is less than a given value (you can find that in the `GOALKEPERLIMIT` variable), his  `INFLUENCEZONE` will be overridden by an higher number (stored in `GOALKEEPERINFZONE`), and his attempt to kick will be (at same distance from the others) more relevant than the others when choosing at random between all the kick attempts.

# `matchinfo` and `status`
this paragraph describes in detail what's in the two objects passed to your functions, take this as a reference to what each of the field means.

### `matchinfo`
* `matchinfo.MAXX` the highest X coordinate of the playing field
* `matchinfo.MAXY` the highest Y coordinate of the playing field
* `matchinfo.MAXSPEED` the maximum speed that a player can achieve by speeding up
* `matchinfo.MAXVARIATION` the maximum change in speed in a frame
* `matchinfo.INFLUENCEZONE` the maximum distance at which a normal player (or goalkeeper outside his bonus limit) can attempt a kick
* `matchinfo.GOALKEEPERINFZONE` the maximum distance at which a goalkeeper inside his bonus zone can attempt a kick
* `matchinfo.GOALKEEPERLIMIT` the maximum X axis distance from his team's goal in which a goalkeeper is granted his bonuses
* `matchinfo.MAXBALLSPEED` the maximum speed that a player can set on the ball with a kick
* `matchinfo.GOALSIZE` the width of the goal
* `matchinfo.GOALCOORDS` an array of two elements, containing the Y coordinates at which the goals are.

### `status`
* `status.ballStatus` object. contains the status of the ball
* `status.ballStatus.x` X coordinate of the ball
* `status.ballStatus.y` Y coordinate of the ball
* `status.ballStatus.speedX` speed of the ball on the X axis
* `status.ballStatus.speedY` speed of the ball on the Y axis
* `status.teamsStatus` array containing 2 arrays, stores the position and speed of all players
* `status.teamStatus[team][player].x` X coordinate of the player on team `team` with number `player`
* `status.teamStatus[team][player].y` Y coordinate of the player on team `team` with number `player`
* `status.teamStatus[team][player].speedX` speed of the player on team `team` with number `player` on the X axis
* `status.teamStatus[team][player].speedY` speed of the player on team `team` with number `player` on the Y axis

# Notes
this sections contains a set of rules and clarification which are not included in the Instructions section

### Initial positions
At the beginning of the game, the function init() is called one time for each instance of your player. it should return an array with an X and an Y coordinates which should be a valid starting position for that team.  
All the positions should be inside the playing field, so both the coordinates will have to be greater than 0, and smaller than the maximum size for that axis.  
Team0 should begin in the left side of the field, so the the X coordinate should comply with `x<MAXX/2`, on the other hand, the team1 starting X coordinate should be `x>MAXX` because they start on the right side of the field.  
Please always make sure that your Prototype is able to return correct positions for both sides, otherwise, when someone tries to challenge your AI and uses your file on the other team, the match could not start.

### Oblique speed
right now there's no check on the actual speed the players are at. they can simply move up to `MAXSPEED` on the x axis and up to `MAXSPEED`on the Y axis in the same frame. that means that moving at full speed in oblique direction is actually faster than going full speed while only moving on an axis. this will be probably fixed sooner or later.  
The same as above applies to the ball, with `MAXBALLSPEED`

# Conclusion
I hope you will have fun with DevSoccer. If this has somewhat popularity, i might add something where to share AIs. in the meantime, if you made an AI for DevSoccer i would be pretty happy if you shared it with me.
in that case you can find me at Telegram (@Protoh) or via email (dsfabio[at]live.it)