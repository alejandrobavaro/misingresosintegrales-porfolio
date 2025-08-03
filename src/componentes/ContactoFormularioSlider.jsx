import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/scss/_03-Componentes/_ContactoFormularioSlider.scss";

// Componente principal que combina un formulario de contacto con un slider
const ContactoFormularioSlider = () => {
  // Estado para almacenar los productos (aunque no se usan actualmente en el render)
  const [productos, setProductos] = useState([]);

  // Efecto para cargar productos desde un JSON (actualmente no se usan en la UI)
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("/productos.json");
        const productos = await response.json();
        setProductos(productos);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  // Configuración para el slider (aunque el slider no se está usando actualmente)
  const settings = {
    dots: false, // Puntos de navegación ocultos
    infinite: true, // Desplazamiento infinito
    speed: 500, // Velocidad de transición
    slidesToShow: 1, // Muestra 1 slide a la vez
    slidesToScroll: 1, // Desplaza 1 slide por vez
    autoplay: true, // Autoplay activado
    autoplaySpeed: 3000, // Velocidad de autoplay (3 segundos)
    arrows: true, // Flechas de navegación visibles
  };

  return (
    // Contenedor principal del componente
    <div className="gridPadreContacto2">
      {/* Contenedor que agrupa el formulario y el slider */}
      <div className="contact-form-slider-container">
        {/* Columna del formulario */}
        <div className="form-column box-shadow">
          {/* Formulario de contacto que se envía a Formspree */}
          <form
            className="contact-form"
            action="https://formspree.io/f/xbjnlgzz"
            target="_blank"
            method="post"
          >
            {/* Grupo para el campo Nombre */}
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                placeholder="Ingresa tu nombre"
                required
              />
            </div>
            
            {/* Grupo para el campo Teléfono */}
            <div className="form-group">
              <label htmlFor="telefono">Teléfono:</label>
              <input
                type="tel"
                className="form-control"
                id="telefono"
                name="telefono"
                placeholder="Ingresa tu teléfono"
                required
              />
            </div>
            
            {/* Grupo para el campo Email */}
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Ingresa tu correo electrónico"
                required
              />
            </div>
            
            {/* Grupo para el campo Asunto */}
            <div className="form-group">
              <label htmlFor="asunto">Asunto del Mensaje:</label>
              <input
                type="text"
                className="form-control"
                id="asunto"
                name="asunto"
                placeholder="Ingresa el asunto del mensaje"
                required
              />
            </div>
            
            {/* Grupo para el campo Mensaje (textarea) */}
            <div className="form-group">
              <label htmlFor="mensaje">Mensaje:</label>
              <textarea
                className="form-control"
                id="mensaje"
                name="mensaje"
                rows={4}
                placeholder="Escribe tu mensaje aquí"
                required
              />
            </div>
            
            {/* Botón de envío del formulario */}
            <div className="text-end">
              <button type="submit" className="btn-submit">
                ENVIAR
              </button>
            </div>
          </form>
        </div>
        
        {/* Columna del slider (actualmente muestra solo un título y un GIF) */}
        <div className="slider-column box-shadow">
          <h2 className="slider-title">
            <i className="bi bi-person-arms-up" /> ADMINISTRA TU DINERO{""}
            <i className="bi bi-person-arms-up" />
          </h2>
          <img className="gifTamaño" src="/img/05-gif/dinero-animado.gif" alt="" />
        </div>
      </div>
    </div>
  );
};

export default ContactoFormularioSlider;