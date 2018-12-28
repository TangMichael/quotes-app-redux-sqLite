let nextFavoriteId = 0;
let nextQuoteId = 0;
export const addFavorites = quote => ({
  type: 'ADD_FAVORITES',
  id: nextFavoriteId++,
  quote
})

export const getFavorites = quote => ({
    type: 'GET_FAVORITES',
    quote
})

