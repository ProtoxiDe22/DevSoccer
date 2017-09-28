/**
 * Created by dsfab on 26-Sep-17.
 */
function customTeamClassBinder(team, $, CustomPlayer){
    $.customTeamClasses[team]=CustomPlayer;
}

function convertPos(x, y, $) {
    var pos = [];
    pos[0]=(x*$.canvas.width)/$.MAXX;
    pos[1]=(y*$.canvas.height)/$.MAXY;
    return pos;
}

function impactPoint($, side, axis){
    if (axis == 0) {
        var dx = Math.abs($.ball.x - (side * $.MAXX));
    }
    else {
        var dy = Math.abs($.ball.y - (side * $.MAXY));
    }
    var DY = $.ball.speedY;
    var DX = $.ball.speedX;
    if (axis == 0) {
        return $.ball.y+(dx* DY/DX);
    }
    else {
        return $.ball.x+(dy*DX/DY);
    }
}
function loadFromFile (file, team, $) {

    var p = new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () {
            eval(reader.result);
            customTeamClassBinder(team, $, CustomPlayer);
            resolve();
        };
        reader.readAsText(file);
    });
    return p;
}
var loadJS = function(url, implementationCode, location, param){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;


    var p = new Promise(function (resolve, reject) {
        var onload = function() {
            implementationCode(param.team, param.scope);
            resolve();
        };
        scriptTag.onload = onload;
        scriptTag.onreadystatechange = onload;
        location.appendChild(scriptTag);
    });
    return p;

};
// var yourCodeToBeCalled = function(){
// your code goes here
// }
// loadJS('yourcode.js', yourCodeToBeCalled, document.body);


function printError(text){
    var error = document.createElement('p');
    error.setAttribute('style','color:red');
    var t = document.createTextNode(text);
    error.appendChild(t);
    document.body.appendChild(error);
}

 function getClone(oldObject) {
    var tempClone = {};

    if (typeof(oldObject) == "object")
        for (var prop in oldObject)
            // for array use private method getCloneOfArray
            if ((typeof(oldObject[prop]) == "object") &&
                (oldObject[prop]).__isArray)
                tempClone[prop] = getCloneOfArray(oldObject[prop]);
            // for object make recursive call to getCloneOfObject
            else if (typeof(oldObject[prop]) == "object")
                tempClone[prop] = getClone(oldObject[prop]);
            // normal (non-object type) members
            else
                tempClone[prop] = oldObject[prop];

    return tempClone;
}

//private method (to copy array of objects) - getCloneOfObject will use this internally
function getCloneOfArray(oldArray) {
    var tempClone = [];

    for (var arrIndex = 0; arrIndex <= oldArray.length; arrIndex++)
        if (typeof(oldArray[arrIndex]) == "object")
            tempClone.push(this.getCloneOfObject(oldArray[arrIndex]));
        else
            tempClone.push(oldArray[arrIndex]);

    return tempClone;
}