// ==============================================
// IMPORTACIONES
// ==============================================
import React from "react";

// ==============================================
// COMPONENTE PRINCIPAL
// ==============================================
const IngDetallePropiedad = ({ 
  propiedad,        // Recibe: Datos completos de la propiedad
  onClose,         // Recibe: Función para cerrar el modal
  metodosCobro,    // Recibe: Listado de métodos de cobro
  estadosCobro,    // Recibe: Listado de estados de cobro
  configuracion,   // Recibe: Configuración general
  onChangeCobro    // Recibe: Función para actualizar datos de cobro
}) => {
  // ==============================================
  // 1. PREPARACIÓN DE DATOS
  // ==============================================
  // Obtiene el cobro actual del mes configurado
  const cobroActual = propiedad.cobros[configuracion.mes_actual] || {};
  // Encuentra el estado correspondiente al cobro
  const estadoCobro = estadosCobro.find(e => e.id === cobroActual.estado_cobro_id);
  
  // ==============================================
  // 2. RENDERIZADO
  // ==============================================
  return (
    <div className="modal-detalle-overlay">
      <div className="modal-detalle">
        {/* Botón para cerrar el modal */}
        <button className="btn-cerrar" onClick={onClose}>×</button>
        
        {/* Título principal */}
        <h2>{propiedad.nombre}</h2>
        <p className="descripcion">{propiedad.descripcion}</p>
        
        {/* Contenido en formato grid */}
        <div className="detalle-grid">
          {/* Columna 1: Imagen principal */}
          <div className="imagen-principal">
            <img src={propiedad.imagen_principal} alt={propiedad.nombre} />
          </div>
          
          {/* Columna 2: Información del alquiler */}
          <div className="info-alquiler">
            <h3>Datos del Alquiler</h3>
            {propiedad.datos_alquiler ? (
              <ul>
                <li><strong>Inquilino:</strong> {propiedad.datos_alquiler.alquilado_a}</li>
                <li><strong>Contrato:</strong> {propiedad.datos_alquiler.tipo_alquiler}</li>
                <li><strong>Inicio:</strong> {propiedad.datos_alquiler.fecha_inicio_contrato}</li>
                <li><strong>Vencimiento:</strong> {propiedad.datos_alquiler.fecha_fin_contrato}</li>
                <li><strong>Monto:</strong> {configuracion.simbolo_moneda} {propiedad.monto_contrato}</li>
              </ul>
            ) : (
              <p>No hay datos de alquiler registrados</p>
            )}
          </div>
          
          {/* Columna 3: Formulario de cobro */}
          <div className="seccion-cobro">
            <h3>Registrar Cobro</h3>
            <div className="form-cobro">
              {/* Grupo 1: Método de cobro */}
              <div className="form-group">
                <label>Método de Cobro:</label>
                <select
                  value={cobroActual.metodo_cobro_id || ''}
                  onChange={(e) => onChangeCobro(propiedad.id, 'metodo_cobro_id', parseInt(e.target.value))}
                  disabled={!propiedad.datos_alquiler}
                >
                  <option value="">Seleccionar</option>
                  {metodosCobro.map(metodo => (
                    <option key={metodo.id} value={metodo.id}>{metodo.nombre}</option>
                  ))}
                </select>
              </div>
              
              {/* Grupo 2: Monto cobrado */}
              <div className="form-group">
                <label>Monto Cobrado:</label>
                <input
                  type="number"
                  value={cobroActual.monto_cobrado || 0}
                  onChange={(e) => onChangeCobro(propiedad.id, 'monto_cobrado', parseFloat(e.target.value))}
                  disabled={!propiedad.datos_alquiler}
                  min="0"
                  max={propiedad.monto_contrato}
                />
              </div>
              
              {/* Grupo 3: Fecha de cobro */}
              <div className="form-group">
                <label>Fecha:</label>
                <input
                  type="text"
                  value={cobroActual.fecha_cobro || ''}
                  onChange={(e) => onChangeCobro(propiedad.id, 'fecha_cobro', e.target.value)}
                  placeholder={configuracion.formato_fecha}
                  disabled={!propiedad.datos_alquiler}
                />
              </div>
              
              {/* Grupo 4: Notas adicionales */}
              <div className="form-group">
                <label>Notas:</label>
                <textarea
                  value={cobroActual.notas || ''}
                  onChange={(e) => onChangeCobro(propiedad.id, 'notas', e.target.value)}
                  disabled={!propiedad.datos_alquiler}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngDetallePropiedad;