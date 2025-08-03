// Importación de React (necesario para componentes JSX)
import React from "react";

// Importación del componente de novedades que mostrará el contenido principal
import MainContentNovedades from "./MainContentNovedades";

// Importación de los estilos SCSS específicos para este componente
import "../assets/scss/_03-Componentes/_MainContent.scss";

// --------------------------------------------
// COMPONENTE PRINCIPAL DE CONTENIDO
// --------------------------------------------
function MainContent() {
  return (
    // Contenedor principal del contenido
    // - Usa la clase 'main-content-container' para estilos
    <main className="main-content-container">
      
      {/* Contenedor interno para el contenido */}
      {/* - Usa la clase 'content-wrapper' para estilos de layout */}
      <div className="content-wrapper">
        
        {/* Componente que muestra el contenido específico (novedades) */}
        <MainContentNovedades />
      
      </div>
    </main>
  );
}

// Exporta el componente para poder usarlo en otros archivos
export default MainContent;