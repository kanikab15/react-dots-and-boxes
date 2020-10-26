import React from 'react';
import './App.css';
import Line from './Line';

function App() {
  let cy = 70;
  let cx = 70;
  let x1 = 70;
  let y1 = 70;
  // ideas for CRUD - undo last move, save game
  return (
    <div className="App">
      <header className="App-header">
        <svg height="600" width="500" viewBox="0 0 500 500" >
          <rect width="600" height="500" fill="lightblue"/>
          {[...Array(25)].map((key, i) => {
            let result = <circle cx={cx} cy={cy} r="10" fill="maroon"key={i}/>;
            cy += 90;
            if((i+1) % 5 === 0){
              cy = 70;
              cx+= 90;
            }
            return result;
            }
          )}
          {
            [...Array(25)].map((key, i) => {
            let result = [];
            if(i < 20){
              result.push(<Line key={'line'+i} i={i} x1={x1} y1={y1} x2={x1+90} y2={y1}></Line>);
            }
            if((i+1) % 5 !== 0){
              result.push(<Line key={'line'+(i+25)} i={i+25} x1={x1} y1={y1} x2={x1} y2={y1+90}></Line>);
            }
            y1 += 90;
            if((i+1) % 5 === 0){
              y1 = 70;
              x1+= 90;
            }
            return result;
            }
          )}
        </svg>
      </header>
    </div>
  );
}

export default App;
