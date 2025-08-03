import React from "react";
import { Link } from "react-router-dom"; // Para enrutamiento interno
import FooterGondraWorldDev from './FooterGondraWorldDev'; // Componente hijo
import { FiHelpCircle } from "react-icons/fi"; // Icono de ayuda
import "../assets/scss/_03-Componentes/_Footer.scss"; // Estilos específicos


function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Contenedor de columnas (3 columnas) */}
        <div className="footer-columns">
          {/* Columna izquierda - Logo 1 */}
          <div className="footer-column">
            <a href="#" className="footer-logo-link">
              <img
                className="footer-logo"
                src="/img/02-logos/logoheader1-izquierda.png"
                alt="Logo izquierdo"
              />
            </a>
          </div>
          
          {/* Columna central - Redes sociales */}
          <div className="footer-column">
            <div className="social-links">
              {/* Enlace a Instagram */}
              <a
              href="#"
                target="_blank"
                rel="noopener noreferrer" // Seguridad para enlaces externos
                className="social-link"
              >
                <i className="bi bi-instagram" /> 
              </a>
              
              {/* Enlace a YouTube */}
              <a
               href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <i className="bi bi-youtube" /> 
              </a>
              
              {/* Enlace a Facebook */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <i className="bi bi-facebook" />
              </a>
              
              {/* Enlace a Twitter */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <i className="bi bi-twitter" /> 
              </a>
              
              {/* Enlace interno a Ayuda */}
              <Link to="/ayuda" className="social-link help-link">
                <FiHelpCircle className="me-2" />
                Ayuda
              </Link>
            </div>
          </div>
          
          {/* Columna derecha - Logo 2 */}
          <div className="footer-column">
            <a href="#" className="footer-logo-link">
              <img
                className="footer-logo"
                src="/img/02-logos/logoheader2-derecha.png"
                alt="Logo derecho"
              />
            </a>
          </div>
        </div>
        
        {/* Divisor visual */}
        <div className="footer-divider"></div>
        
        {/* Sección de copyright y sub-footer */}
        <div className="footer-copyright">
          <FooterGondraWorldDev /> {/* Componente de marca y promoción */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;