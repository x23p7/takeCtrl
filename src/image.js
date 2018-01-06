import React, {Component} from 'react';
import Draggable, { DraggableCore } from 'react-draggable';

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  A: 65,
  D: 68,
  S: 83,
  W: 87,
  SPACE: 32,
};

export class Image extends Component {
  constructor() {
    super();
    this.state = {
      curHeight:0,
      position: {x:0,y:300},
      keys: {
        left: 0,
        right: 0,
        up: 0,
        down: 0,
        space: 0,
      },
    };
    

    this.tickTime=50;
    this.startTime=0;
    this.hesitationTime = 0;
    this.currentTime=0;
    this.lastCompletionTime = 0;
    this.origDir = null;
    this.changedDir=false;
    this.outcome = 'none';

    this.startHeight=300;
    this.startPos= {};
    this.shrinkFactor=0.5;
    this.goalSpeedUpFactor = 30;
    this.myHeight = 300;
    this.moveSpeed=0.3;
    this.maxTime=15000;

    this.position = {}

    this.topSelect=50;
    this.bottomSelect=550;
    this.delete = false;
    this.dragging=false;
    this.pathList=null;
    this.currentPathIndex;
    this.imagePath = null;

    this.keyMove=false;
    this.desiredPosition={x:0,y:0};
    this.speed=5;
    this.stepSize=1000;

    this.winDir={}

  }


  clamp = function (number, min, max) {
    return Math.max(min, Math.min(number, max));
  }

  sqr = function (number,pow){
    let num = number;
    for (var i = 1; i <= pow; i++) {
      num*=num;
    }
    return (num);
  }



  tick = function(){
    if (this.currentTime <= this.maxTime-this.tickTime) {

    this.currentTime +=this.tickTime;
    if (this.delete){
      this.currentTime +=this.tickTime*this.goalSpeedUpFactor;
    }
    }
    

    if (this.currentTime<this.maxTime){
    this.myHeight = this.startHeight-this.startHeight*this.shrinkFactor*(this.currentTime/this.maxTime);
    //this.myHeight = this.state.startHeight - this.state.startHeight * this.shrinkFactor * (this.currentTime / this.maxTime);
    const viewportOffset =  this.el.getBoundingClientRect();
    const topPos = viewportOffset.top + window.scrollY;
    this.setState({
      curHeight: (this.myHeight - this.myHeight * Math.abs(topPos - this.startPos.y) / 1000).toString(),
    })
    }
    else {this.delete=true;}

    if (!this.delete){
      this.movement();
      }
    
    if (!this.dragging && !this.delete){
      this.checkOutComeZone(this.winDir);
    }

    if (this.delete && this.currentTime>=this.maxTime){
      const {results} = this.props;
      results.push(this.result);
      
      this.reset();
      
    }
    }



  handleKeys = function (value, e) {
    let keys = this.state.keys;
    if (e.keyCode === KEY.LEFT || e.keyCode === KEY.A) keys.left = value;
    if (e.keyCode === KEY.RIGHT || e.keyCode === KEY.D) keys.right = value;
    if (e.keyCode === KEY.DOWN || e.keyCode === KEY.S) keys.down = value;
    if (e.keyCode === KEY.UP || e.keyCode === KEY.W) keys.up = value;
    if (e.keyCode === KEY.SPACE) keys.space = value;
    this.keyMove = value;
    this.setState({
      keys: keys
    })
  }
  
  moveMeTo = function(desiredPos,speed){
    const element = document.getElementById('thisImage');
    const viewportOffset = element.getBoundingClientRect();
    const topPos = viewportOffset.top + window.scrollY;
    const leftPos = viewportOffset.left + window.scrollX;
    let position = this.winDir.name==='topBottom'? {x:0,y:topPos} : {x: leftPos,y: topPos};
    position.x += (desiredPos.x-position.x)*speed*(this.tickTime/1000);
    position.y += (desiredPos.y-position.y) * speed * (this.tickTime / 1000);
    this.setState({
      position:position,
    });
  }

  movement = function(){
    
    if (this.keyMove){
      if (this.state.keys.up){
        //this.desiredPosition.x+=(this.speed * (this.tickTime/1000));
        if (this.desiredPosition.y > this.state.position.y){
          this.desiredPosition.y=this.state.position.y;
        }
        this.desiredPosition.y -= (this.stepSize * (this.tickTime/1000));
      }
      if (this.state.keys.down) {
        if (this.desiredPosition.y < this.state.position.y) {
          this.desiredPosition.y = this.state.position.y;
        }
        //this.desiredPosition.x+=(this.speed * (this.tickTime/1000));
        this.desiredPosition.y += (this.stepSize * (this.tickTime / 1000));
      }
      this.moveMeTo(this.desiredPosition,this.speed);
      
    }
    
  }

