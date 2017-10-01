
(function(){
    var $ = {};
    $.MAXX=9000;//field sizes
    $.MAXY=4500;
    $.MAXSPEED = 35;
    $.MAXVARIATION = 2;
    $.INFLUENCEZONE = 130;// zone of influence on the ball of a player
    $.MAXBALLSPEED = 125;
    $.MISSINGPROB = 0.004; //0.001
    $.BALLDECAY = 0.3;
    $.FRAMEDURATION = 50;//ms per frame
    $.GOALSIZE = 900;//size of the goal
    $.GOALCOORDS = [($.MAXY/2)-($.GOALSIZE/2),($.MAXY/2)+($.GOALSIZE/2)];
    $.GOALKEEPERINFZONE = $.INFLUENCEZONE * 1.5;// zone of influence for goalkeeper
    $.GOALKEEPERLIMIT = 1600;//distance from the border in which goalkeeper advantages are granted

    var path1;
    var path2;
    var startButton;

	$.score = [];
    $.customTeamClasses = [];
    $.teams=[[],[]];
    $.customTeams=[[],[]];
    $.ball = {};
    $.attemptList = [];
    $.end = false;
    function Ball() {
        this.x=$.MAXX/2;
        this.y=$.MAXY/2;
        this.speedX=0;
        this.speedY=0;

        this.move = function(){
            var hitWall = false;
            //region check goal, ball out of bounds and move it
            if(this.y + this.speedY > $.MAXY)
            {
                this.x = impactPoint($,1,1);
                hitWall = true;
                this.y = $.MAXY;
                this.speedY = -this.speedY;
            }
            else if(this.y +this.speedY < 0){
                this.x = impactPoint($,0,1);
                hitWall = true;
                this.y = 0;
                this.speedY = -this.speedY;
            }

            if(this.x + this.speedX > $.MAXX && !hitWall)
            {
                this.y = impactPoint($,1,0);
                hitWall = true;
                this.x = $.MAXX;
                this.speedX = -this.speedX;
            }
            else if(this.x +this.speedX < 0 && !hitWall){
                this.y = impactPoint($,0,0);
                hitWall = true;
                this.x = 0;
                this.speedX = -this.speedX;
            }


            if(!hitWall){
                this.x +=this.speedX;
                this.y += this.speedY;
            }

            if(hitWall){
                if(this.x == $.MAXX){
                    if(this.y>$.GOALCOORDS[0] && this.y < $.GOALCOORDS[1])
                        goalScored(0);
                }
                if(this.x == 0)
                {
                    if(this.y>$.GOALCOORDS[0] && this.y < $.GOALCOORDS[1])
                        goalScored(1);
                }
            }
            //endregion


            //region let the speed of the ball decay over time
            if ((Math.abs(this.speedX) - $.BALLDECAY)>0)
                this.speedX = (Math.sign(this.speedX)*(Math.abs(this.speedX) - $.BALLDECAY));
            else
                this.speedX = 0;
            if((Math.abs(this.speedY)- $.BALLDECAY)>0)
                this.speedY = (Math.sign(this.speedY)*(Math.abs(this.speedY) - $.BALLDECAY));
            else
                this.speedY = 0;
            //endregion
        }
    }

    function BallAttempt(ballVariation, player){
        this.speedX = ballVariation.speedX;
        this.speedY = ballVariation.speedY;
        this.x = player.x;
        this.y = player.y;
        this.valid = false;
        this.validGoalKeeper = false;
        this.distance = Math.sqrt(Math.pow(($.ball.x-this.x), 2) + Math.pow(($.ball.y-this.y), 2));//calculates distance from player to ball
        //region checks and adjustments on the speed and distance
        if (player.number == 0) {
            if(player.team == 0) {
                if (player.x < $.GOALKEEPERLIMIT) {
                    this.validGoalKeeper = true;
                }
            }

            else if(player.team == 1) {
                if (player.x > $.MAXX - $.GOALKEEPERLIMIT) {
                    this.validGoalKeeper = true
                }
            }
        }

        if (this.distance <= $.INFLUENCEZONE && !this.validGoalKeeper) {
            this.valid = true;
            this.influence = 1/this.distance;
        }
        else if (this.distance <= $.GOALKEEPERINFZONE && this.validGoalKeeper){
            this.valid = true;
            this.influence = 1.3/this.distance;
        }
        else
            return;
		
		//checks and adjust speed validity
		var speed = {x: this.speedX, y: this.speedY};
		speed = getAllowedSpeed(speed, $.MAXBALLSPEED);
		this.speedX = speed.x;
		this.speedY = speed.y;
        //endregion
    }

    function Player(x, y, team, number){
        this.x=x;
        this.y=y;
        this.speedX=0;
        this.speedY=0;
        this.team = team;
        this.number = number;
        //checks and adjust speed validity
        this.modifySpeed = function(deltaX, deltaY){
			var speed = {x: this.speedX + deltaX, y: this.speedY + deltaY};
			speed = getAllowedSpeed(speed, $.MAXSPEED);
			this.speedX = speed.x;
			this.speedY = speed.y;
        };

        //returns fields
        this.getStatus = function () {
            return{
                x : this.x,
                y : this.y,
                speedX : this.speedX,
                speedY : this.speedY
            };
        };
        this.move = function () {
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }
	
	//if total speed > max speed will scale speed to stay into limits and keep direction
	function getAllowedSpeed(speed, max){
		if(Math.sqrt(Math.pow(speed.x,2) + Math.pow(speed.y,2)) > max){
			//sqrt(x^2 + y^2) = m & x/y = k ->
			//y = sqrt(m^2 / (k^2+1)) & x = ky
			var k = speed.x / speed.y;
			speed.y = Math.sign(speed.y) * Math.sqrt(Math.pow(max,2) / (1+Math.pow(k,2)));
			speed.x = Math.sign(speed.x) * (speed.y == 0) ? max : k * speed.y;
		}
		return speed;
	}

    function getStatus() {
        var status = {
            ballStatus:{
                x: $.ball.x,
                y: $.ball.y,
                speedX: $.ball.speedX,
                speedY: $.ball.speedY
            },
            teamsStatus :[[],[]]
        };
        for (var i = 0; i<2; i++){
            for(var player in $.teams[i]){
                status.teamsStatus[i][player] = $.teams[i][player].getStatus();
            }
        }
        return status;
    }

    window.onload = function() {
        $.canvas = document.createElement("canvas");
        $.canvas.width = 900;
        $.canvas.height = 450;
        $.context = $.canvas.getContext("2d");
        document.body.insertBefore($.canvas, document.body.childNodes[0]);
        startButton = document.getElementById("startButton");
        startButton.addEventListener('click',startGameFromClient);
		endButton = document.getElementById("endButton");
        endButton.addEventListener('click',endMatch);
    };
    function startGameFromClient(){
        var file1 = document.getElementById("team0").files[0];
        var file2 = document.getElementById("team1").files[0];
        loadFromFile(file1, 0, $).then(function(){
            loadFromFile(file2, 1, $).then(function (){
                initMatch();
            });
        });
    }
    function startGameFromServer(){//unused, not working right now, might be useful if the game gets put on a server.
        path1 = document.getElementById("team0").files[0];
        path2 = document.getElementById("team1").files[0];
        loadJS(path1,customTeamClassBinder,document.body,{team:0,scope:$}).then(function () {
            loadJS(path2,customTeamClassBinder,document.body,{team:1,scope:$}).then(function () {
                initMatch();
            });
        });
    }
	
	function initMatch(){
		$.score[0] = 0;
		$.score[1] = 0;
		$.ball = new Ball();
		initTeam(0);
		initTeam(1);
		draw();
		gameLoop();
	}

    function getMatchInfo() {
        return{
            MAXX : $.MAXX,
            MAXY : $.MAXY,
            MAXSPEED : $.MAXSPEED,
            MAXVARIATION : $.MAXVARIATION,
            INFLUENCEZONE: $.INFLUENCEZONE,
            GOALKEEPERINFZONE: $.GOALKEEPERINFZONE,
            GOALKEEPERLIMIT: $.GOALKEEPERLIMIT,
            MAXBALLSPEED: $.MAXBALLSPEED,
            GOALSIZE: $.GOALSIZE,
            GOALCOORDS: $.GOALCOORDS
        }
    }
    function initTeam(team){
        for (var i = 0; i<11; i++){
            $.customTeams[team][i] = new $.customTeamClasses[team]();
            var pos = $.customTeams[team][i].init(team, i, getMatchInfo());

            //region move to a valid position
            pos[1] = Math.max(Math.min($.MAXY, pos[1]), 0);
            if (team == 0)
                pos[0] = Math.max(Math.min($.MAXX/2 - 1, pos[0]), 0);
            if (team == 1)
                pos[0] = Math.min(Math.max($.MAXX/2 + 1, pos[0]), $.MAXX);
            //endregion

            $.teams[team][i] = new Player(pos[0],pos[1], team, i);
        }
    }

    function draw() {
        $.context.clearRect(0,0,$.canvas.width,$.canvas.height);
        $.context.fillStyle ="#0f0";
        $.context.fillRect(0,0,$.canvas.width, $.canvas.height);
        pos = convertPos($.GOALCOORDS[0],$.GOALSIZE, $);
        $.context.fillStyle = "#fff";
        $.context.fillRect(0,pos[0],4,pos[1]);
        $.context.fillRect($.canvas.width, pos[0], -4, pos[1]);
        $.context.fillRect(($.canvas.width/2)-1,0,2,$.canvas.height);
        $.context.font = "20px Georgia";
        for (var i = 0; i<2; i++){
            for(var player in $.teams[i]){
                pos = convertPos($.teams[i][player].x, $.teams[i][player].y, $);
                $.context.fillStyle = (i==0) ? '#00f' : '#f00';
                $.context.fillRect(pos[0]-10, pos[1]-10, 20, 20);
                $.context.fillStyle = (i==0) ? '#f00' : '#00f';
                $.context.fillText(Number(player)+1,(player>8) ? pos[0]-10 : pos[0]-5, pos[1]+5);
            }
            $.context.beginPath();
            var pos = convertPos($.ball.x, $.ball.y, $);
            $.context.arc(pos[0], pos[1], 6, 0, 2 * Math.PI, false);
            $.context.fillStyle = '#fff';
            $.context.closePath();
            $.context.fill();
        }
    }

    function executeAttempts() {
        var total = 0;
        if($.attemptList.length > 0) {
            for (var i in $.attemptList) {
                total += $.attemptList[i].influence;
            }
            total += $.MISSINGPROB;
            var rand = Math.random() * total;
            for (i in $.attemptList) {
                rand -= $.attemptList[i].influence;
                if (rand <= 0) {
                    $.ball.speedX = $.attemptList[i].speedX;
                    $.ball.speedY = $.attemptList[i].speedY;
                    break;
                }
            }
        }
        $.ball.move();
    }
    function goalScored(team) {
		print("team " + team + " scored.", (team==0) ? '#00f' : '#f00');
		$.score[team]++;
		$.ball = new Ball();
        initTeam(0);
		initTeam(1);
		draw();
    }
	
	function endMatch() {
		if		($.score[0] == $.score[1])
			print("TIE!", '#000');
		else if	($.score[0] > $.score[1])
			print("TEAM 0 WIN!", '#00f');
		else if	($.score[0] < $.score[1])
			print("TEAM 1 WIN!", '#f00');
		$.end = true;
    }
	
    function gameLoop(){
        step();
        if(!$.end)
            setTimeout(gameLoop, $.FRAMEDURATION);
    }
    function step(){
        var attempt;
        draw();
        var originalStatus = getStatus();//get status of the match
        $.attemptList = [];
        for (var i = 0; i < 2; i++) {//iterate teams
            for (var player in $.teams[i]) {//iterate players
                var variation = $.customTeams[i][player].turn(getClone(originalStatus));
                if (variation.player.deltaSpeedX != 0 || variation.player.deltaSpeedY != 0)//check if speed of player was changed
                    $.teams[i][player].modifySpeed(variation.player.deltaSpeedX, variation.player.deltaSpeedY);//changes speed
                if (variation.ball.speedX != null || variation.ball.speedY != null) {//checks actions on the ball
                    attempt = new BallAttempt(variation.ball, $.teams[i][player]);
                    if (attempt.valid) {//check attempt validity and pushes it into the attempList
                        $.attemptList.push(attempt);
                    }
                }
                $.teams[i][player].move();
            }
        }
        executeAttempts();
    }
})();
