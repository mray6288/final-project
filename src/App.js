import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Canvas from './components/Canvas'
import { subscribeToDrawing } from './api';

// const URL = 'https://inputtools.google.com/request?ime=handwriting&app=quickdraw&dbg=1&cs=1&oe=UTF-8'



class App extends Component {

  constructor(props){
    super()

    // subscribeToDrawing((err, timestamp) => this.setState({timestamp}), 'hello')
    // this.socket = props.io();
  }
  state = {
    // canvasTwo: 'no timestamp yet'
  }

  // componentDidMount(){
  //   this.interval = setInterval(fetchGuesses, 1000)
  // }

  // componentWillUnmount(){
  //   clearInterval(this.interval)
  // }

  

  // fetchGuesses(vectors) {
  //   let data = {"input_type":0,
  //            "requests":[
  //             {"language":"quickdraw",
  //             "writing_guide":{"width":1200,"height":260},
  //             "ink":[vectors]
  //             }
  //            ]
  //           }

  //   fetch(URL, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type':'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   }).then(r=>r.json()).then(json=>console.log(json))
  // }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <h1 className="App-title">Drawing Game</h1>
          
        </header>
        
        <Canvas />
      </div>
    );
  }
}

export default App;
