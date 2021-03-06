import React from 'react';
import './App.css';
import Line from './Line';
import Box from './Box';
import {ClickedContext} from './ClickedContext';
import {constants} from './constants';

// TODO: ideas for CRUD - undo last move, save game
class App extends React.Component {
  state = {
    dotCoordinates : {},
    lineCoordinates: {},
    boxCoordinates: {},
    clickedLineId: "",
    player1IsNext: true,
    player1Score: 0,
    player2Score: 0,
    result: ""
  };

  componentDidMount(){
    let cy = 160;
    let cx = 70;

    const numOfRowCols = 5;
    const numOfDots = numOfRowCols*numOfRowCols;
    const dotCoordinates = {};
    const lineCoordinates = {};
    const boxCoordinates = {};

    // find dot coordinates
    for(let i=0; i<numOfDots; i++){
      dotCoordinates[i] = {'x': cx,'y': cy};
      cy += 90;
      if((i+1) % numOfRowCols === 0){
        cy = 160;
        cx+= 90;
      }
    }

    // find line coordinates
    for(let i=0;i<numOfDots;i++){
      if(i<numOfDots-numOfRowCols)
        lineCoordinates[i]={
                            'x1': dotCoordinates[i].x,
                            'y1': dotCoordinates[i].y,
                            'x2': dotCoordinates[i+numOfRowCols].x,
                            'y2':dotCoordinates[i+numOfRowCols].y
                          };
      if((i+1) % numOfRowCols !== 0)
        lineCoordinates[i+(numOfDots-numOfRowCols)]={
                                                  'x1': dotCoordinates[i].x,
                                                  'y1': dotCoordinates[i].y,
                                                  'x2': dotCoordinates[i+1].x,
                                                  'y2':dotCoordinates[i+1].y
                                                };
    }

    // find box coordinates
    for(let i=0;i<numOfDots;i++){
      if((i+numOfRowCols+1)<numOfDots && (i+1)%numOfRowCols!==0){
        boxCoordinates[i]={
                          'x1': dotCoordinates[i].x,
                          'y1': dotCoordinates[i].y,
                          'x2': dotCoordinates[i+numOfRowCols].x,
                          'y2':dotCoordinates[i+numOfRowCols].y,
                          'x3': dotCoordinates[i+numOfRowCols+1].x,
                          'y3':dotCoordinates[i+numOfRowCols+1].y,
                          'x4': dotCoordinates[i+1].x,
                          'y4': dotCoordinates[i+1].y
                        };
        //find lines related to each box
        let line0Id = this.findALineFromCoordinates({x1:boxCoordinates[i].x1,y1:boxCoordinates[i].y1,
          x2: boxCoordinates[i].x2, y2: boxCoordinates[i].y2}, lineCoordinates);
        let line1Id = this.findALineFromCoordinates({x1:boxCoordinates[i].x2, y1:boxCoordinates[i].y2,
          x2: boxCoordinates[i].x3, y2: boxCoordinates[i].y3}, lineCoordinates);
        let line2Id = this.findALineFromCoordinates({x1:boxCoordinates[i].x4, y1:boxCoordinates[i].y4,
          x2: boxCoordinates[i].x3, y2: boxCoordinates[i].y3}, lineCoordinates);
        let line3Id = this.findALineFromCoordinates({x1:boxCoordinates[i].x1, y1:boxCoordinates[i].y1,
          x2: boxCoordinates[i].x4, y2: boxCoordinates[i].y4}, lineCoordinates);

        //map box to lines
        boxCoordinates[i].line0Id = line0Id;
        boxCoordinates[i].line1Id = line1Id;
        boxCoordinates[i].line2Id = line2Id;
        boxCoordinates[i].line3Id = line3Id;

        // map lines to boxes:
        lineCoordinates[line0Id].lineToBoxes
          = lineCoordinates[line0Id].lineToBoxes ? [...lineCoordinates[line0Id].lineToBoxes, i]:[i];
        lineCoordinates[line1Id].lineToBoxes
          = lineCoordinates[line1Id].lineToBoxes ? [...lineCoordinates[line1Id].lineToBoxes, i]:[i];
        lineCoordinates[line2Id].lineToBoxes
          = lineCoordinates[line2Id].lineToBoxes ? [...lineCoordinates[line2Id].lineToBoxes, i]:[i];
        lineCoordinates[line3Id].lineToBoxes
          = lineCoordinates[line3Id].lineToBoxes ? [...lineCoordinates[line3Id].lineToBoxes, i]:[i];
      }
    }

    this.setState({ lineCoordinates: lineCoordinates,
                    dotCoordinates: dotCoordinates,
                    boxCoordinates: boxCoordinates,
                  });
  }

  isBoxCaptured = (boxId) =>{
    // given a box ID see if its lines have been clicked i.e. is box captured
    const l1 = this.state.boxCoordinates[boxId].line0Id
    const l2 = this.state.boxCoordinates[boxId].line1Id
    const l3 = this.state.boxCoordinates[boxId].line2Id
    const l4 = this.state.boxCoordinates[boxId].line3Id

    const isBoxCaptured = [l1,l2,l3,l4].reduce((areLinesClicked, currLineId) => {
      return(areLinesClicked && this.state.lineCoordinates[currLineId].isClicked)
    }, true);
    return isBoxCaptured;
  }

  areAllBoxesCaptured = () => {
    const areAllBoxesCaptured = Object.values(this.state.boxCoordinates).reduce(
      (areBoxesCaptured, currBox) => {
        return(areBoxesCaptured && currBox.isCaptured);
      }, true);
    return areAllBoxesCaptured;
  }

