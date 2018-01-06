import React, {Component} from 'react';
import { render } from 'react-dom';
import {Playfield} from './playfield.js';


class App extends Component{
  constructor(){
    super();
    this.state = {
      playFieldActive : true,
      menuActive : true,
      loginActive : false,
      loggedIn: false,
    };
  }

  setMenuState = function(value){
    this.setState({
      menuActive: this.value,
    });
  }
  setPlayFieldState = function (value){
    this.setState({
      playFieldActive : this.value,
    });
  }
  render() {
    return (
      <div>
       
       <Playfield isActive={this.state.playFieldActive}/>


      </div>
    );
    }
}


render(<App />, document.getElementById('root'));