  checkOutComeZone = function(winDir){
    const element = document.getElementById('thisImage');
    const viewportOffset = element.getBoundingClientRect();
    const topPos = viewportOffset.top + window.scrollY;
    const botPos = viewportOffset.bottom + window.scrollY;
    const leftPos = viewportOffset.left + window.scrollX;
    const rightPos = viewportOffset.right + window.scrollX;
     if (winDir.name ==='topBottom'){
      if ((topPos <= winDir.topSelect || botPos >= winDir.bottomSelect) && !this.delete) {
       this.delete = true;
       this.goalSpeedUp = this.goalSpeedUpFactor;
       this.outcome = topPos <= winDir.topSelect ? 'top' : 'bottom';
      }
     }
     if (winDir.name === 'leftRight') {
       if ((leftPos <= winDir.leftSelect || rightPos >= winDir.rightSelect) && !this.delete) {
         this.delete = true;
         this.goalSpeedUp = this.goalSpeedUpFactor;
         this.outcome = leftPos <= winDir.leftSelect ? 'top' : 'bottom';
       }
     }
  }
  imageOnLoad({ target: img }) {
   this.imageInterval = setInterval(this.tick.bind(this), this.tickTime);
  }

  componentWillMount(){
    const { images, position,winDir,ratio} = this.props;
    this.setName = images.SetName;
    this.pathList = images.Paths;
    this.imagePath = this.randomPath(this.pathList);
    this.startHeight/=ratio;
    this.startPos = position;
    this.desiredPosition = this.state.position;
    this.winDir = winDir;
    this.startPost /= ratio;

    this.setState({
      position:position,
    });
    }

  componentDidMount(){
    window.addEventListener('keyup', this.handleKeys.bind(this, false));
    window.addEventListener('keydown', this.handleKeys.bind(this, true));
    this.el = document.getElementById('thisImage');
    this.startTime=new Date();
    this.imageInterval= setInterval(this.tick.bind(this),this.tickTime);
    this.oldPos = this.el.getBoundingClientRect().top + window.scrollY;
  }

  handleDragStart(value,e){
    this.dragging=true;
    if (this.startTime>0 && this.hesitationTime===0){
      this.hesitationTime = new Date() - this.startTime;
      
    }
  }

  handleDrag(value,e){
    
    const viewportOffset =  this.el.getBoundingClientRect();
    const topPos = viewportOffset.top + window.scrollY;
    this.newDir = (this.oldPos - topPos) / Math.abs(this.oldPos - topPos);
    if (this.origDir !== this.newDir &&
          ( (this.origDir === 1 || this.origDir === -1) &&
            (this.newDir === 1 || this.newDir === -1)  
          )
        )
      {
        this.changedDir = true;
      }

    this.origDir = (this.oldPos - topPos) / Math.abs(this.oldPos - topPos);
    
    this.oldPos = topPos;
    
    

    this.setState({
      curHeight: (this.myHeight - this.myHeight * Math.abs(topPos - this.startPos.y)/1000).toString(),
    }
    )

  }

  handleDragStop(value,e){
    const element = document.getElementById('thisImage');
    const viewportOffset = element.getBoundingClientRect();
    const topPos = viewportOffset.top + window.scrollY;
    const leftPos = viewportOffset.left + window.scrollX;
    this.dragging=false;
    let position= this.winDir.name==='topBottom' ? {x:0,y:topPos}:{x:leftPos,y:topPos};
    this.setState({
      position:position,
    });
    this.desiredPosition = this.state.position;

    
  }


  randomPath = function(pathList){
    this.currentPathIndex = this.clamp(Math.round(Math.random() * (this.pathList.length - 1)),0,this.pathList.length-1);
    const path = this.pathList[this.currentPathIndex];
    return(path)
  }

  removeFromList = function (list,index,amount){
    list.splice(index,amount);
  }


  result = function(){
    const currentResults = {
     imageName: this.imagePath.replace('http://via.placeholder.com/', ''),
     choice: this.outcome,
     completionTime : new Date()-this.startTime - this.lastCompletionTime,
     hesitationTime : this.hesitationTime,
     changedDirection : this.changedDir,
     
    }
    this.lastCompletionTime = currentResults.completionTime;
    return (currentResults);
  }

  reset = function(){
    clearInterval(this.imageInterval);
    if (this.outcome!=='none'){
      this.removeFromList(this.pathList,this.currentPathIndex,1);
    }
    this.imagePath = this.randomPath();
    this.currentTime = 0;
    this.outcome='none';
    this.delete = false;
    this.desiredPos = this.startPos;
    this.myHeight = this.startHeight - this.startHeight * this.shrinkFactor * (this.currentTime / this.maxTime);
    this.setState({
      position: this.startPos,
      curHeight: this.myHeight,
    })
    
  }


  render(){
    return(
        <Draggable position={this.state.position}
         disabled={(this.delete || this.keyMove)} axis='y' bounds={{top:0,bottom:600}} defaultPosition={this.startPos}
         onStart={this.handleDragStart.bind(this)} onDrag={this.handleDrag.bind(this)}
         onStop={this.handleDragStop.bind(this)}>
        <img onLoad={this.imageOnLoad.bind(this)} id='thisImage' src={this.imagePath}
          height={this.state.curHeight} alt="no Img" draggable='false' vertical-align='middle'/>
        </Draggable>
    )
  }
}