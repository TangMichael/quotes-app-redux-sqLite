let nextFavoriteId = 0;
let nextQuoteId = 0;
export const addFavorites = quote => ({
  type: 'ADD_FAVORITES',
  id: quote.id,
  quote: quote.quote
})

export const removeFavorites = id => ({
  type: 'REMOVE_FAVORITES',
  id: id
})