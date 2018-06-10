import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStore, applyMiddleware } from 'redux';
import { createActions, handleActions } from 'redux-actions';
import { isFSA } from 'flux-standard-action';
import { connect } from 'react-redux';
import axios from 'axios'
window.axios = axios;


const initState = { name: 'world', count: 0 };
const printState = ({ dispatch, getState }) => (next) => (action) => {
  console.log('before next', getState());
  next(action);
  console.log('after next', getState());
  return action;
}
const reduxThunk = ({ dispatch, getState }) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }
  return next(action);
};
const reduxPromise = ({dispatch}) => (next) => (action) => {
  if (!isFSA(action)) {
    return isPromise(action) ? action.then(dispatch) : next(action);
  }

  return isPromise(action.payload)
    ? action.payload
        .then(result => dispatch({ ...action, payload: result }))
        .catch(error => {
          dispatch({ ...action, payload: error, error: true });
          return Promise.reject(error);
        })
    : next(action);
};

const asyncAdd = (ms) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, ms);
});
const reducer = (state, action) => {
  switch (action.type) {
    case 'INC': 
      return { ...state, count: state.count + action.payload };
    case 'DEC': 
      return { ...state, count: state.count + action.payload };
    case 'CHANGE_NAME': 
      return { ...state, name: action.payload };
    default:
      return state;
  }
}

export const store = createStore(
  reducer,
  initState,
  applyMiddleware(reduxThunk, reduxPromise, printState),
);

const mapStateToProps = ({ count, name }) => ({
  count: count,
  name: name,
});

const mapStateToDispatch = (dispatch) => ({
  increment: () => dispatch({ type: 'INC', payload:  1 }),
  decrement: () => dispatch({ type: 'DEC', payload: -1 }),
  incAsync: () => dispatch(() => {
    setTimeout(() => {
      dispatch({ type: 'INC', payload:  1 })
    }, 1000)
  }),
  decAsync: () => dispatch(new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ type: 'INC', payload: - 1 });
    }, 1000);
  })),
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