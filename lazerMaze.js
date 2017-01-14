'use strict'

// Rocket Fuel Lazer Maze

class LazerMaze {
  constructor( input ) {
    this._input = input;
    this._maze = [];
    this._distance = 0;
    this._visited = {};
    this._atWall = false;
    this._lazer = "@";
    this._direction = 'east'
    this._symbols = {
      "^": -1,
      "v": 1,
      ">": 1,
      "<": -1,
      "O": 'flip'
    };
  }

  parseString() {
    const parseStr = this._input.trim().split("\n");

    for (let i = 0; i < parseStr.length; i++) {
      this._maze.push(parseStr[i].split(""));
    }
  }

  findLazer() {
    this.parseString();
    for( let i = 0; i < this._maze.length; i++ ) {
      for ( let j = 0; j < this._maze[i].length; j++) {
        if( this._maze[i][j] === this._lazer) {
          this._distance += 1;
          return [i, j]
        }
      }
    }
    return -1
  }

  solveMaze() {
    this._lazerLocation = this.findLazer();
    let i = this._lazerLocation[0];
    let j = this._lazerLocation[1];
    let char = '';
    let newPos = '';

    while( !this._atWall ) {

      // should we increment or decrement i or j
      if ( this._direction === "south" && (i+1) !== this._maze.length ) {
        i += 1
      } else if( this._direction === "north" && (i-1) >= 0 ) {
        i -= 1
      } else if ( this._direction === "east" && (j+1) !== this._maze.length ) {
        j += 1
      } else if( this._direction === "west" && (j-1) >= 0 ) {
        j -= 1
      }

      // check for loop
      if(this.loopDetection(i,j)) {
        return -1
      }

      char = this._maze[i][j];

      // check for direction
      if( this._symbols.hasOwnProperty( char ) ) {
        this._visited[`${i},${j}`] = true
        this._direction = this.prism( char, i, j );
      } else if ( char !== "-") {
        this._visited[`${i},${j}`] = true
        this._direction = this.mirror( char, i, j );
      }

      this._distance += 1;

      // Check if we hit a wall
      this.wall(i, j);
    }

    return this._distance;
  }


  prism( symbol ) {
    var orientation = ''
      if ( symbol === "^" || (symbol === "O" && this._direction === "south")) {
        orientation = 'north'
      } else if ( symbol === "v" || (symbol === "O" && this._direction === "north")) {
        orientation = 'south'
      } else if ( symbol === "<" || (symbol === "O" && this._direction === "east")) {
        orientation = 'west'
      } else if ( symbol === ">" || (symbol === "O" && this._direction === "west")) {
        orientation = 'east'
      } else {
        orientation = this._direction
      };

    return orientation;
  }

  mirror( symbol ) {
    let orientation = ''
      if ( symbol === "\\" && this._direction === 'west' || symbol === "/" && this._direction === 'east') {
        orientation = 'north'
      } else if ( symbol === "\\" && this._direction === 'south' || symbol === "/" && this._direction === 'north') {
        orientation = 'east'
      } else if ( symbol === "\\" && this._direction === 'east' || symbol === "/" && this._direction === 'west') {
        orientation = 'south'
      } else if ( symbol === "\\" && this._direction === 'north' || symbol === "/" && this._direction === 'south') {
        orientation = 'west'
      }

    return orientation;
  }

  wall(long, lat) {
      if ( ((lat + 1) === this._maze.length && this._direction === "east") ||
           ((lat - 1) < 0 && this._direction === "west") ) {
        this._atWall = true;
      } else if (((long + 1) === this._maze.length && this._direction === "south") ||
           ((long - 1) < 0 && this._direction === "north") ) {
        this._atWall = true;
      }
  }

  loopDetection(long, lat) {
    if(this._visited.hasOwnProperty(`${long},${lat}`)) {
       return true
    }
    return false
  }

}
