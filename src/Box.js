import React from 'react';
import {ClickedContext} from './ClickedContext';
import {constants} from './constants';

class Box extends React.Component{

  constructor(props){
    super(props);
    let areLinesOfBoxClicked = props.lineIdsOfBox.reduce(
      (lineIdToClickedStatus, lineId) => ({...lineIdToClickedStatus, [lineId]: false}), {});

    this.state = {
      areLinesOfBoxClicked: areLinesOfBoxClicked,
      colorOfCapturedBox: ""
    }
  }

  componentDidUpdate(){
    let context = this.context;
    let colorOfCapturedBox = "";
    //process the line click only if it's not already been clicked and exists for this box
    if(context.state.clickedLineId && (this.state.areLinesOfBoxClicked[context.state.clickedLineId] === false)){
      let areLinesOfBoxClicked = this.state.areLinesOfBoxClicked;
      areLinesOfBoxClicked[context.state.clickedLineId] = true;
      let isBoxCaptured =
        Object.values(areLinesOfBoxClicked).reduce((result, curr) => {return(result && curr)}, true);
      if(isBoxCaptured && !this.state.colorOfCapturedBox)
        colorOfCapturedBox = (this.props.player1IsNext? constants.player1Color: constants.player2Color);
      this.setState({ // minimize set states
        areLinesOfBoxClicked: areLinesOfBoxClicked,
        colorOfCapturedBox: colorOfCapturedBox});
    }
  }

  render(){
    return (
      <polygon key={this.props.i} points={this.props.points}
      fill={this.state.colorOfCapturedBox? this.state.colorOfCapturedBox: 'transparent'}
      stroke="white">
      </polygon>
    );
  }
}

Box.contextType = ClickedContext;
export default Box;
