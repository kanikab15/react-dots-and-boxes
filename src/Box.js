import React from 'react';
import {ClickedContext} from './ClickedContext';
import {constants} from './constants';

class Box extends React.Component{

  constructor(props){
    super(props);
    let areLinesOfBoxActive = props.lineIdsOfBox.reduce((result, key) => ({...result, [key]: false}), {});

    this.state = {
      areLinesOfBoxActive: areLinesOfBoxActive
    }
  }

  componentDidUpdate(){
    let context = this.context;
    if(context.state.clickedLineId && !this.state.areLinesOfBoxActive[context.state.clickedLineId]){
      let areLinesOfBoxActive = this.state.areLinesOfBoxActive;
      areLinesOfBoxActive[context.state.clickedLineId] = true;
      this.setState({areLinesOfBoxActive: areLinesOfBoxActive});
    }
  }

  render(){
    return (
      <ClickedContext.Consumer>
      {(context) => (
        <polygon key={this.props.i} points={this.props.points}
        fill={(Object.values(this.state.areLinesOfBoxActive).reduce((result, curr) => {return(result && curr);}, true))? 'blue': 'transparent'}
        stroke="white">
        </polygon>
      )}
      </ClickedContext.Consumer>
    );
  }
}

Box.contextType = ClickedContext;
export default Box;
