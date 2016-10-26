import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { Provider } from 'react-redux'
import App from './App'
import reducers from './reducers'

let store = createStore( reducers, applyMiddleware( thunk, createLogger() ) )

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
)
