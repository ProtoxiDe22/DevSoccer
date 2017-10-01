
function CustomPlayer(){
    this.team	=	undefined;
	this.player	=	undefined;
	this.match	=	undefined;
	
	/*
		this.init
			parameters
				team:	a number (0 or 1) representing your team. can be: 
							0	your team defend the left side goal.
							1	your team defend the right side goal.
				player:	a number (between 0 and 10) representing your player id.
						if it's 0 this player is your goalkeeper, otherwise it's a normal player.
				match:	an object defined as follows:
						{
							.MAXX				(number)	the highest X coordinate of the playing field
							.MAXY				(number)	the highest Y coordinate of the playing field
							.MAXSPEED			(number)	the maximum speed that a player can achieve by speeding up
							.MAXVARIATION		(number)	the maximum change in speed in a frame
							.INFLUENCEZONE		(number)	the maximum distance at which a normal player (or goalkeeper outside his bonus limit) can attempt a kick
							.GOALKEEPERINFZONE	(number)	the maximum distance at which a goalkeeper inside his bonus zone can attempt a kick
							.GOALKEEPERLIMIT	(number)	the maximum X axis distance from his team's goal in which a goalkeeper is granted his bonuses
							.MAXBALLSPEED		(number)	the maximum speed that a player can set on the ball with a kick
							.GOALSIZE			(number)	the width of the goal
							.GOALCOORDS			(object)	array of two elements, containing the Y coordinates at which the goalposts are
								.this[0]		 (number)	Y coordinate of first goalpost
								.this[1]		 (number)	Y coordinate of second goalpost
						}
							
			return	[startPositionX,startPositionY]
				an array containing 2 number:
				[
					startPositionX			(number)	containing start position on x axis of this player
					startPositionY			(number)	containing start position on x axis of this player
				]
	*/
	this.init = function (team, player, match) {	//called one time for each player at start of the match
        this.team	=	team;
        this.player	=	player;
		this.match	=	match;
		
        return [ null , null ];
    };
	
	/*
		this.turn
			parameters
			status:		an object defined as follows:
						{
							.ballStatus				(object)	contains the status of the ball
								.this.x				 (number)	X coordinate of the ball
								.this.y				 (number)	Y coordinate of the ball
								.this.speedX		 (number)	speed of the ball on the X axis
								.this.speedY		 (number)	speed of the ball on the Y axis
							.teamsStatus			(object)	array contains 2 arrays, stores the position and speed of all players
								.this[team]			 (object)	array contains team's players position and speed
									.this[player]	  (object)	object contains player position and speed
										.this.x		   (number)	X coordinate of the player on team team with number player
										.this.y		   (number)	Y coordinate of the player on team team with number player
										.this.speedX   (number)	speed of the player on team team with number player on the X axis
										.this.speedY   (number)	speed of the player on team team with number player on the Y axis
						}
							
			return	{.player{.deltaSpeedX,.deltaSpeedY}, .ball{.speedX,.speedY}}
				an object defined as follows:
				{
					.player					(object)
						.this.deltaSpeedX	 (number)	containing the speed variation required on y axis for this player
						.this.deltaSpeedY	 (number)	containing the speed variation required on y axis for this player
					.ball					(object)
						.thisspeedX			 (number)	containing the speed this player try to impress to the ball on x axis
						.thisspeedY			 (number)	containing the speed this player try to impress to the ball on y axis
				}
	*/
    this.turn = function(status){					//called one time foreach player each turn
        var action = {
            player:{
                deltaSpeedX: null,
                deltaSpeedY: null
            },
            ball: {
                speedX: null,
                speedY: null
            }
        };

        return action;
    }

}
