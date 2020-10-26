import React from 'react';

class Line extends React.Component{
  render(){
    return (
      <line key={'line'+this.props.i} className='line' x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2}
        onMouseOver={()=> console.log('hover'+this.props.i)} stroke="transparent"
        strokeWidth="6" onClick={()=> console.log('click'+this.props.i)}/>
    );
  }
}

export default Line;
