var counter = 0;
var Limit = 60;
var Cricket = /** @class */ (function () {
    function Cricket() {
        this.numofballs = 6;
        this.team1 = new Team('Team1');
        this.team2 = new Team('Team2');
        var Timerbutton = document.getElementById('StartTimer');
        Timerbutton.onclick = this.GameTimer();
        var resultbutton = (document.querySelector('.Resultgenerate'));
        resultbutton.disabled = true;
        resultbutton.onclick = this.ResultGenerator();
    }
    Cricket.prototype.Gamestarter = function () {
        this.team1.Teamplay();
        this.team2.Teamplay();
    };
    Cricket.prototype.ResultGenerator = function () {
        var _this = this;
        return function () {
            var resultbutton = (document.querySelector('.Resultgenerate'));
            var div = document.querySelector('.ResultGenerate');
            var h3 = document.createElement('h3');
            var Winner = document.createElement('h3');
            if (_this.team1.HighestScore > _this.team2.HighestScore) {
                h3.innerHTML = '<br>WINNING TEAM : <b>Team 1</b><hr>';
                Winner.innerHTML = "Man of the match - <b>" + _this.team1.ManOftheMatch() + "</b>";
            }
            else if (_this.team1.HighestScore < _this.team2.HighestScore) {
                h3.innerHTML = '<br>WINNING TEAM : <b>Team 2</b><hr>';
                Winner.innerHTML = "Man of the match - <b>" + _this.team2.ManOftheMatch() + "</b>";
            }
            else {
                h3.innerHTML = '<br><b>DRAW MATCH</b><hr>';
            }
            div.append(h3, Winner);
            resultbutton.disabled = true;
        };
    };
    Cricket.prototype.GameTimer = function () {
        var _this = this;
        return function () {
            var TimerButton = document.getElementById('StartTimer');
            TimerButton.disabled = true;
            var hitleft = document.querySelector('.hit_team1');
            var hitright = document.querySelector('.hit_team2');
            if (counter == 0) {
                hitleft.disabled = false;
                counter++;
            }
            else if (counter === 1) {
                hitright.disabled = false;
                hitleft.disabled = true;
                counter++;
            }
            else {
                console.log('error');
            }
            StopTimer(1);
            var Timer = document.getElementsByClassName('timer')[0];
            Timer.innerHTML = "" + Limit;
            var duration = Limit;
            var id = setInterval(function () { return countTime(_this); }, 1000);
            console.log(id);
            function countTime(g) {
                if (duration < 0) {
                    StopTimer(id);
                    TimerButton.disabled = false;
                    if (counter === 1) {
                        hitleft.disabled = true;
                        g.team1.EndGame();
                    }
                    else {
                        hitright.disabled = true;
                        g.team2.EndGame();
                        (document.querySelector('.Resultgenerate')).disabled = false;
                    }
                }
                else {
                    Timer.innerHTML = "" + duration;
                    duration--;
                }
            }
        };
    };
    return Cricket;
}());
var Team = /** @class */ (function () {
    function Team(Name) {
        this.playerName = new Array();
        this.HighestScore = 0;
        this.TeamName = Name;
        this.teamScore = 0;
        for (var i = 1; i <= 6; i++) {
            this.playerName.push(new Player1("Player" + i, this.TeamName));
        }
        this.PlayerIndex = 1;
        this.Ball = 1;
        document.querySelector(".hit" + this.TeamName).onclick =
            this.Teamplay();
    }
    Team.prototype.Teamplay = function () {
        var _this = this;
        return function () {
            if (_this.PlayerIndex <= 6 && _this.Ball <= 6) {
                var BallScore = _this.playerName[_this.PlayerIndex - 1].playPlayer();
                console.log(_this.PlayerIndex);
                _this.Ball += 1;
                if ((_this.Ball - 1) % 6 == 0 || BallScore === 0) {
                    _this.playerName[_this.PlayerIndex - 1].printTotal(_this.Ball - 1);
                    _this.Ball = 1;
                    _this.PlayerIndex += 1;
                    if (_this.PlayerIndex === 7) {
                        _this.EndGame();
                    }
                }
            }
        };
    };
    Team.prototype.EndGame = function () {
        if (this.PlayerIndex < 7)
            this.playerName[this.PlayerIndex - 1].printTotal(this.Ball - 1);
        (document.querySelector("." + this.TeamName)).innerHTML = "" + this.TeamScore();
    };
    Team.prototype.TeamScore = function () {
        this.teamScore = 0;
        for (var i = 0; i < this.playerName.length; i++) {
            if (this.playerName[i].scores.length != 0)
                this.teamScore += this.playerName[i].totalScore();
        }
        this.HighestScore = this.teamScore;
        return this.teamScore;
    };
    Team.prototype.ManOftheMatch = function () {
        var max = 0;
        var Maxplayer = 0;
        for (var i = 0; i < this.playerName.length; i++) {
            if (max < this.playerName[i].totalScore()) {
                max = this.playerName[i].totalScore();
                Maxplayer = i + 1;
            }
        }
        return "Player " + Maxplayer + " with score " + max;
    };
    return Team;
}());
var Player1 = /** @class */ (function () {
    function Player1(name, teamname) {
        this.scores = Array();
        this.name = name;
        this.teamname = teamname;
        this.scores = [];
    }
    Player1.prototype.playPlayer = function () {
        var res1 = getRun();
        this.addvaluetorow(res1);
        this.Scoreaddition(res1);
        return res1;
    };
    Player1.prototype.addvaluetorow = function (res, isEmpty) {
        if (isEmpty === void 0) { isEmpty = false; }
        var td;
        var row = document.querySelector("#" + this.teamname + "player" + this.name.split('r')[1]);
        td = document.createElement('td');
        if (!isEmpty)
            td.innerHTML = "" + res;
        row.appendChild(td);
    };
    Player1.prototype.printTotal = function (BallNum) {
        for (var i = 0; i < 6 - BallNum; i++) {
            this.addvaluetorow(-1, true);
        }
        this.addvaluetorow(this.totalScore());
    };
    Player1.prototype.totalScore = function () {
        return this.scores.reduce(function (tot, score) {
            return tot + score;
        }, 0);
    };
    Player1.prototype.Scoreaddition = function (score) {
        this.scores.push(score);
    };
    return Player1;
}());
var game = new Cricket();
console.log(game);
game.Gamestarter();
function StopTimer(id) {
    console.log(id);
    clearInterval(id);
}
function getRun() {
    return Math.floor(Math.random() * 7);
}
window.onload = function () {
    document.querySelector('.hit_team1').disabled = true;
    document.querySelector('.hit_team2').disabled = true;
};
