
function CustomPlayer(){
    this.team = -1;
    this.number = -1;
    this.init = function (team, number, matchinfo) {
        this.team = team;
        this.number = number;

        if (team == 1)
            return[8900, 4400];
        return [120,1910];
    };
    this.turn = function(status){
        var turnActions = {
            player:{
                deltaSpeedX:0,
                deltaSpeedY:0
            },
            ball: {
                speedX: null,
                speedY: null
            }
        };
        if (this.team == 0 && this.number == 0) {
            if (status.teamsStatus[0][0].x < status.ballStatus.x)
               turnActions.player.deltaSpeedX = 2;
            else
               turnActions.player.deltaSpeedX = -2;
            if(status.teamsStatus[0][0].y < status.ballStatus.y)
               turnActions.player.deltaSpeedY = 2;
            else
             turnActions.player.deltaSpeedY = -2;

            turnActions.ball.speedX = -50;

        }
        if (this.team == 1 && this.number == 0) {
            if (status.teamsStatus[1][0].x < status.ballStatus.x)
                turnActions.player.deltaSpeedX = 2;
            else
                turnActions.player.deltaSpeedX = -2;

            if(status.teamsStatus[1][0].y < status.ballStatus.y)
                turnActions.player.deltaSpeedY = 2;
            else
                turnActions.player.deltaSpeedY = -2;

            turnActions.ball.speedX = -50;
        }
        return turnActions;
    }

}
