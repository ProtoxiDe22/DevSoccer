/*
 *	INFO:		Script for DevSoccer project based on testTeam.js template.
 *	AUTHOR:		Raffaele Morganti
 *	DATE:		30/09/2017
 *	VERSION:	0.1
 *	LICENSE:	CC BY-NC-SA (https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode)
 *
 *	DETAILS:	Goalkeeper defend his goal moving only on y axis, other players start in
 *					a random position into their team half field and move with random
 *					speed and direction into the entire field.
 *				The ball is always kicked with random speed and direction.
 */

function CustomPlayer(){
    this.team = -1;
    this.player = -1;
	this.match;
	this.margin = 100; //distance to the border to keep
	
    this.init = function (team, player, match) {
		//save passed data
        this.team = team;
        this.player = player;
		this.match = match;
		
		//if it's the goalkeeper defend the goal
		if(this.player == 0)
			return [	//start at the center of correct team goal
						(this.team == 0) ? 0 + this.margin : this.match.MAXX - this.margin,
						(this.match.GOALCOORDS[0]+this.match.GOALCOORDS[1]) / 2
					];
		
		//start with random position
		if(this.team==0)return [	//left half-field
								this.rand(0 + this.margin, this.match.MAXX / 2),
								this.rand(0 + this.margin, this.match.MAXY - this.margin)
							];
		else			return [	//right half-field
								this.rand(this.match.MAXX / 2, this.match.MAXX - this.margin),
								this.rand(0 + this.margin, this.match.MAXY - this.margin)
							];
    };

    this.turn = function(status){
		var player = status.teamsStatus[this.team][this.player];
		var ball = status.ballStatus;
        var turnActions = {
            player:{	//random
                deltaSpeedX: this.selectMove(player.x, player.speedX, 0, this.match.MAXX),
                deltaSpeedY: this.selectMove(player.y, player.speedY, 0, this.match.MAXY)
            },
            ball: {		//random
				speedX: this.rand(-this.match.MAXBALLSPEED, this.match.MAXBALLSPEED),
                speedY: this.rand(-this.match.MAXBALLSPEED, this.match.MAXBALLSPEED)
            }
        };
		
		//if it's the goalkeeper defend the goal
		if(this.player == 0){
			turnActions.player.deltaSpeedX = 0;
			turnActions.player.deltaSpeedY = this.selectGKMove(player.y, player.speedY);
		}
		
        return turnActions;
    }
	
	//return random number between min and max
	this.rand = function(min, max){
		return Math.random() * (max-min) + min;
	};

	//return random speed that ensures player will stay into the field
	this.selectMove = function(position, speed, min, max){
		if(position < min + this.margin) return this.rand(-speed ,this.match.MAXVARIATION);
		if(position > max - this.margin) return this.rand(-this.match.MAXVARIATION, -speed);
		return this.rand(-this.match.MAXVARIATION , this.match.MAXVARIATION);
	};
	
	//return y movement of goalkeeper
	this.selectGKMove = function(position, speed){
		var goalMargin = 450;	//distance to the goalpost to start change direction
		if(position < this.match.GOALCOORDS[0] + goalMargin)
			return this.match.MAXVARIATION;
		if(position > this.match.GOALCOORDS[1] - goalMargin)
			return -this.match.MAXVARIATION;
		return (speed == 0) ? this.match.MAXVARIATION : speed;
	};
	
}