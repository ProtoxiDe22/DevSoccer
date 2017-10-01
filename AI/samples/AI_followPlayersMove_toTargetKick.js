/*
 *	INFO:		Script for DevSoccer project based on template.js.
 *	AUTHOR:		Raffaele Morganti
 *	DATE:		30/09/2017
 *	VERSION:	0.1
 *	LICENSE:	CC BY-NC-SA (https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode)
 *
 *	DETAILS:	Goalkeeper defend his goal moving only on y axis, other players start in
 *					a random position into their team half field and each one moves with
 *					a random speed pointing to the opponent player with the same number
 *					until opponent stay into the entire field.
 *				The ball is always kicked with random speed pointing to the target.
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
		
		//if is the goalkeeper defend the goal
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
		var opponent = status.teamsStatus[1 - this.team][this.player];
		var ball = status.ballStatus;
		var turnActions = {
            player:{	//to the opponent
                deltaSpeedX: this.selectMove(player.x, player.speedX, opponent.x, 0, this.match.MAXX),
                deltaSpeedY: this.selectMove(player.y, player.speedY, opponent.y, 0, this.match.MAXY)
            },
            ball: {		//x to the opponents' goal
                speedX: (this.team == 0)	? this.rand(0, this.match.MAXBALLSPEED) 
											: this.rand(-this.match.MAXBALLSPEED, 0),
                speedY: 0
            }
        };
		
		//if it's the goalkeeper defend the goal
		if(this.player == 0){
			turnActions.player.deltaSpeedX = 0;
			turnActions.player.deltaSpeedY = this.selectGKMove(player.y, player.speedY);
		}

		//set ball y to the opponents' goal
		turnActions.ball.speedY = this.selectBallY(turnActions.ball.speedX, ball.x, ball.y)
		
        return turnActions;
    }

	//return random number between min and max
	this.rand = function(min, max){
		return Math.random() * (max-min) + min;
	};

	//return random speed that ensures player will stay into the field and move to the target
	this.selectMove = function(position, speed, target, min, max){
		if(position < min + this.margin) return this.rand(-speed ,this.match.MAXVARIATION);
		if(position > max - this.margin) return this.rand(-this.match.MAXVARIATION, -speed);
		if(position < target) return this.rand( 0 ,this.match.MAXVARIATION);
		if(position > target) return this.rand(-this.match.MAXVARIATION, 0);
		return 0;
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
	
	//return a random y allow the ball to stay between the goalposts
	this.selectBallY = function(xSpeed, xPos, yPos){
		var
			deltaX  = (this.team == 0) ? this.match.MAXX : 0,
			deltaY0 = this.match.GOALCOORDS[0] - yPos,
			deltaY1 = this.match.GOALCOORDS[1] - yPos;
		deltaX = Math.abs( (xPos - deltaX) / xSpeed );
		
		return this.rand(deltaY0 / deltaX, deltaY1 / deltaX);
	};
	
}