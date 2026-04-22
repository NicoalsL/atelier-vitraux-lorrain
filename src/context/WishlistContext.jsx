import { createContext, useCallback, useEffect, useReducer } from 'react';
import { useAuth } from '../hooks/useAuth.js';

export const WishlistContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'SET':
      return { ...state, ids: new Set(action.payload) };
    case 'ADD':
      return { ...state, ids: new Set([...state.ids, action.id]) };
    case 'REMOVE': {
      const next = new Set(state.ids);
      next.delete(action.id);
      return { ...state, ids: next };
    }
    default:
      return state;
  }
}

export function WishlistProvider({ children }) {
  const { accessToken, user } = useAuth();
  const [state, dispatch] = useReducer(reducer, { ids: new Set() });

  // Charge la wishlist depuis le backend quand connecté
  useEffect(() => {
    if (!accessToken) {
      dispatch({ type: 'SET', payload: [] });
      return;
    }
    fetch('/api/wishlist/', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const ids = Array.isArray(data) ? data.map(item => item.product?.id).filter(Boolean) : [];
        dispatch({ type: 'SET', payload: ids });
      })
      .catch(() => {});
  }, [accessToken]);

  const toggle = useCallback(async (product) => {
    if (!user) return false; // retourne false si non connecté
    const isIn = state.ids.has(product.id);
    if (isIn) {
      dispatch({ type: 'REMOVE', id: product.id });
      await fetch(`/api/wishlist/${product.id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      }).catch(() => dispatch({ type: 'ADD', id: product.id }));
    } else {
      dispatch({ type: 'ADD', id: product.id });
      const r = await fetch('/api/wishlist/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ product_id: product.id }),
      }).catch(() => null);
      if (!r?.ok) dispatch({ type: 'REMOVE', id: product.id });
    }
    return true;
  }, [state.ids, user, accessToken]);

  const isWishlisted = useCallback((id) => state.ids.has(id), [state.ids]);

  return (
    <WishlistContext.Provider value={{ toggle, isWishlisted, count: state.ids.size }}>
      {children}
    </WishlistContext.Provider>
  );
}
