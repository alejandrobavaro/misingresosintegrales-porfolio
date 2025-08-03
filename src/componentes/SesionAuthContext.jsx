import React, { createContext, useReducer, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import '../assets/scss/_03-Componentes/_SesionLoginRegister.scss';

// --------------------------------------------
// CREACIÓN DEL CONTEXTO
// --------------------------------------------
// Crea el contexto de autenticación que será usado por toda la app
const AuthContext = createContext();

// --------------------------------------------
// REDUCER PARA MANEJO DE ESTADO
// --------------------------------------------
// Maneja todas las acciones relacionadas con la autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { 
        ...state, 
        isAuthenticated: true, 
        user: action.payload,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null,
        loading: false,
        error: null
      };
    case 'REGISTER':
      return { 
        ...state, 
        isAuthenticated: true, 
        user: action.payload,
        loading: false,
        error: null
      };
    case 'LOADING':
      return { ...state, loading: true };
    case 'ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// --------------------------------------------
// PROVIDER DE AUTENTICACIÓN
// --------------------------------------------
// Componente que provee el contexto a toda la aplicación
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    isAuthenticated: false, 
    user: null,
    loading: false,
    error: null
  });

  // Memoizar el valor del contexto para optimización
  const value = useMemo(() => ({
    state,
    dispatch,
    login: (userData) => {
      dispatch({ type: 'LOADING' });
      try {
        // Simular llamada a API
        setTimeout(() => {
          dispatch({ type: 'LOGIN', payload: userData });
        }, 500);
      } catch (error) {
        dispatch({ type: 'ERROR', payload: error.message });
      }
    },
    logout: () => {
      dispatch({ type: 'LOADING' });
      try {
        // Simular llamada a API
        setTimeout(() => {
          dispatch({ type: 'LOGOUT' });
        }, 300);
      } catch (error) {
        dispatch({ type: 'ERROR', payload: error.message });
      }
    },
    register: (userData) => {
      dispatch({ type: 'LOADING' });
      try {
        // Simular llamada a API
        setTimeout(() => {
          dispatch({ type: 'REGISTER', payload: userData });
        }, 500);
      } catch (error) {
        dispatch({ type: 'ERROR', payload: error.message });
      }
    }
  }), [state]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// --------------------------------------------
// HOOK PERSONALIZADO PARA USAR EL CONTEXTO
// --------------------------------------------
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };