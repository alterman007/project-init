import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStore } from 'redux';
import { createActions, handleActions } from 'redux-actions';
import { connect } from 'react-redux';

const initState = { name: 'world', count: 0 };
const actionCreators = createActions(
  {
    NUM: {
      INC: (amount =  1) => (amount),
      DEC: (amount = -1) => (amount),
    },
    NAME: {
      CHANGE: (name = 'world') => name,
    }
  },
  { namespace: '--' },
)
// window.actionCreators = actionCreators;
/**
 * todo: q1 handleActions是否可以写成递归结构?
*/
const reducer = handleActions(
  {
    [actionCreators.num.inc]: (state, action) => ({ ...state, count: state.count + action.payload }),
    [actionCreators.num.dec]: (state, action) => ({ ...state, count: state.count + action.payload }),
    [actionCreators.name.change]: (state, action) => ({ ...state, name: action.payload }),
  },
  initState,
);

export const store = createStore(
  reducer,
  initState,
);

const mapStateToProps = ({ count, name }) => ({
  count: count,
  name: name,
});
const mapStateToDispatch = (dispatch) => ({
  increment: () => dispatch(actionCreators.num.inc( 1)),
  decrement: () => dispatch(actionCreators.num.dec(-1)),
  changeName: (ev) => dispatch(actionCreators.name.change(ev.target.value))
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