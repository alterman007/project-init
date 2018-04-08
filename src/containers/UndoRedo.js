import React from 'react';
import { connect } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo'

const mapStatusToProps = (state) => ({
  canUndo: state.todos.past.length > 0,
  canRedo: state.todos.future.length > 0,
});
const mapDispatchToProps = (dispatch) => ({
  onUndo: () => dispatch(UndoActionCreators.undo()),
  onRedo: () => dispatch(UndoActionCreators.redo()),
})
let UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => (
  <p>
    <button onClick={onUndo} disabled={!canUndo}>
      Undo
    </button>
    <button onClick={onRedo} disabled={!canRedo}>
      Redo
    </button>
  </p>
)

export default connect(mapStatusToProps, mapDispatchToProps)(UndoRedo);
