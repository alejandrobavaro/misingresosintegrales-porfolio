// ==============================================
// SECCIÓN DE IMPORTACIONES
// ==============================================
import React, { useState, useEffect } from "react";
// Importación de iconos de react-icons para la interfaz
import { FiSearch, FiFilter, FiDownload, FiHome, FiUsers, FiCreditCard, FiDollarSign, FiSettings, FiDatabase } from "react-icons/fi";
// Importación de estilos SCSS específicos para este componente
import "../assets/scss/_03-Componentes/_DatosCompletos.scss";

// ==============================================
// COMPONENTE PRINCIPAL DatosCompletos
// ==============================================
const DatosCompletos = () => {
  // --------------------------------------------------
  // SECCIÓN DE ESTADOS DEL COMPONENTE
  // --------------------------------------------------
  
  // Estado para almacenar todos los datos cargados del JSON
  const [data, setData] = useState({
    metadata: {},          // Metadatos del sistema (versión, autor, etc.)
    configuracion: {},     // Configuración general (moneda, formatos)
    propietarios: [],      // Lista de propietarios
    propiedades: [],       // Lista de propiedades/alquileres
    estados_propiedad: [], // Estados posibles de una propiedad
    administra_renta: [],  // Quién administra cada renta
    tipos_alquiler: [],    // Tipos de contratos de alquiler
    estados_cobro: [],     // Estados de los cobros
    metodos_cobro: [],     // Métodos de pago disponibles
    isLoading: true,       // Flag para indicar carga en progreso
    error: null           // Mensaje de error si falla la carga
  });

  // Estado para el filtro activo (qué tipo de datos se muestra)
  const [filtroActivo, setFiltroActivo] = useState('propiedades');
  
  // Estado para el texto de búsqueda/filtrado
  const [busqueda, setBusqueda] = useState('');
  
  // Estado para mostrar/ocultar filtros avanzados
  const [filtrosAvanzados, setFiltrosAvanzados] = useState(false);

  // --------------------------------------------------
  // SECCIÓN DE CONSTANTES Y CONFIGURACIONES
  // --------------------------------------------------
  
  // Objeto que mapea cada rubro con su icono correspondiente
  const iconosRubros = {
    propiedades: <FiHome />,          // Icono de casa para propiedades
    propietarios: <FiUsers />,        // Icono de usuarios para propietarios
    estados_propiedad: <FiHome />,    // Icono de casa para estados
    administra_renta: <FiUsers />,    // Icono de usuarios para administradores
    tipos_alquiler: <FiCreditCard />, // Icono de tarjeta para tipos de alquiler
    estados_cobro: <FiDollarSign />,  // Icono de dólar para estados de cobro
    metodos_cobro: <FiDollarSign />,  // Icono de dólar para métodos de cobro
    configuracion: <FiSettings />,    // Icono de ajustes para configuración
    metadata: <FiDatabase />          // Icono de base de datos para metadatos
  };

  // ==============================================
  // EFECTO PARA CARGAR DATOS AL MONTAR EL COMPONENTE
  // ==============================================
  useEffect(() => {
    // Función asíncrona para cargar los datos del JSON
    const cargarDatos = async () => {
      try {
        // Simulamos un pequeño delay para mostrar el skeleton loading
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Hacemos la petición al archivo JSON en la carpeta public/data
        const response = await fetch('/data/ingresos-porfolio.json');
        
        // Verificamos si la respuesta es correcta
        if (!response.ok) throw new Error('No se pudo cargar el archivo JSON');
        
        // Parseamos la respuesta a JSON
        const jsonData = await response.json();
        
        // Actualizamos el estado con los datos cargados
        setData({
          ...jsonData,
          isLoading: false,  // Indicamos que terminó la carga
          error: null        // Limpiamos cualquier error previo
        });
      } catch (error) {
        // Manejo de errores: mostramos en consola y actualizamos el estado
        console.error("Error cargando datos:", error);
        setData(prev => ({
          ...prev,
          isLoading: false,  // Indicamos que terminó la carga (con error)
          error: "Error al cargar los datos. Verifica la consola para más detalles."
        }));
      }
    };

    // Llamamos a la función para cargar los datos
    cargarDatos();
  }, []); // El array vacío indica que solo se ejecute al montar el componente

  // ==============================================
  // FUNCIÓN PARA FILTRAR DATOS SEGÚN BÚSQUEDA
  // ==============================================
  const datosFiltrados = () => {
    // Si no hay datos para el rubro activo, retornamos array vacío
    if (!data[filtroActivo]) return [];
    
    // Filtramos los items del rubro activo según el texto de búsqueda
    return data[filtroActivo].filter(item => {
      // Si no hay texto de búsqueda, mostramos todos los items
      if (!busqueda) return true;
      
      // Buscamos en todos los valores del objeto item
      return Object.values(item).some(val => 
        String(val).toLowerCase().includes(busqueda.toLowerCase())
      );
    });
  };

  // ==============================================
  // FUNCIÓN PARA FORMATEAR VALORES PARA VISUALIZACIÓN
  // ==============================================
  const formatearValor = (key, value) => {
    // Caso 1: Valor nulo o undefined
    if (value === null || value === undefined) {
      return <span className="valor-nulo">N/A</span>;
    }
    
    // Caso 2: Valor es un objeto (no array)
    if (typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div className="objeto-anidado">
          {/* Mapeamos cada propiedad del objeto anidado */}
          {Object.entries(value).map(([subKey, subVal]) => (
            <div key={subKey}>
              <strong>{subKey}:</strong> {formatearValor(subKey, subVal)}
            </div>
          ))}
        </div>
      );
    }
    
    // Caso 3: Valor es un array
    if (Array.isArray(value)) {
      return value.length > 0 
        ? <ul className="lista-valores">
            {/* Mapeamos cada elemento del array */}
            {value.map((v, i) => <li key={i}>{formatearValor(key, v)}</li>)}
          </ul>
        : <span className="valor-vacio">Vacío</span>;
    }
    
    // Caso 4: Valor es una fecha (identificado por la clave)
    if (key.toLowerCase().includes('fecha')) {
      return <span className="valor-fecha">{value}</span>;
    }
    
    // Caso 5: Valor es un monto (identificado por la clave)
    if (key.toLowerCase().includes('monto')) {
      return <span className="valor-monto">
        {data.configuracion.simbolo_moneda || '$'} {Number(value).toLocaleString('es-AR')}
      </span>;
    }
    
    // Caso 6: Valor es una URL o imagen (identificado por la clave)
    if (key.toLowerCase().includes('url') || key.toLowerCase().includes('imagen')) {
      return value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="enlace-externo">
          Ver {key.includes('imagen') ? 'imagen' : 'documento'}
        </a>
      ) : <span className="valor-vacio">No disponible</span>;
    }
    
    // Caso 7: Valor es booleano
    if (typeof value === 'boolean') {
      return (
        <span className={`valor-booleano ${value ? 'verdadero' : 'falso'}`}>
          {value ? 'Sí' : 'No'}
        </span>
      );
    }
    
    // Caso por defecto: mostramos el valor tal cual
    return value;
  };

  // ==============================================
  // FUNCIÓN PARA EXPORTAR DATOS A JSON
  // ==============================================
  const exportarDatos = () => {
    // Obtenemos los datos filtrados actuales
    const datosExportar = datosFiltrados();
    
    // Creamos un blob (archivo virtual) con los datos en formato JSON
    const blob = new Blob([JSON.stringify(datosExportar, null, 2)], { type: 'application/json' });
    
    // Generamos una URL para el blob
    const url = URL.createObjectURL(blob);
    
    // Creamos un enlace temporal para descargar el archivo
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filtroActivo}_export_${new Date().toISOString().slice(0,10)}.json`;
    
    // Simulamos click en el enlace para iniciar la descarga
    link.click();
    
    // Liberamos la URL creada
    URL.revokeObjectURL(url);
  };

  // ==============================================
  // RENDERIZADO DEL COMPONENTE
  // ==============================================

  // Estado de carga: mostramos skeleton screens
  if (data.isLoading) {
    return (
      <div className="ing-data-container">
        <div className="skeleton-loading">
          {/* Skeleton para el header */}
          <div className="skeleton-header"></div>
          
          {/* Skeleton para los filtros */}
          <div className="skeleton-filters"></div>
          
          {/* Skeleton para las tarjetas de datos (6 placeholders) */}
          <div className="skeleton-cards">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Estado de error: mostramos mensaje amigable
  if (data.error) {
    return (
      <div className="ing-data-container">
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h3>Error al cargar los datos</h3>
          <p>{data.error}</p>
          <button onClick={() => window.location.reload()} className="btn-reintentar">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Renderizado normal del componente con datos cargados
  return (
    <div className="ing-data-container">
      {/* ==============================================
          SECCIÓN DEL HEADER 
          Contiene título, metadatos y controles de filtrado
      ============================================== */}
      <header className="header">
        {/* Bloque superior con título y metadatos */}
        <div className="header-content">
          <div className="title-section">
            <FiDatabase className="title-icon" />
            <h1>Visualización Completa de Datos</h1>
          </div>
          <div className="metadata-info">
            <span>Sistema v{data.metadata.version}</span>
            <span>Última actualización: {data.metadata.last_updated}</span>
          </div>
        </div>
        
        {/* Controles de filtrado y búsqueda */}
        <div className="filtros-superiores">
          {/* Barra de búsqueda con icono */}
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder={`Buscar en ${filtroActivo.replace(/_/g, ' ')}...`}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="barra-busqueda"
            />
          </div>
          
          {/* Contenedor de filtros y botones */}
          <div className="filters-container">
            {/* Selector del rubro a mostrar */}
            <select 
              value={filtroActivo}
              onChange={(e) => {
                setFiltroActivo(e.target.value);
                setBusqueda(''); // Limpiamos la búsqueda al cambiar de rubro
              }}
              className="selector-rubro"
            >
              {Object.keys(iconosRubros).map(rubro => (
                <option key={rubro} value={rubro}>
                  {rubro.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
            
            {/* Botón para mostrar filtros avanzados */}
            <button 
              onClick={() => setFiltrosAvanzados(!filtrosAvanzados)}
              className={`btn-filtros ${filtrosAvanzados ? 'active' : ''}`}
            >
              <FiFilter /> Filtros
            </button>
            
            {/* Botón para exportar datos */}
            <button 
              onClick={exportarDatos}
              className="btn-exportar"
              disabled={datosFiltrados().length === 0}
            >
              <FiDownload /> Exportar
            </button>
          </div>
        </div>
        
        {/* Sección de filtros avanzados (actualmente es un placeholder) */}
        {filtrosAvanzados && (
          <div className="filtros-avanzados">
            <p>Filtros avanzados para {filtroActivo.replace(/_/g, ' ')}</p>
          </div>
        )}
      </header>

      {/* ==============================================
          SECCIÓN DE INFORMACIÓN DEL RUBRO ACTUAL
          Muestra qué datos se están visualizando y cantidad de resultados
      ============================================== */}
      <div className="info-rubro">
        <div className="rubro-title">
          {/* Icono y nombre del rubro actual */}
          {iconosRubros[filtroActivo]}
          <h2>{filtroActivo.replace(/_/g, ' ').toUpperCase()}</h2>
        </div>
        {/* Contador de resultados */}
        <p className="resultados-count">
          Mostrando <strong>{datosFiltrados().length}</strong> de <strong>{data[filtroActivo]?.length || 0}</strong> registros
        </p>
      </div>

      {/* ==============================================
          SECCIÓN PRINCIPAL DE DATOS
          Muestra las tarjetas con la información o mensaje de no resultados
      ============================================== */}
      <div className="contenedor-datos">
        {/* Verificamos si hay resultados para mostrar */}
        {datosFiltrados().length > 0 ? (
          <div className="lista-datos">
            {/* Mapeamos cada item del rubro activo filtrado */}
            {datosFiltrados().map((item, index) => (
              <div key={index} className="tarjeta-dato">
                {/* Encabezado de la tarjeta con nombre y color si existe */}
                <div className="tarjeta-header">
                  <h3>
                    {item.nombre || item.id || `Item ${index + 1}`}
                  </h3>
                  {item.color && (
                    <span 
                      className="color-indicador" 
                      style={{ backgroundColor: item.color }}
                      title="Color asociado"
                    />
                  )}
                </div>
                
                {/* Detalles del item - todas sus propiedades */}
                <div className="detalles-dato">
                  {Object.entries(item).map(([key, value]) => (
                    // Excluimos propiedades que ya mostramos en el header
                    key !== 'id' && key !== 'nombre' && key !== 'color' && (
                      <div key={key} className="campo-dato">
                        <strong className="campo-nombre">{key}:</strong> 
                        <div className="campo-valor">{formatearValor(key, value)}</div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Mensaje cuando no hay resultados que coincidan con la búsqueda */
          <div className="sin-resultados">
            <FiSearch className="no-results-icon" />
            <h3>No se encontraron resultados</h3>
            <p>No hay coincidencias para "{busqueda}" en {filtroActivo.replace(/_/g, ' ')}</p>
            <button 
              onClick={() => setBusqueda('')}
              className="btn-limpiar"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>

      {/* ==============================================
          FOOTER CON INFORMACIÓN DEL SISTEMA
          Muestra versión y última actualización
      ============================================== */}
      <footer className="footer-datos">
        <div className="footer-content">
          <div className="system-info">
            <strong>{data.metadata.descripcion || 'Gestión de Ingresos'}</strong>
            <span>v{data.metadata.version || '1.0'}</span>
          </div>
          <div className="update-info">
            <span>Moneda: {data.configuracion.moneda || 'ARS'}</span>
            <span>Última actualización: {data.metadata.last_updated || 'Desconocida'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DatosCompletos;