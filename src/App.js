import React from 'react';
import './App.css';

function App() {
  let cy = 70;
  let cx = 70;
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
        </svg>
      </header>
    </div>
  );
}

export default App;
