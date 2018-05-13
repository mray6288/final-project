import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// const http = require('http').Server(App);
// const io = require('socket.io')();
// const port = process.env.PORT || 3000;

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

// function onConnection(socket){
//   socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
// }

// io.on('connection', onConnection);

// http.listen(port, () => console.log('listening on port ' + port));


