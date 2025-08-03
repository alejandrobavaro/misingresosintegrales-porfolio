// Importación de React (necesario para componentes JSX)
import React from 'react';

// Importación de los estilos SCSS específicos para este componente
import '../assets/scss/_03-Componentes/_MainWhatsappIcon.scss';

// --------------------------------------------
// DEFINICIÓN DEL COMPONENTE FUNCIONAL
// --------------------------------------------
function MainWhatsappIcon() {
  // El componente retorna un elemento JSX
  return (
    // Contenedor principal del ícono de WhatsApp
    // - Usa la clase 'telefonoWhatsappMainContent' para estilos
    <div className='telefonoWhatsappMainContent'>
      
      {/* Enlace que redirige a WhatsApp con parámetros predefinidos */}
      {/* 
        href: URL con protocolo whatsapp:// incluyendo:
          - Número de teléfono (+542235455451)
          - Mensaje predefinido ("Hola!, en que puedo ayudarte?")
        rel: Define la relación del enlace (para SEO y seguridad)
        target="_blank": Abre el enlace en una nueva pestaña
      */}
      <a
        href="https://api.whatsapp.com/send?phone=+542235455451&text=Hola!,%20en%20que%20puedo%20ayudarte?"
        rel="link whatsapp"
        target="_blank"
      >
        
        {/* Imagen del logo de WhatsApp */}
        {/* 
          alt: Texto alternativo para accesibilidad
          className: Clase para aplicar estilos SCSS
          src: Ruta de la imagen del logo (ubicada en /img/02-logos/)
        */}
        <img
          alt="WhatsApp Icon"
          className="logoWhatsappMainContent"
          src="/img/02-logos/logowhattsapp1.png"
        />
      </a>
    </div>
  );
}

// Exporta el componente para poder usarlo en otros archivos
export default MainWhatsappIcon;