import React from 'react';
import {ClickedContext} from './ClickedContext';

class Box extends React.Component{

  render(){
    return (
      <ClickedContext.Consumer>
      {(context) => (
        <g>
        <polygon key={this.props.i} points={this.props.points} fill="transparent" stroke="white">
        </polygon>
        <text x={this.props.txtPoints.x1} y={this.props.txtPoints.y1} fill="maroon" >
          {this.props.lineIdsOfBox.find(element => element === context.state.clickedLineId)}</text>
        </g>
      )}
      </ClickedContext.Consumer>
    );
  }
}

export default Box;
