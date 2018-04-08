function undoable(reducer) {
  const initialState = {
    past: [],
    preset: reducer(undefined, {}),
    future: [],
  };

  return (state, action) => {
    const { past, present, future } = state;
    switch (action.type) {
      case 'UNDO':
        if (past.length) {
          const previous = past[past.length - 1]
          const newPast = past.slice(0, past.length - 1)
          return {
            past: newPast,
            present: previous,
            future: [ present, ...future ],
          };
        }
        return state;
      case 'REDO':
        if (future.length) {
          const next = future[0]
          const newFuture = future.slice(1)
          return {
            past: [ ...past, present ],
            present: next,
            future: newFuture,
          }
        }
        return state;
      default:
        const newPresent = reducer(present, action);
        if (present === newPresent) {
          return state
        }
        return {
          past: [ ...past, present ],
          present: newPresent,
          future: [],
        }
    }
  }
}
