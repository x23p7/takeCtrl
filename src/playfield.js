import React, { Component } from 'react';
import  {Image}  from './image.js';




export class Playfield extends Component{
constructor(){
  super();
  this.state = {
    screen: {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.devicePixelRatio || 1,
    },
    results : [],
  }

  this.images = {
    SetName:'',
    Paths:[
      'http://via.placeholder.com/150x240',
      'http://via.placeholder.com/240x240',
      'http://via.placeholder.com/50x240',
      'http://via.placeholder.com/400x240',
      'http://via.placeholder.com/300x240',
      'http://via.placeholder.com/170x240',
      'http://via.placeholder.com/100x240',
      'http://via.placeholder.com/340x240',
      'http://via.placeholder.com/120x240',
      'http://via.placeholder.com/130x240',
      'http://via.placeholder.com/140x240',
      'http://via.placeholder.com/160x240',
      'http://via.placeholder.com/220x240',
      'http://via.placeholder.com/260x240',
      'http://via.placeholder.com/320x240',
      'http://via.placeholder.com/350x240',
      'http://via.placeholder.com/500x240',
      'http://via.placeholder.com/470x240',
      'http://via.placeholder.com/270x240',
      'http://via.placeholder.com/330x240',
      ],
  };

  this.imagePosition = {x:0,y:300}
  this.myWinDir = { name:'topBottom',
                    topSelect:50,
                    bottomSelect:790,
                    leftSelect:100,
                    rightSelect:640,  
                  };
  this.style= this.myWinDir.name==='topBottom' ? {
    //fontFamily: 'sans-serif',
    textAlign: 'center',
  } : {};
}
  componentDidMount(){
  }
  render(){
    const {isActive} = this.props;
    if (isActive){
    this.imagePosition.x /= this.state.screen.ratio;
    this.imagePosition.y /= this.state.screen.ratio;
    this.myWinDir.bottomSelect /= this.state.screen.ratio;
    this.myWinDir.rightSelect /= this.state.screen.ratio;
    return(
    <div style = {this.style}>
        <Image images={this.images} results={this.state.results} position={this.imagePosition} winDir={this.myWinDir} ratio={this.state.screen.ratio}>
        </Image>
    </div>
    )
    }
    if (!isActive){
      return(
        <div style = {this.style}>
        </div>
      )
    }
  }
}