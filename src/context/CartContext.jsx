import { createContext, useCallback, useMemo, useReducer } from 'react';

/**
 * État du panier
 *   items : [{ id, name, price, image, quantity, ... }]
 *
 * NB : on reste en mémoire pour l'instant. Quand le back Django sera branché,
 * on remplacera ce reducer par des appels API (POST /api/cart/items, etc.),
 * ou on gardera le client-side et on synchronisera à la commande.
 */

const CartContext = createContext(null);
export { CartContext };

const initialState = { items: [] };

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, quantity = 1 } = action;
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            slug: product.slug,
            quantity,
          },
        ],
      };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };

    case 'SET_QUANTITY': {
      const qty = Math.max(1, action.quantity);
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.id ? { ...i, quantity: qty } : i)),
      };
    }
    case 'CLEAR':
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addItem = useCallback((product, quantity = 1) => {
    dispatch({ type: 'ADD', product, quantity });
  }, []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', id }), []);
  const setQuantity = useCallback(
    (id, quantity) => dispatch({ type: 'SET_QUANTITY', id, quantity }),
    []
  );
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const { count, subtotal } = useMemo(() => {
    const count = state.items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
    return { count, subtotal };
  }, [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      count,
      subtotal,
      addItem,
      removeItem,
      setQuantity,
      clear,
    }),
    [state.items, count, subtotal, addItem, removeItem, setQuantity, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
