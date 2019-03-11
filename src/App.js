import React, { Component } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './App.css';
import Input from '@material-ui/core/Input';
import Handsfree from 'handsfree';

let handsfree = undefined;
let isSwipeMode = false;

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

  constructor(props) {
      super(props);
      this.handsfreeMouseDown = this.handsfreeMouseDown.bind(this);
      this.handsfreeMouseDrag = this.handsfreeMouseDrag.bind(this);
      this.handsfreeMouseUp = this.handsfreeMouseUp.bind(this);
  }

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

  componentDidMount() {
      if (typeof handsfree === 'undefined') {
          const config = {
              debug: false,
              hideCursor: false,
              settings: {
                  maxPoses: 1,
                  sensitivity: {
                      xy: 1,
                      click: 0.2,
                  },
                  stabilizer: {
                      factor: 1,
                      // Number of frames to stabilizer over
                      buffer: 30, //TODO may need to be 60...
                  },
                  webcam: {
                      //TODO actually set the real values for the camera
                      video: {
                          width: 640,
                          height: 480,
                      }
                  },
                  tracker: {
                      posenet: {
                          // - Set multiplier to a smaller value to increase speed at the cost of accuracy.
                          // - Possible values [0.5, 0.75, 1.0, 1.01]
                          multiplier: 0.75,

                          // A number between 0.2 and 1.0 representing what to scale the image by before feeding it through the network
                          // - Set this number lower to scale down the image and increase the speed when feeding through the network at the cost of accuracy.
                          imageScaleFactor: 0.4,

                          // The minimum overall confidence score required for the a pose/person to be detected.
                          minPoseConfidence: 0.1,

                          // The minimum confidence score for an individual keypoint, like the nose or a shoulder, to be detected.
                          minPartConfidence: 0.5,

                          // - The higher the number, the faster the performance but slower the accuracy
                          // - Possible values [8, 16, 32]
                          outputStride: 16,

                          // - Two parts suppress each other if they are less than nmsRadius pixels away
                          nmsRadius: 20,

                          // Only return instance detections that have root part score greater or equal to this value.
                          scoreThreshold: 0.5,
                      },
                  },
              },
          };
          handsfree = new Handsfree(config);
          handsfree.start();
      }


      window.addEventListener('handsfree:mouseDown', this.handsfreeMouseDown);
      window.addEventListener('handsfree:mouseDrag', this.handsfreeMouseDrag);
      window.addEventListener('handsfree:mouseUp', this.handsfreeMouseUp);
  }

  componentWillUnmount() {
      window.removeEventListener('handsfree:mouseDown', this.handsfreeMouseDown);
      window.removeEventListener('handsfree:mouseDrag', this.handsfreeMouseDrag);
      window.removeEventListener('handsfree:mouseUp', this.handsfreeMouseUp);
  }

  handsfreeMouseDown = (ev) => {
      // Called the first frame that a face clicks

      const face = ev.detail.face;
      const faceIndex = ev.detail.faceIndex;

      if(isSwipeMode) {

      } else {
          handsfree.triggerClick(face, faceIndex);
      }
  };

  handsfreeMouseDrag = (ev) => {
      // Called every frame after a face clicks and is still in "click mode"

      // const face = ev.detail.face;
      // const faceIndex = ev.detail.faceIndex;
  };

  handsfreeMouseUp = (ev) => {
      // Called when a face releases a click

      // const face = ev.detail.face;
      // const faceIndex = ev.detail.faceIndex;
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
