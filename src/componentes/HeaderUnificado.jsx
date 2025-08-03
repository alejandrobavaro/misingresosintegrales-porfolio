// ===========================================================
// COMPONENTE HEADERUNIFICADO.JSX - VERSIÓN OPTIMIZADA
// ===========================================================

// SECCIÓN 1: IMPORTACIONES
// -----------------------------------------------------------

// React y hooks esenciales
import React, { useState, useEffect } from "react";

// Componente para navegación interna
import { Link } from "react-router-dom";

// Validación de propiedades
import PropTypes from "prop-types";

// Contexto de autenticación
import { useAuth } from "./SesionAuthContext";

// Iconos de Bootstrap
import {
  BsFillPersonPlusFill, // Icono login
  BsBoxArrowRight, // Icono logout
  BsList, // Icono menú mobile
  BsHouse, // Icono inicio
  BsEnvelope, // Icono contacto
  BsPerson, // Icono usuario
  BsCashCoin, // Icono ingresos
  BsDatabase, // Icono datos
} from "react-icons/bs";

// Componentes de Bootstrap para estructura
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";

// Estilos específicos del componente
import "../assets/scss/_03-Componentes/_HeaderUnificado.scss";

// SECCIÓN 2: COMPONENTE PRINCIPAL
// -----------------------------------------------------------

/**
 * Componente de header unificado que incluye:
 * - Logo y navegación principal
 * - Reloj y fecha actual
 * - Sección de autenticación (login/logout)
 */
const HeaderUnificado = ({
  // Props recibidas (actualmente no utilizadas pero mantenidas para futuras funcionalidades)
  categories = [], // Lista de categorías para filtrado
  onCategoryChange = () => {}, // Manejador cambio de categoría
  searchQuery = "", // Texto de búsqueda actual
  setSearchQuery = () => {}, // Manejador de búsqueda
  placeholder = "Buscar...", // Placeholder para campo de búsqueda
}) => {
  // SECCIÓN 3: ESTADOS Y CONTEXTOS
  // -----------------------------------------------------------

  // Contexto de autenticación (estado del usuario y función dispatch)
  const { state, dispatch } = useAuth();

  // Estado para controlar menú mobile (abierto/cerrado)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estado para mantener la hora actual
  const [currentTime, setCurrentTime] = useState(new Date());

  // SECCIÓN 4: EFECTOS SECUNDARIOS
  // -----------------------------------------------------------

  // Actualiza la hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer); // Limpieza al desmontar
  }, []);

  // SECCIÓN 5: MANEJADORES DE EVENTOS
  // -----------------------------------------------------------

  // Alterna el estado del menú mobile
  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // SECCIÓN 6: FUNCIONES AUXILIARES
  // -----------------------------------------------------------

  // Formatea la hora como "HH:MM" (horario argentino)
  const formatTime = (date) =>
    date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Formatea la fecha como "Día, DD de MMM" (ej: "lun, 12 de jun")
  const formatDate = (date) =>
    date.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  // SECCIÓN 7: RENDERIZADO DEL COMPONENTE
  // -----------------------------------------------------------
  return (
    <div className="header-completo">
      {/* Contenedor principal del header */}
      <header className="header-principal">
        {/* Navbar de Bootstrap con sistema responsive */}
        <Navbar expand="lg" className="navbar">
          <Container fluid className="header-container">
            {/* Logo - Enlace a la página principal */}
            <Navbar.Brand as={Link} to="/" className="logo-container">
              <img
                src="/img/02-logos/logomisingresos.png"
                alt="Logo de la aplicación"
                className="logoHeader"
              />
            </Navbar.Brand>

            {/* Botón toggle para menú mobile */}
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              onClick={handleToggleMobileMenu}
            >
              <BsList className="menu-icon" />
            </Navbar.Toggle>

            {/* Contenido colapsable (menú completo) */}
            <Navbar.Collapse
              id="basic-navbar-nav"
              className={`${isMobileMenuOpen ? "show" : ""}`}
            >
              <div className="header-main-flex">
                {/* SECCIÓN 8: NAVEGACIÓN PRINCIPAL */}
                    {/* Enlace a Inicio */}
                    <Nav.Link
                    as={Link}
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BsHouse className="nav-icon" />
                    <span className="nav-text">Inicio</span>
                  </Nav.Link>

                {/* ----------------------------------------------------------- */}
                <Nav className="main-nav">
              
                  {/* Enlace a Ingresos-Cobros */}
                  <Nav.Link
                    as={Link}
                    to="/ingresos-cobros"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BsCashCoin className="nav-icon" />
                    <span className="nav-text">Ingresos-Cobros</span>
                  </Nav.Link>

                  {/* Enlace a DatosCompletos (Datos Completos) */}
                  <Nav.Link
                    as={Link}
                    to="/ing-data"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BsDatabase className="nav-icon" />
                    <span className="nav-text">Datos Completos</span>
                  </Nav.Link>

                  {/* Enlace a Contacto */}
                  <Nav.Link
                    as={Link}
                    to="/contacto"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BsEnvelope className="nav-icon" />
                    <span className="nav-text">Contacto</span>
                  </Nav.Link>
                </Nav>

                {/* SECCIÓN 9: RELOJ Y FECHA */}
                {/* ----------------------------------------------------------- */}
                <div className="header-time">
                  <span className="time">{formatTime(currentTime)}</span>
                  <span className="date">{formatDate(currentTime)}</span>
                </div>

                {/* SECCIÓN 10: SECCIÓN DE AUTENTICACIÓN */}
                {/* ----------------------------------------------------------- */}
                <div className="auth-section">
                  {state.isAuthenticated ? (
                    // Usuario autenticado - Muestra menú desplegable
                    <Dropdown className="user-dropdown">
                      <Dropdown.Toggle
                        variant="link"
                        id="dropdown-user"
                        className="user-toggle"
                      >
                        <div className="user-info">
                          <BsPerson className="user-icon" />
                          <span className="user-greeting">
                            {state.user.email.split("@")[0]}
                          </span>
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          as={Link}
                          to="/logout"
                          onClick={() => dispatch({ type: "LOGOUT" })}
                        >
                          <BsBoxArrowRight className="me-2" />
                          Cerrar Sesión
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    // Usuario no autenticado - Muestra opciones de login/registro
                    <div className="auth-links">
                      <Link to="/login" className="login-link">
                        <BsFillPersonPlusFill className="login-icon" />
                        <span>Ingresar</span>
                      </Link>
                      <Link to="/register" className="register-link">
                        Registrarse
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </div>
  );
};

// SECCIÓN 11: VALIDACIÓN DE PROPIEDADES
// -----------------------------------------------------------
HeaderUnificado.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  onCategoryChange: PropTypes.func,
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
  placeholder: PropTypes.string,
};

export default HeaderUnificado;
