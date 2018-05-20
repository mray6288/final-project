import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import gameReducer from './reducers/gameReducer'
import {BrowserRouter as Router} from 'react-router-dom'

// Action Cable setup
import actionCable from 'actioncable'
const CableApp = {}
CableApp.cable = actionCable.createConsumer(`ws://${window.location.hostname}:3000/cable`)

let store = createStore(gameReducer, applyMiddleware(thunk))

ReactDOM.render(
	<Router>
		<Provider store={store}>
			<App store={store} cableApp={CableApp}/>
		</Provider>
	</Router>, 
	document.getElementById('root'));
registerServiceWorker();


