import React from 'react';
import {ClickedContext} from './ClickedContext';
import {constants} from './constants';

class Box extends React.Component{

  constructor(props){
    super(props);
    let areLinesOfBoxActive = props.lineIdsOfBox.reduce((lineIdToActiveStatus, lineId) => ({...lineIdToActiveStatus, [lineId]: false}), {});

    this.state = {
      areLinesOfBoxActive: areLinesOfBoxActive,
      boxCapturedByPlayerColor: ""
    }
  }

  componentDidUpdate(){
    let context = this.context;
    let boxCapturedByPlayerColor = "";
    //process the line click only if it's not already been clicked and exists for this box
    if(context.state.clickedLineId && (this.state.areLinesOfBoxActive[context.state.clickedLineId] === false)){
      let areLinesOfBoxActive = this.state.areLinesOfBoxActive;
      areLinesOfBoxActive[context.state.clickedLineId] = true;
      let isBoxCaptured =
        Object.values(areLinesOfBoxActive).reduce((result, curr) => {return(result && curr)}, true);
      if(isBoxCaptured && !this.state.boxCapturedByPlayerColor)
        boxCapturedByPlayerColor = (this.props.player1IsNext? constants.player1Color: constants.player2Color);
      this.setState({ // minimize set states
        areLinesOfBoxActive: areLinesOfBoxActive,
        boxCapturedByPlayerColor: boxCapturedByPlayerColor});
    }
  }

  render(){
    return (
      <polygon key={this.props.i} points={this.props.points}
      fill={this.state.boxCapturedByPlayerColor? this.state.boxCapturedByPlayerColor: 'transparent'}
      stroke="white">
      </polygon>
    );
  }
}

Box.contextType = ClickedContext;
export default Box;
