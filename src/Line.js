import React from 'react';

class Line extends React.Component{

  line = React.createRef();

  handleClick = () => {
    console.log('click'+this.props.i);
    this.line.current.classList.add("line-clicked");
  }

  render(){
    return (
      <line ref={this.line} key={'line'+this.props.i} className='line' x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2}
        onMouseOver={()=> console.log('hover'+this.props.i)}
        strokeWidth="6" onClick={this.handleClick}/>
    );
  }
}

export default Line;
