import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { connect } from 'react-redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import Rx from 'rxjs/Rx';
window.Rx = Rx;

const reducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INC':
      return { ...state, count: state.count + 1 };
    case 'DEC':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

const incAsyncEpic = (action$) => {
  return action$ 
    .ofType('INC_ASYNC')
    .delay(1000)
    .mapTo({ type: 'INC', payload: 1 });
};
const decAsyncEpic = (action$) => {
  return action$
    .ofType('DEC_ASYNC')
    .delay(1000)
    .mapTo({ type: 'DEC', payload: 1 });
};
const fetchURI = 'http://work-1252238710.cossh.myqcloud.com/api.json';
const fetchUserEpic = (action$) => {
  return action$.ofType('FETCH')
    .mergeMap((action) => {
      return Rx.Observable.from(fetch(fetchURI))
        .delay(1000)
        .flatMap((res) => Rx.Observable.from(res.json()))
        .map((payload) => {
          console.log(payload)
          return { type: 'INC' };
        })
        .catch(
          action$.ofType('CANCEL')
            .mapTo({ type: 'DEC' })
            .take(1)
        )
    });
}
const rootEpic = combineEpics(
  incAsyncEpic,
  decAsyncEpic,
  fetchUserEpic,
);

const epicMiddleware = createEpicMiddleware(rootEpic);
const store = createStore(
  reducer,
  applyMiddleware(epicMiddleware),
);

const mapStateToProps = (state) => ({
  count: state.count,
});
const mapDispatchToProps = (dispatch) => ({
  inc: () => dispatch({ type: 'INC' }),
  dec: () => dispatch({ type: 'DEC' }),
  incAsync: () => dispatch({ type: 'INC_ASYNC' }),
  decAsync: () => dispatch({ type: 'DEC_ASYNC' }),
  fetch: () => dispatch({ type: 'FETCH' }),
  cancel: () => dispatch({ type: 'CANCEL' }),
});

@connect(mapStateToProps, mapDispatchToProps)
class App extends Component {
  componentDidMount() {
  }
  render() {
    return (
      <div>
        <h1>{this.props.count}</h1>
        <img src="https://cn.bing.com/az/hprichbg/rb/MooseLakeGrass_ZH-CN12424437234_1920x1080.jpg" alt=""/>
        <button onClick={this.props.inc}>increment</button>
        <button onClick={this.props.dec}>decrement</button>
        <button onClick={this.props.incAsync}>inc async</button>
        <button onClick={this.props.decAsync}>dec async</button>
        <button onClick={this.props.fetch}>fetch</button>
        <button onClick={this.props.cancel}>cancel</button>
      </div>
    )
  }
}
export default App;
export {
  store,
}
