
function CustomPlayer(){
    this.team = -1;
    this.number = -1;
    this.init = function (team, number, matchinfo) {//called one time for player at start of the match
        this.team = team;
        this.number = number;


        return [120,1910];
    };

    this.turn = function(status){//called one time for player each turn
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

        return turnActions;
    }

}
