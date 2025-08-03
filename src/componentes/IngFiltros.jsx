// ==============================================
// IMPORTACIONES
// ==============================================
import React from "react";

// ==============================================
// COMPONENTE PRINCIPAL
// ==============================================
const IngFiltros = ({ 
  filtros,            // Recibe: Estado actual de los filtros
  onChangeFiltros,    // Recibe: Función para actualizar filtros
  propietarios,       // Recibe: Listado de propietarios
  estadosPropiedad    // Recibe: Listado de estados de propiedad
}) => {
  // ==============================================
  // RENDERIZADO
  // ==============================================
  return (
    <div className="filtros-container">
      {/* Grupo de filtro por texto */}
      <div className="filtro-group">
        <label htmlFor="filtro-texto">Buscar:</label>
        <input
          id="filtro-texto"
          type="text"
          value={filtros.texto}
          onChange={(e) => onChangeFiltros({ ...filtros, texto: e.target.value })}
          placeholder="Nombre o descripción"
        />
      </div>
      
      {/* Grupo de filtro por propietario */}
      <div className="filtro-group">
        <label htmlFor="filtro-propietario">Propietario:</label>
        <select
          id="filtro-propietario"
          value={filtros.propietario || ''}
          onChange={(e) => onChangeFiltros({ 
            ...filtros, 
            propietario: e.target.value ? parseInt(e.target.value) : null 
          })}
        >
          <option value="">Todos</option>
          {propietarios.map(prop => (
            <option key={prop.id} value={prop.id}>{prop.nombre}</option>
          ))}
        </select>
      </div>
      
      {/* Grupo de filtro por estado de propiedad */}
      <div className="filtro-group">
        <label htmlFor="filtro-estado">Estado:</label>
        <select
          id="filtro-estado"
          value={filtros.estado}
          onChange={(e) => onChangeFiltros({ 
            ...filtros, 
            estado: parseInt(e.target.value) 
          })}
        >
          {estadosPropiedad.map(estado => (
            <option key={estado.id} value={estado.id}>{estado.nombre}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default IngFiltros;