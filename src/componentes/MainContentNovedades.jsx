import React, { useState, useEffect } from "react";
import "../assets/scss/_03-Componentes/_MainContentNovedades.scss";

function MainContentNovedades() {
  // --------------------------------------------
  // ESTADO PARA EL CARRUSEL DE IMÁGENES
  // --------------------------------------------
  // currentSlide: índice de la imagen actual que se muestra
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // --------------------------------------------
  // DATOS DEL CARRUSEL
  // --------------------------------------------
  // Array con las rutas de las imágenes del carrusel
  const carouselImages = [
    "/img/03-img-banners1/banner-1.png",
    "/img/03-img-banners1/banner-2.png",
    "/img/03-img-banners1/banner-3.png",
    "/img/03-img-banners1/banner-4.png"
  ];

  // --------------------------------------------
  // EFECTO PARA CAMBIO AUTOMÁTICO DE IMÁGENES
  // --------------------------------------------
  useEffect(() => {
    // Intervalo que cambia la imagen cada 5 segundos
    const interval = setInterval(() => {
      // Calcula el siguiente índice (usa módulo para volver al inicio)
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // --------------------------------------------
  // DATOS DE NOVEDADES (COMENTADOS EN EL CÓDIGO ORIGINAL)
  // --------------------------------------------
  const novedades = [
    {
      id: 1,
      titulo: "Guía para administrar gastos familiares",
      descripcion: "Aprende a registrar y categorizar los gastos de tu hogar...",
      categoria: "Familia",
      fecha: "15/05/2023",
      destacado: true
    },
    // ... más objetos de novedades
  ];

  // --------------------------------------------
  // DATOS DE TUTORIALES POR CATEGORÍA (COMENTADOS)
  // --------------------------------------------
  const tutorialesPorCategoria = {
    familia: [
      {
        titulo: "Presupuesto familiar mensual",
        pasos: [
          "Registra todos los ingresos familiares",
          // ... más pasos
        ]
      }
      // ... más tutoriales
    ],
    // ... más categorías
  };

  // --------------------------------------------
  // RENDERIZADO DEL COMPONENTE
  // --------------------------------------------
  return (
    <div className="main-content-novedades">
      {/* -------------------------------------------- */}
      {/* CARRUSEL DE IMÁGENES PRINCIPAL */}
      {/* -------------------------------------------- */}
      <div className="hero-carousel">
        {/* Mapeo de imágenes del carrusel */}
        {carouselImages.map((image, index) => (
          <div 
            key={index}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        
        {/* Puntos indicadores del carrusel */}
        <div className="carousel-dots">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* -------------------------------------------- */}
      {/* CONTENIDO PRINCIPAL (ACTUALMENTE VACÍO) */}
      {/* -------------------------------------------- */}
      <div className="content-wrapper">
        <section className="novedades-section">
          {/* Sección comentada: Encabezado */}
          {/* <div className="section-header">...</div> */}
          
          <div className="content-row">
            {/* Columna principal (comentada) */}
            <div className="main-column">
              {/* Novedades destacadas (comentadas) */}
              {/* <div className="featured-news">...</div> */}
              
              {/* Todas las novedades (comentadas) */}
              {/* <div className="all-news">...</div> */}
            </div>
            
            {/* Barra lateral (comentada) */}
            <div className="sidebar">
              {/* Tutoriales rápidos (comentados) */}
              {/* <div className="sidebar-content">...</div> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MainContentNovedades;