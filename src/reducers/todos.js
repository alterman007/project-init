const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        { ...action.payload, completed: false },
      ];
    case 'TOGGLE_TODO':
      return state.map((todo) => (todo.id === action.payload)
        ? { ...todo, completed: !todo.completed }
        : todo
      );
    default:
      return state;
  }
}
export default todos;
