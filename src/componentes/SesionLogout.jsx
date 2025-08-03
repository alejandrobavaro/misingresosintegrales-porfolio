import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './SesionAuthContext';
import LoadingSpinner from './SesionLoadingSpinner';
import '../assets/scss/_03-Componentes/_SesionLoginRegister.scss';

// --------------------------------------------
// COMPONENTE DE CERRAR SESIÓN
// --------------------------------------------
const SesionLogout = () => {
  // Obtener dispatch del contexto de autenticación
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  // --------------------------------------------
  // EFECTO PARA MANEJAR EL LOGOUT
  // --------------------------------------------
  React.useEffect(() => {
    dispatch({ type: 'LOGOUT' });
    setTimeout(() => {
      navigate('/login'); // Redirige a la página de login
    }, 2000); // Simula un retraso
  }, [dispatch, navigate]);

  // Muestra el spinner mientras se procesa el logout
  return <LoadingSpinner />;
};

export default SesionLogout;