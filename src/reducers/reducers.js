const initialState = {
  quotes: [],
  favorites: [],
  history: []
};
const reducers = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_FAVORITES":
      newquote = { id: action.id, quote: action.quote };
      return {
        ...state,
        favorites: [...state.favorites, newquote]
      };
    case "REMOVE_FAVORITES":
      state.favorites.splice(action.id, 1);
      return [...state];
    case "GET_FAVORITES":
      return state.favorites;
    case "GET_QUOTE":
      newquote = {
        id: action.id,
        quote: action.quote
      };
      return {
        ...state,
        history: [...state.history, newquote]
      };
    default:
      return state;
  }
};

export default reducers;
