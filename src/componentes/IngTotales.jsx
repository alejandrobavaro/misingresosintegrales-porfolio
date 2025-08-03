// ==============================================
// IMPORTACIONES
// ==============================================
import React from "react";
import { useNavigate } from "react-router-dom";
// Librerías para gráficos
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Estilos específicos del componente
import "../assets/scss/_03-Componentes/_IngTotales.scss";

// ==============================================
// COMPONENTE PRINCIPAL
// ==============================================
const IngTotales = ({ 
  propiedades,
  configuracion,
  estados_cobro,
  metodos_cobro,
  propietarios,
  estados_propiedad
}) => {
  const navigate = useNavigate();

  // ==============================================
  // 1. CÁLCULO DE DATOS PARA GRÁFICOS
  // ==============================================
  // 1.1. Calcula totales generales
  const calcularTotales = () => {
    const { mes_actual } = configuracion || {};
    
    return propiedades.reduce((acum, prop) => {
      const cobroActual = prop.cobros[mes_actual] || {};
      
      return {
        totalActual: acum.totalActual + (cobroActual.monto_cobrado || 0),
        totalContrato: acum.totalContrato + (prop.monto_contrato || 0),
        totalPendiente: acum.totalPendiente + Math.max(0, prop.monto_contrato - (cobroActual.monto_cobrado || 0)),
        // Nuevos acumuladores para gráficos
        totalPropietarios: {
          ...acum.totalPropietarios,
          [prop.propietario_id]: (acum.totalPropietarios[prop.propietario_id] || 0) + (prop.monto_contrato || 0)
        },
        totalEstados: {
          ...acum.totalEstados,
          [prop.estado_propiedad_id]: (acum.totalEstados[prop.estado_propiedad_id] || 0) + (prop.monto_contrato || 0)
        }
      };
    }, { 
      totalActual: 0, 
      totalContrato: 0, 
      totalPendiente: 0,
      totalPropietarios: {},
      totalEstados: {}
    });
  };

  // 1.2. Obtiene los datos calculados
  const { 
    totalActual, 
    totalContrato, 
    totalPendiente,
    totalPropietarios,
    totalEstados
  } = calcularTotales();

  // 1.3. Prepara datos para gráficos
  const datosGraficoTorta = [
    { name: 'Cobrado', value: totalActual, color: '#4CAF50' },
    { name: 'Pendiente', value: totalPendiente, color: '#F44336' }
  ];

  // Datos para gráfico de propietarios
  const datosPropietarios = Object.entries(totalPropietarios).map(([id, monto]) => {
    const propietario = propietarios.find(p => p.id === parseInt(id));
    return {
      name: propietario?.nombre || `Propietario ${id}`,
      monto,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Color aleatorio
    };
  }).sort((a, b) => b.monto - a.monto);

  // Datos para gráfico de estados
  const datosEstados = Object.entries(totalEstados).map(([id, monto]) => {
    const estado = estados_propiedad.find(e => e.id === parseInt(id));
    return {
      name: estado?.nombre || `Estado ${id}`,
      monto,
      color: estado?.color || '#607D8B'
    };
  });

  // ==============================================
  // 2. DATOS PARA LISTA DE DEPARTAMENTOS
  // ==============================================
  const getEstadoCobro = (cobro) => {
    if (!cobro) return 'No cobrado';
    const estado = estados_cobro.find(e => e.id === cobro.estado_cobro_id);
    return estado?.nombre || 'Desconocido';
  };

  const getMetodoCobro = (cobro) => {
    if (!cobro) return '-';
    const metodo = metodos_cobro.find(m => m.id === cobro.metodo_cobro_id);
    return metodo?.nombre || '-';
  };

  const getPropietario = (propId) => {
    const propietario = propietarios.find(p => p.id === propId);
    return propietario?.nombre || `Propietario ${propId}`;
  };

  const getEstadoPropiedad = (estadoId) => {
    const estado = estados_propiedad.find(e => e.id === estadoId);
    return estado?.nombre || `Estado ${estadoId}`;
  };

  // ==============================================
  // 3. RENDERIZADO MEJORADO
  // ==============================================
  return (
    <div className="ing-totales-container">
      {/* Botón para volver */}
      <button onClick={() => navigate('/ingresos-cobros')} className="btn-volver">
        ← Volver a Ingresos
      </button>

      {/* Sección de tarjetas con totales */}
      <div className="totales-cards">
        <div className="total-card">
          <span>Total Contrato:</span>
          <strong>{configuracion.simbolo_moneda} {totalContrato.toLocaleString('es-AR')}</strong>
        </div>
        <div className="total-card">
          <span>Total Cobrado:</span>
          <strong>{configuracion.simbolo_moneda} {totalActual.toLocaleString('es-AR')}</strong>
        </div>
        <div className="total-card">
          <span>Total Pendiente:</span>
          <strong className={totalPendiente > 0 ? 'pendiente' : ''}>
            {configuracion.simbolo_moneda} {totalPendiente.toLocaleString('es-AR')}
          </strong>
        </div>
      </div>

      {/* Sección de gráficos */}
      <div className="graficos-section">
        {/* Gráfico de torta - Cobrado vs Pendiente */}
        <div className="grafico-container">
          <h3>Distribución de Cobros</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosGraficoTorta}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {datosGraficoTorta.map((entry, index) => (
                  <Pie key={`pie-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${configuracion.simbolo_moneda} ${value.toLocaleString('es-AR')}`, '']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de barras - Por propietario */}
        <div className="grafico-container">
          <h3>Ingresos por Propietario</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={datosPropietarios}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis 
                tickFormatter={(value) => `${configuracion.simbolo_moneda} ${(value/1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => [`${configuracion.simbolo_moneda} ${value.toLocaleString('es-AR')}`, 'Monto']}
              />
              <Legend />
              <Bar dataKey="monto" name="Monto">
                {datosPropietarios.map((entry, index) => (
                  <Bar key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de barras - Por estado de propiedad */}
        <div className="grafico-container">
          <h3>Ingresos por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={datosEstados}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `${configuracion.simbolo_moneda} ${(value/1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => [`${configuracion.simbolo_moneda} ${value.toLocaleString('es-AR')}`, 'Monto']}
              />
              <Legend />
              <Bar dataKey="monto" name="Monto">
                {datosEstados.map((entry, index) => (
                  <Bar key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sección de detalle por departamento */}
      <div className="detalle-departamentos">
        <h3>Resumen de Ingresos por Departamento</h3>
        <div className="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Departamento</th>
                <th>Propietario</th>
                <th>Estado</th>
                <th>Monto Contrato</th>
                <th>Monto Cobrado</th>
                <th>Pendiente</th>
                <th>Estado Cobro</th>
                <th>Método Cobro</th>
              </tr>
            </thead>
            <tbody>
              {propiedades.map((prop) => {
                const cobro = prop.cobros[configuracion.mes_actual] || null;
                const montoCobrado = cobro?.monto_cobrado || 0;
                const pendiente = Math.max(0, prop.monto_contrato - montoCobrado);
                
                return (
                  <tr key={prop.id}>
                    <td>{prop.nombre}</td>
                    <td>{getPropietario(prop.propietario_id)}</td>
                    <td>{getEstadoPropiedad(prop.estado_propiedad_id)}</td>
                    <td>{configuracion.simbolo_moneda} {prop.monto_contrato?.toLocaleString('es-AR') || '0'}</td>
                    <td>{configuracion.simbolo_moneda} {montoCobrado.toLocaleString('es-AR')}</td>
                    <td className={pendiente > 0 ? 'pendiente' : ''}>
                      {configuracion.simbolo_moneda} {pendiente.toLocaleString('es-AR')}
                    </td>
                    <td>{getEstadoCobro(cobro)}</td>
                    <td>{getMetodoCobro(cobro)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IngTotales;