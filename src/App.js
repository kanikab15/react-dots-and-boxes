import React from 'react';
import './App.css';
import Line from './Line';

function App() {
  let cy = 160;
  let cx = 70;
  let x1 = 70;
  let y1 = 160;
  // ideas for CRUD - undo last move, save game
  return (
    <div className="App">
      <header className="App-header">
        <svg height="500" width="500" viewBox="0 0 600 600" >

          <circle cx="30" cy="17" r="17" fill="#F29745"/>
          <rect x="5" y="35" width="50" height="30" rx="10" fill="#F29745"/>

          <circle cx="470" cy="17" r="17" fill="#80BF5E"/>
          <rect x="445" y="35" width="50" height="30" rx="10" fill="#80BF5E"/>

          <rect y="90" width="500" height="500" fill="lightblue"/>
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
              y1 = 160;
              x1+= 90;
            }
            return result;
            }
          )}
          {[...Array(25)].map((key, i) => {
            let result = <circle cx={cx} cy={cy} r="10" fill="maroon" key={i}/>;
            cy += 90;
            if((i+1) % 5 === 0){
              cy = 160;
              cx+= 90;
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
