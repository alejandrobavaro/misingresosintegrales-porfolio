// src/componentes/FooterGondraWorldDev.jsx
import React from "react";
import "../assets/scss/_03-Componentes/_FooterGondraWorldDev.scss";

function FooterGondraWorldDev() {
  return (
    <div className="trademarkGondraFooter">
 
  
      {/* Contenedor principal del footer */}
      <div className="textoFooterAutor">
        <div>
          {/* Enlace al sitio de Gondra World Dev */}
          <a
            href="https://alejandrobavaro.github.io/gondraworld-dev/"
            target="_blank"
            rel="noopener noreferrer" // Seguridad para enlaces externos
          >
      
      
            
            {/* Texto final del footer */}
            <div className="textoFooterGondraWorld">
              <i className="bi bi-brilliance" />- Gondra World Dev -
              <i className="bi bi-brilliance" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default FooterGondraWorldDev;