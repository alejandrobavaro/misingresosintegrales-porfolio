import React from "react";
import "../assets/scss/_03-Componentes/_ContactoLogoRedes.scss";

/**
 * COMPONENTE: ContactoLogoRedes
 * 
 * Propósito: Muestra logos y enlaces a redes sociales con:
 * - Logo principal de la aplicación
 * - Logos secundarios decorativos
 * - Enlaces a redes sociales y medios de contacto
 * - Diseño responsive adaptativo
 */
const ContactoLogoRedes = () => {
  return (
    <div>
      {/* Contenedor principal del grid */}
      <div className="gridPadreContacto1">
        {/* Contenedor de logos y contactos */}
        <div className="contact-logo-rede-container">
          {/* Columna de logos */}
          <div className="logo-column">
            {/* Logo principal */}
            <a href="#">
              <img
                alt="icono"
                className="logo-img logo-main"
                src="/img/02-logos/logomisgastos1.png"
              />
            </a>

            {/* Contenedor de logos secundarios */}
            <div className="logo-secondary-container">
              {/* Logo secundario 1 */}
              <a href="#">
                <img
                  alt="icono"
                  className="logo-img logo-secondary"
                  src="/img/05-img-costados-larga/3.png"
                />
              </a>

              {/* Logo secundario 2 */}
              <a href="#">
                <img
                  alt="icono"
                  className="logo-img logo-secondary"
                  src="/img/05-img-costados-larga/4.png"
                />
              </a>
            </div>
          </div>

          {/* Columna de iconos de contacto */}
          <div className="contact-icons">
            {/* Enlace a Facebook */}
            <div className="contact-item">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer" // Seguridad para enlaces externos
              >
                <i className="bi bi-facebook" /> Facebook
              </a>
            </div>

            {/* Enlace a Instagram */}
            <div className="contact-item">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-instagram" /> Instagram
              </a>
            </div>

            {/* Enlace a YouTube */}
            <div className="contact-item">
              <a
                  href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-youtube" /> YouTube
              </a>
            </div>


            {/* Enlace a correo electrónico */}
            <div className="contact-item">
              <a
                href="mailto:bavaroalejandro@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-person-arms-up" /> Escríbenos un mail <i className="bi bi-envelope" />
              </a>
            </div>

            {/* Enlace a PayPal */}
            {/* <div className="contact-item">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-paypal" /> COLABORÁ CON NOSOTROS
              </a>
            </div> */}

     
          </div>
        </div>
      </div>
      
      {/* Línea divisoria transparente */}
      <hr className="transparent-hr" />
    </div>
  );
};

export default ContactoLogoRedes;