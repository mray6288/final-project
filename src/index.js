import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ConnectedApp } from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import gameReducer from './reducers/gameReducer'


let store = createStore(gameReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

ReactDOM.render(
	<Provider store={store}>
		<ConnectedApp store={store}/>
	</Provider>, 
	document.getElementById('root'));
registerServiceWorker();


