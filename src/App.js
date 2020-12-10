import React from 'react';
import './App.css';
import Line from './Line';

class App extends React.Component {
  state = {
    dotCoordinates : {},
    lineCoordinates: {},
    boxCoordinates: {}
  };

  componentDidMount(){
    let cy = 160;
    let cx = 70;
    // ideas for CRUD - undo last move, save game
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
                            'x1': dotCoordinates[i].x,'y1': dotCoordinates[i].y,
                            'x2': dotCoordinates[i+numOfRowCols].x, 'y2':dotCoordinates[i+numOfRowCols].y
                          };
      if((i+1) % numOfRowCols !== 0)
        lineCoordinates[i+(numOfDots-numOfRowCols)]={
                                                  'x1': dotCoordinates[i].x,'y1': dotCoordinates[i].y,
                                                  'x2': dotCoordinates[i+1].x, 'y2':dotCoordinates[i+1].y
                                                };
    }

    // find box coordinates
    for(let i=0;i<numOfDots;i++){
      if((i+numOfRowCols+1)<numOfDots && (i+1)%numOfRowCols!==0){
        boxCoordinates[i]={
                          'x1': dotCoordinates[i].x,'y1': dotCoordinates[i].y,
                          'x2': dotCoordinates[i+numOfRowCols].x, 'y2':dotCoordinates[i+numOfRowCols].y,
                          'x3': dotCoordinates[i+numOfRowCols+1].x, 'y3':dotCoordinates[i+numOfRowCols+1].y,
                          'x4': dotCoordinates[i+1].x,'y4': dotCoordinates[i+1].y
                        };
        // let line1 = this.findALineFromCoordinates({x1:boxCoordinates[i].x1, y1:boxCoordinates[i].y1,
        //   x2: boxCoordinates[i].x2, y2: boxCoordinates[i].y2}, lineCoordinates);
        // let line2 = this.findALineFromCoordinates({x1:boxCoordinates[i].x2, y1:boxCoordinates[i].y2,
        //   x2: boxCoordinates[i].x3, y2: boxCoordinates[i].y3}, lineCoordinates);
        // let line3 = this.findALineFromCoordinates({x1:boxCoordinates[i].x4, y1:boxCoordinates[i].y4,
        //   x2: boxCoordinates[i].x3, y2: boxCoordinates[i].y3}, lineCoordinates);
        // let line4 = this.findALineFromCoordinates({x1:boxCoordinates[i].x1, y1:boxCoordinates[i].y1,
        //   x2: boxCoordinates[i].x4, y2: boxCoordinates[i].y4}, lineCoordinates);
        // console.log(line1);
        // console.log(line2);
        // console.log(line3);
        // console.log(line4);
      }
    }

    this.setState({ lineCoordinates: lineCoordinates,
                    dotCoordinates: dotCoordinates,
                    boxCoordinates: boxCoordinates},()=>{
      // console.log(this.findALineFromCoordinates({x1:430,y1:430, x2:430,y2:520}));
      // console.log(this.state.boxCoordinates);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <svg height="500" width="500" viewBox="0 0 600 600" >

            <circle cx="30" cy="17" r="17" fill="#F29745"/>
            <rect x="5" y="35" width="50" height="30" rx="10" fill="#F29745"/>
            <text x="23" y="57" fill="maroon">1</text>

            <circle cx="470" cy="17" r="17" fill="#80BF5E"/>
            <rect x="445" y="35" width="50" height="30" rx="10" fill="#80BF5E"/>
            <text x="465" y="57" fill="maroon">2</text>

            <rect y="90" width="500" height="500" fill="lightblue"/>
            {
              Object.keys(this.state.boxCoordinates).map((i) => {
                let iNum = Number(i);
                let points = `${this.state.boxCoordinates[iNum].x1},${this.state.boxCoordinates[iNum].y1} `;
                points+= `${this.state.boxCoordinates[iNum].x2},${this.state.boxCoordinates[iNum].y2} `;
                points+= `${this.state.boxCoordinates[iNum].x3},${this.state.boxCoordinates[iNum].y3} `;
                points+= `${this.state.boxCoordinates[iNum].x4},${this.state.boxCoordinates[iNum].y4} `;
                return <polygon key={i} points={points} fill="#B7B7B7" stroke="white"/>;
                }
              )
            }

            {
              Object.keys(this.state.lineCoordinates).map((i) => {
                let result = [];
                result.push(<Line key={'line'+i} i={i} x1={this.state.lineCoordinates[i].x1} y1={this.state.lineCoordinates[i].y1}
                  x2={this.state.lineCoordinates[i].x2} y2={this.state.lineCoordinates[i].y2}></Line>);
                return result;
              }
            )
          }
            {Object.keys(this.state.dotCoordinates).map((i) => {
              let result = <circle cx={this.state.dotCoordinates[i].x} cy={this.state.dotCoordinates[i].y} r="10" fill="maroon" key={i}/>;
              return result;
              }
            )}
          </svg>
        </header>
      </div>
    );
  }

  findALineFromCoordinates({x1,y1,x2,y2}, lineCoordinates){
    let lineItems = lineCoordinates? (Object.entries(lineCoordinates)): Object.entries(this.state.lineCoordinates);
    let result={};
    for(let i=0;i<lineItems.length;i++)
    {
      let lineItem = lineItems[i][1];
      if(lineItem.x1===x1 && lineItem.x2===x2 && lineItem.y1===y1 && lineItem.y2===y2){
        result = lineItems[i]; break;
      }
    }
    return result;
  }
}

export default App;
