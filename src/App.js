import React, { Component } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './App.css';
import Input from '@material-ui/core/Input';

class App extends Component {
  state = {
    layoutName: "default",
    input: " "
  };

  //Generate random sentence using txtgen
  txtgen = require('txtgen');
  sentence = this.txtgen.sentence();
  sentence = this.sentence.replace(/[^\w\s]/gi, '')
  sentence = this.sentence.toLowerCase();

  stringSimilarity = require('string-similarity');
  similarity = "";
  enterClicked = false;

  onChange = input => {
    this.setState({
      input: input
    },
      () => {
        this.keyboard.setInput(input);
      });
  };

   onKeyPress = (button) => {
     if(button === '{ent}'){
       this.handleEnter();
     }
   };
   onChangeInput = event => {
   let input = event.target.value;
   this.setState(
     {
       input: input
     },
     () => {
       this.keyboard.setInput(input);
     }
   );
 };

//Compares the degree of similarity between two strings, based on Dice's Coefficient
//Using string-similarity
 handleEnter = () => {
   this.similarity = this.stringSimilarity.compareTwoStrings(this.sentence, this.state.input);
   this.enterClicked = true;
   alert("The text you entered has a "+this.similarity+" degree of similarity" );
 };

  render() {
    return (
      <div className="App">
      <h2>{this.sentence}</h2>
        <Input
          value={this.state.input}
          placeholder={"Please enter the above setence"}
          fullWidth="true"
          onChange={e => this.onChangeInput(e)}
        />
        <Keyboard
        ref={r => (this.keyboard = r)}
        layoutName={this.state.layoutName}
        layout= {{
          "default": [
            "q w e r t y u i o p",
             "a s d f g h j k l",
             "z x c v b n m {backspace}",
             "{space} {ent}"
        ]}}
        display={{
          "{ent}": "Enter",
          "{backspace}": "⌫",
          "{space}":" ",
        }}
        onChange={input =>
          this.onChange(input)}
        onKeyPress={button =>
          this.onKeyPress(button)}
        />
      </div>
    );
  }
}

export default App;
