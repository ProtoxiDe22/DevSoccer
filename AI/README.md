# DevSoccer - AIs section
In this section you can find more instructions on how to develop your AI and some AI [examples](./samples/).

## Develop your AI

### Required Functions
Code must include `CustomPlayer()` definintion and 2 functions:
* `init()`
* `turn()`
```JS
function CustomPlayer(){
	this.init = function(team, player, match){
		return ;
	};
	this.turn = function(status){
		return ;
	};
}
```

#### function `init(team, player, match)`
Called before the start of the match 1 time for each player.
- parameters
  - team	(number)
    can be 0 or 1; represents the team you are on.
  - player	(number)
    integer from 0 to 10; represent the index of the player in the team. Note that player 0 will be you goalkeeper.
  - match	(object)
    containing following values:
	```JS
		match.MAXX			// (number) the highest X coordinate of the playing field
		match.MAXY			// (number) the highest Y coordinate of the playing field
		match.MAXSPEED			// (number) the maximum speed that a player can achieve by speeding up
		match.MAXVARIATION		// (number) the maximum change in speed in a frame
		match.INFLUENCEZONE		// (number) the maximum distance at which a normal player (or goalkeeper outside his bonus limit) can attempt a kick
		match.GOALKEEPERINFZONE		// (number) the maximum distance at which a goalkeeper inside his bonus zone can attempt a kick
		match.GOALKEEPERLIMIT		// (number) the maximum X axis distance from his team's goal in which a goalkeeper is granted his bonuses
		match.MAXBALLSPEED		// (number) the maximum speed that a player can set on the ball with a kick
		match.GOALSIZE			// (number) the width of the goal
		match.GOALCOORDS		// (object) array of two elements, containing the Y coordinates at which the goalposts are
			match.GOALCOORDS[0]	  // (number) Y coordinate of first goalpost
			match.GOALCOORDS[1]	  // (number) Y coordinate of second goalpost
	```
  
- return

	an array defined as follows:
	```JS
	[
		value,	// (number) containing start position on x axis of this player
		value	// (number) containing start position on x axis of this player
	]
	```
	
#### function `turn(status)`
Called during the match 1 time for each player in every timeframe.
- parameters
  - status	(object)
    ```JS
	status.ballStatus					// (object) contains the status of the ball
		status.ballStatus.x				  // (number) X coordinate of the ball
		status.ballStatus.y				  // (number) Y coordinate of the ball
		status.ballStatus.speedX			  // (number) speed of the ball on the X axis
		vtatus.ballStatus.speedY			  // (number) speed of the ball on the Y axis
	status.teamsStatus					// (object) array contains 2 arrays, stores the position and speed of all players (team=[0,1]) 
		status.teamsStatus[team]			  // (object) array contains team's players position and speed (player=[0,1,2,3,4,5,6,7,8,9,10])
			status.teamsStatus[][player]		    // (object) object contains player position and speed
				status.teamsStatus[][].x	      // (number) X coordinate of the player on team team with number player
				status.teamsStatus[][].y	      // (number) Y coordinate of the player on team team with number player
				status.teamsStatus[][].speedX	      // (number) speed of the player on team team with number player on the X axis
				status.teamsStatus[][].speedY	      // (number) speed of the player on team team with number player on the Y axis
	}
	```
  
- return

    an object defined as follows:
	```JS
	{
		player:
		{
			deltaSpeedX: value,	// (number) containing the speed variation required on y axis for this player
			deltaSpeedY: value	// (number) containing the speed variation required on y axis for this player
		},
		ball:
		{
			thisspeedX: value,	// (number) containing the speed this player try to impress to the ball on x axis
			thisspeedY: value	// (number) containing the speed this player try to impress to the ball on y axis
		}
	}
	```

### Other info
This manual is still in development, please refer to the main [README](../README.md) file to get al necessary informations.

[Here](./template.js) you can find a template file.

## Update your AI
At the moment there isn't any common repository so just share a link or push into this project.

## Contribute to the project
Fell free to join and make this game better.