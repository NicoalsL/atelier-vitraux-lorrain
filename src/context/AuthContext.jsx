import { createContext, useContext, useReducer, useEffect } from 'react';

const API = '/api/auth';

const initialState = {
  user:         null,
  accessToken:  localStorage.getItem('access_token')  || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  loading:      true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'LOGIN':
      localStorage.setItem('access_token',  action.payload.access);
      localStorage.setItem('refresh_token', action.payload.refresh);
      return {
        ...state,
        user:         action.payload.user,
        accessToken:  action.payload.access,
        refreshToken: action.payload.refresh,
        loading:      false,
      };
    case 'LOGOUT':
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return { ...state, user: null, accessToken: null, refreshToken: null, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Au montage : récupérer le profil si on a un token
  useEffect(() => {
    if (!state.accessToken) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }
    fetch(`${API}/profile/`, {
      headers: { Authorization: `Bearer ${state.accessToken}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(user => dispatch({ type: 'SET_USER', payload: user }))
      .catch(() => dispatch({ type: 'LOGOUT' }));
  }, []);  // eslint-disable-line

  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(state.accessToken ? { Authorization: `Bearer ${state.accessToken}` } : {}),
      ...(options.headers || {}),
    };
    return fetch(url, { ...options, headers });
  };

  const register = async (data) => {
    const r = await fetch(`${API}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await r.json();
    if (!r.ok) throw json;
    dispatch({ type: 'LOGIN', payload: json });
    return json;
  };

  const login = async (email, password) => {
    const r = await fetch(`${API}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await r.json();
    if (!r.ok) throw json;
    // simplejwt renvoie access + refresh, pas user — on va le chercher
    const profileRes = await fetch(`${API}/profile/`, {
      headers: { Authorization: `Bearer ${json.access}` },
    });
    const user = await profileRes.json();
    dispatch({ type: 'LOGIN', payload: { ...json, user } });
    return user;
  };

  const logout = async () => {
    try {
      await fetch(`${API}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.accessToken}`,
        },
        body: JSON.stringify({ refresh: state.refreshToken }),
      });
    } catch (_) { /* silent */ }
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (data) => {
    const r = await authFetch(`${API}/profile/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    const json = await r.json();
    if (!r.ok) throw json;
    dispatch({ type: 'SET_USER', payload: json });
    return json;
  };

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout, updateProfile, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}