  findALineFromCoordinates = ({x1,y1,x2,y2}, lineCoordinates) => {
    let lineItemsKeys = lineCoordinates? (Object.keys(lineCoordinates)): Object.keys(this.state.lineCoordinates);
    let result={};
    for(let i=0;i<lineItemsKeys.length;i++)
    {
      let lineItem = lineCoordinates[lineItemsKeys[i]]
      if(lineItem.x1===x1 && lineItem.x2===x2 && lineItem.y1===y1 && lineItem.y2===y2){
        result = lineItemsKeys[i]; break;
      }
    }
    return result;
  }

  handleClick = (lineId) =>{
    if(!this.state.lineCoordinates[lineId].isClicked){
      const lineCoordinates = this.state.lineCoordinates;
      lineCoordinates[lineId].isClicked = true;

      // a line is attached to upto 2 boxes
      // find out if the last move resulted in a box capture
      this.setState({lineCoordinates: lineCoordinates},()=>{
        let scoreToAdd = 0;
        const boxCoordinates = this.state.boxCoordinates;
        let player1Score = this.state.player1Score;
        let player2Score = this.state.player2Score;
        let player1IsNext = this.state.player1IsNext;

        const isAnyBoxCaptured = this.state.lineCoordinates[lineId].lineToBoxes.reduce((isAnyPrevBoxCaptured, currBoxId) => {
          const isCurrBoxCaptured = this.isBoxCaptured(currBoxId);
          if(isCurrBoxCaptured){
            scoreToAdd++;
            boxCoordinates[currBoxId].isCaptured = true;
          }
          return(isAnyPrevBoxCaptured || isCurrBoxCaptured);
        }, false);

      // find out the latest players scores
      // change the turn if no box was captured
      if(isAnyBoxCaptured && this.state.player1IsNext){
        player1Score = player1Score + scoreToAdd;
      }
      else if(isAnyBoxCaptured && !this.state.player1IsNext){
        player2Score = player2Score + scoreToAdd;
      }
      else if(!isAnyBoxCaptured)
        player1IsNext = !player1IsNext;

      this.setState({
        boxCoordinates: boxCoordinates,
        player1Score: player1Score,
        player2Score: player2Score,
        player1IsNext: player1IsNext
        },() =>{
          // did the last line click result in the end of game? find results
          let result='';
          const areAllBoxesCaptured = this.areAllBoxesCaptured();
          if(areAllBoxesCaptured)
            if(this.state.player1Score > this.state.player2Score)
              result = constants.player1Win;
            else if(this.state.player1Score < this.state.player2Score)
              result = constants.player2Win;
            else if(this.state.player1Score === this.state.player2Score)
              result = constants.matchDraw;
          this.setState({result: result});
        });
      });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <svg height="500" width="500" viewBox="0 0 600 600" >

            {/*draw player 1*/}
            <circle cx="30" cy="20" r="17" fill={constants.player1Color}
              stroke={this.state.player1IsNext? 'lightblue': 'none'}
              strokeWidth="3"/>
            <rect x="5" y="38" width="50" height="30" rx="10" fill={constants.player1Color}
              stroke={this.state.player1IsNext? 'lightblue': 'none'}
              strokeWidth="3"/>
            <text x="72" y="57" fill="maroon">{this.state.player1Score}</text>

            <text x="180" y="57" fill="maroon">{this.state.result}</text>

            {/*draw player 2*/}
            <circle cx="470" cy="20" r="17" fill={constants.player2Color}
              stroke={!this.state.player1IsNext? 'lightblue': 'none'} strokeWidth="3"/>
            <rect x="445" y="38" width="50" height="30" rx="10" fill={constants.player2Color}
              stroke={!this.state.player1IsNext? 'lightblue': 'none'} strokeWidth="3"/>
            <text x="415" y="57" fill="maroon">{this.state.player2Score}</text>

            {/*game area*/}
            <rect y="90" width="500" height="500" fill="lightblue"/>
            <ClickedContext.Provider value={{
              state: this.state,
              setClickedLineId:(value) => this.setState({clickedLineId:value})}}>
                {
                  Object.keys(this.state.boxCoordinates).map((i) => {
                    let iNum = Number(i);
                    let points = `${this.state.boxCoordinates[iNum].x1},${this.state.boxCoordinates[iNum].y1} `;
                    points+= `${this.state.boxCoordinates[iNum].x2},${this.state.boxCoordinates[iNum].y2} `;
                    points+= `${this.state.boxCoordinates[iNum].x3},${this.state.boxCoordinates[iNum].y3} `;
                    points+= `${this.state.boxCoordinates[iNum].x4},${this.state.boxCoordinates[iNum].y4} `;
                    return <Box key={i} points={points} i={i} player1IsNext={this.state.player1IsNext}
                      lineIdsOfBox={[this.state.boxCoordinates[iNum].line0Id,
                        this.state.boxCoordinates[iNum].line1Id,
                        this.state.boxCoordinates[iNum].line2Id,
                        this.state.boxCoordinates[iNum].line3Id]}/>;
                    }
                  )
                }

                {
                  Object.keys(this.state.lineCoordinates).map((i) => {
                    let result = [];
                    result.push(<Line key={'line'+i} i={i}
                      x1={this.state.lineCoordinates[i].x1}
                      y1={this.state.lineCoordinates[i].y1}
                      x2={this.state.lineCoordinates[i].x2}
                      y2={this.state.lineCoordinates[i].y2}
                      onClick={this.handleClick}></Line>);
                    return result;
                  }
                )
              }
            </ClickedContext.Provider>

            {Object.keys(this.state.dotCoordinates).map((i) => {
              let result = <circle cx={this.state.dotCoordinates[i].x}
                cy={this.state.dotCoordinates[i].y} r="10" fill="maroon" key={i}/>;
              return result;
              }
            )}
          </svg>
        </header>
      </div>
    );
  }
}

export default App;
