import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { delay } from 'redux-saga';
import { throttle, call, put, race, takeEvery, take, select, fork, cancel, cancelled } from 'redux-saga/effects';
import { connect } from 'react-redux';
import axios from 'axios'
// window.axios = axios;

const fetchURI = 'http://work-1252238710.cossh.myqcloud.com/api.json';

const initState = { name: 'world', count: 0 };

const reducer = (state, action) => {
  switch (action.type) {
    case 'INC':
      return { ...state, count: state.count + action.payload };
    case 'DEC':
      return { ...state, count: state.count + action.payload };
    case 'CHANGE_NAME':
      return { ...state, name: action.payload };
    case 'UPDATE_ALL':
      return { ...state, ...action.payload }
    default:
      return state;
  }
}

const sagaMiddleware = createSagaMiddleware()

function* fetchData(action) {
  console.log(`hello ${action.payload}`);
}
function* listenAsyncAdd() {
  yield throttle(500, 'CHANGE_NAME', fetchData);
}

function* rootSaga() {
  yield [
    listenAsyncAdd(),
  ];
}

export const store = createStore(
  reducer,
  initState,
  applyMiddleware(sagaMiddleware),
);
sagaMiddleware.run(rootSaga);

const mapStateToProps = ({ count, name }) => ({
  count,
  name,
});

const mapStateToDispatch = (dispatch) => ({
  increment: () => dispatch({ type: 'INC', payload:  1 }),
  decrement: () => dispatch({ type: 'DEC', payload: -1 }),
  incAsync: () => dispatch({ type: 'START_TASK' }),
  decAsync: () => dispatch({ type: 'CANCEL' }),
  changeName: (ev) => dispatch({ type: 'CHANGE_NAME', payload: ev.target.value }),
})

@connect(mapStateToProps, mapStateToDispatch)
class App extends Component {
  static propTypes = {
    count: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }
  render() {
    const { name, count } = this.props;
    return (<div>
      <h1>{this.props.name} is {this.props.count}</h1>
      <button onClick={this.props.increment}>increment</button>
      <button onClick={this.props.decrement}>decrement</button>
      <button onClick={this.props.incAsync}>inc-async</button>
      <button onClick={this.props.decAsync}>dec-async</button>
      <input type="text" value={this.props.name} onChange={this.props.changeName}/>
    </div>)
  }
}

export default App;

function isPromise(val) {
  return val && typeof val.then === 'function';
}
