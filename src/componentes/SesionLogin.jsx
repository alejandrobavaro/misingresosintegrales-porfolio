import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "./SesionAuthContext";
import LoadingSpinner from "./SesionLoadingSpinner";
import "../assets/scss/_03-Componentes/_SesionLoginRegister.scss";

// --------------------------------------------
// COMPONENTE DE INICIO DE SESIÓN
// --------------------------------------------
const SesionLogin = () => {
  // Estados para el formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Obtener estado y dispatch del contexto de autenticación
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  if (state.isAuthenticated) {
    return <Navigate to="/" />;
  }

  // --------------------------------------------
  // MANEJADOR DE LOGIN
  // --------------------------------------------
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: "LOGIN", payload: { email } });
      setLoading(false);
      navigate("/");
    }, 2000);
  };

  // --------------------------------------------
  // RENDERIZADO DEL COMPONENTE
  // --------------------------------------------
  return (
    <div className="auth-overlay">
      <div className="auth-container">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="auth-content">
            {/* Imagen decorativa superior */}
            <img
              className="auth-image top-image"
              src="/img/05-img-costados-larga/3.png"
              alt=""
            />
            
            {/* Formulario de login */}
            <form onSubmit={handleLogin} className="auth-form">
              <h2>Login</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Login</button>
              <hr />

              {/* Enlaces adicionales */}
              <div className="auth-links">
                <p>
                  Para Registrarte, <a href="/register">ingresa aquí.</a>
                </p>
                <hr />
                <p>
                  Para ingresar como Invitado,{""}
                  <a href="/submit">Ingresa aquí.</a>
                </p>
              </div>
            </form>
            
            {/* Imagen decorativa inferior */}
            <img
              className="auth-image bottom-image"
              src="/img/05-img-costados-larga/4.png"
              alt=""
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SesionLogin;