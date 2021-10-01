let counter = 0;
let Limit = 60;
class Cricket {
    numofballs: number;
    team1: Team;
    team2: Team;
  
    constructor() {
      this.numofballs = 6;
      this.team1 = new Team('Team1');
      this.team2 = new Team('Team2');
      let Timerbutton = <HTMLInputElement>document.getElementById('StartTimer');
      Timerbutton.onclick = this.GameTimer();
      var resultbutton = <HTMLInputElement>(
        document.querySelector('.Resultgenerate')
      );
      resultbutton.disabled = true;
      resultbutton.onclick = this.ResultGenerator();
    }
  
    Gamestarter() {
      this.team1.Teamplay();
      this.team2.Teamplay();
    }
  
    ResultGenerator(): () => void {
      return () => {
        var resultbutton = <HTMLInputElement>(
          document.querySelector('.Resultgenerate')
        );
        var div = <HTMLDivElement>document.querySelector('.ResultGenerate');
        var h3 = document.createElement('h3');
        var Winner = document.createElement('h3');
        if (this.team1.HighestScore > this.team2.HighestScore) {
          h3.innerHTML = '<br>WINNING TEAM : <b>Team 1</b><hr>';
          Winner.innerHTML = `Man of the match - <b>${this.team1.ManOftheMatch()}</b>`;
        } else if (this.team1.HighestScore < this.team2.HighestScore) {
          h3.innerHTML = '<br>WINNING TEAM : <b>Team 2</b><hr>';
          Winner.innerHTML = `Man of the match - <b>${this.team2.ManOftheMatch()}</b>`;
        } else {
          h3.innerHTML = '<br><b>DRAW MATCH</b><hr>';
        }
        div.append(h3, Winner);
  
        resultbutton.disabled = true;
      };
    }
  
    GameTimer(): () => void {
      return () => {
        let TimerButton = <HTMLInputElement>document.getElementById('StartTimer');
        TimerButton.disabled = true;
        var hitleft = <HTMLInputElement>document.querySelector('.hit_team1');
        var hitright = <HTMLInputElement>document.querySelector('.hit_team2');
        if (counter == 0) {
          hitleft.disabled = false;
          counter++;
        } else if (counter === 1) {
          hitright.disabled = false;
          hitleft.disabled = true;
          counter++;
        } else {
          console.log('error');
        }
        StopTimer(1);
        let Timer = <HTMLSpanElement>document.getElementsByClassName('timer')[0];
        Timer.innerHTML = `${Limit}`;
        var duration = Limit;
        var id = setInterval(() => countTime(this), 1000);
  
        console.log(id);
        function countTime(g: Cricket) {
          if (duration < 0) {
            StopTimer(id);
            TimerButton.disabled = false;
            if (counter === 1) {
              hitleft.disabled = true;
              g.team1.EndGame();
            } else {
              hitright.disabled = true;
              g.team2.EndGame();
              (<HTMLInputElement>(
                document.querySelector('.Resultgenerate')
              )).disabled = false;
            }
          } else {
            Timer.innerHTML = `${duration}`;
  
            duration--;
          }
        }
      }
    }
  }
  
  class Team{
    TeamName: string;
    playerName: Array<Player1> = new Array();
    teamScore: number;
    PlayerIndex: number;
    Ball: number;
    HighestScore: number = 0;
  
    constructor(Name: string) {
      this.TeamName = Name;
  
      this.teamScore = 0;
      for (var i = 1; i <= 6; i++) {
        this.playerName.push(new Player1(`Player${i}`, this.TeamName));
      }
  
      this.PlayerIndex = 1;
      this.Ball = 1;
      (<HTMLInputElement>document.querySelector(`.hit${this.TeamName}`)).onclick =
        this.Teamplay();
    }
  
    Teamplay(): () => void {
      return () => {
        if (this.PlayerIndex <= 6 && this.Ball <= 6) {
          let BallScore = this.playerName[this.PlayerIndex - 1].playPlayer();
          console.log(this.PlayerIndex);
          this.Ball += 1;
          if ((this.Ball - 1) % 6 == 0 || BallScore === 0) {
            this.playerName[this.PlayerIndex - 1].printTotal(this.Ball - 1);
            this.Ball = 1;
            this.PlayerIndex += 1;
  
            if (this.PlayerIndex === 7) {
              this.EndGame();
            }
          }
        }
      };
    }
  
    EndGame() {
      if (this.PlayerIndex < 7)
        this.playerName[this.PlayerIndex - 1].printTotal(this.Ball - 1);
      (<HTMLSpanElement>(
        document.querySelector(`.${this.TeamName}`)
      )).innerHTML = `${this.TeamScore()}`;
    }
  
    TeamScore() {
      this.teamScore = 0;
      for (var i = 0; i < this.playerName.length; i++) {
        if (this.playerName[i].scores.length != 0)
          this.teamScore += this.playerName[i].totalScore();
      }
      this.HighestScore = this.teamScore;
      return this.teamScore;
    }
  
    ManOftheMatch() {
      var max = 0;
      var Maxplayer = 0;
      for (var i = 0; i < this.playerName.length; i++) {
        if (max < this.playerName[i].totalScore()) {
          max = this.playerName[i].totalScore();
          Maxplayer = i + 1;
        }
      }
      return `Player ${Maxplayer} with score ${max}`;
    }
  }
  
  class Player1 {
    name: string;
    teamname: string;
    scores = Array<number>();
    maxScorePlayer: number; // List of scores
  
    constructor(name: string, teamname: string) {
      this.name = name;
      this.teamname = teamname;
      this.scores = [];
    }
  
    playPlayer() {
      let res1 = getRun();
      this.addvaluetorow(res1);
      this.Scoreaddition(res1);
      return res1;
    }
  
    addvaluetorow(res: number, isEmpty: boolean = false) {
      let td: HTMLTableDataCellElement;
      var row = document.querySelector(
        `#${this.teamname}player${this.name.split('r')[1]}`
      );
      td = document.createElement('td');
      if (!isEmpty) td.innerHTML = `${res}`;
      row.appendChild(td);
    }
  
    printTotal(BallNum: number) {
      for (var i = 0; i < 6 - BallNum; i++) {
        this.addvaluetorow(-1, true);
      }
      this.addvaluetorow(this.totalScore());
    }
  
    totalScore() {
      return this.scores.reduce((tot, score) => {
        return tot + score;
      }, 0);
    }
  
    Scoreaddition(score: number) {
      this.scores.push(score);
    }
  }
  
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
  
  window.onload = () => {
    (<HTMLInputElement>document.querySelector('.hit_team1')).disabled = true;
    (<HTMLInputElement>document.querySelector('.hit_team2')).disabled = true;
  };
 
  