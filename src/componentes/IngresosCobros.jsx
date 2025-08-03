// ==============================================
// IMPORTACIONES
// ==============================================
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import "../assets/scss/_03-Componentes/_IngresosCobros.scss";

// ==============================================
// COMPONENTE PRINCIPAL
// ==============================================
const IngresosCobros = () => {
  // ==============================================
  // 1. HOOKS DE NAVEGACIÓN Y ESTADO
  // ==============================================
  const navigate = useNavigate();

  // ==============================================
  // 2. ESTADOS DEL COMPONENTE
  // ==============================================
  const [data, setData] = useState({
    propiedades: [],
    configuracion: {},
    estados_cobro: [],
    metodos_cobro: [],
    propietarios: [],
    estados_propiedad: [],
    administra_renta: [],
    tipos_alquiler: [],
    isLoading: true,
  });

  const [filtroEstado, setFiltroEstado] = useState(0);

  // ==============================================
  // 3. EFECTOS SECUNDARIOS (useEffect)
  // ==============================================
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await fetch("/data/ingresos-porfolio.json");
        if (!response.ok) throw new Error("Error al cargar datos");
        const jsonData = await response.json();
        setData({ ...jsonData, isLoading: false });
      } catch (error) {
        console.error("Error:", error);
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message,
        }));
      }
    };
    cargarDatos();
  }, []);

  // ==============================================
  // 4. FUNCIONES PRINCIPALES
  // ==============================================
  const propiedadesFiltradas = data.propiedades.filter((prop) => {
    return filtroEstado === 0 || prop.estado_propiedad_id === filtroEstado;
  });

  const handleCambioCobro = (propiedadId, campo, valor) => {
    setData((prev) => ({
      ...prev,
      propiedades: prev.propiedades.map((prop) => {
        if (prop.id === propiedadId) {
          const cobroActual = prop.cobros[prev.configuracion.mes_actual] || {};
          let nuevoEstado = cobroActual.estado_cobro_id;

          if (campo === "monto_cobrado") {
            nuevoEstado = valor > 0 ? 1 : 2;
          }

          return {
            ...prop,
            cobros: {
              ...prop.cobros,
              [prev.configuracion.mes_actual]: {
                ...cobroActual,
                [campo]: valor,
                estado_cobro_id: nuevoEstado,
              },
            },
          };
        }
        return prop;
      }),
    }));
  };

  const calcularTotales = () => {
    const { mes_actual, mes_anterior } = data.configuracion || {};

    return propiedadesFiltradas.reduce(
      (acum, prop) => {
        const cobroActual = prop.cobros[mes_actual] || {};
        const cobroAnterior = prop.cobros[mes_anterior] || {};

        return {
          totalActual: acum.totalActual + (cobroActual.monto_cobrado || 0),
          totalAnterior:
            acum.totalAnterior + (cobroAnterior.monto_cobrado || 0),
          totalContrato: acum.totalContrato + (prop.monto_contrato || 0),
          totalPendiente:
            acum.totalPendiente +
            Math.max(0, prop.monto_contrato - (cobroActual.monto_cobrado || 0)),
        };
      },
      {
        totalActual: 0,
        totalAnterior: 0,
        totalContrato: 0,
        totalPendiente: 0,
      }
    );
  };

  // ==============================================
  // 5. FUNCIONES AUXILIARES
  // ==============================================
  const calcularAumentosPendientes = (propiedad) => {
    if (!propiedad.datos_alquiler?.aumentos_programados) return [];
    const hoy = new Date();
    return propiedad.datos_alquiler.aumentos_programados.filter((aumento) => {
      const fechaAumento = new Date(aumento.fecha_aplicacion);
      return fechaAumento <= hoy && !aumento.aplicado;
    });
  };

  const calcularDiasRestantesContrato = (propiedad) => {
    if (!propiedad.datos_alquiler?.fecha_fin_contrato) return null;
    const finContrato = new Date(propiedad.datos_alquiler.fecha_fin_contrato);
    const hoy = new Date();
    const diffTime = finContrato - hoy;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const aplicarAumento = (propiedadId, aumentoIndex) => {
    setData((prev) => {
      const nuevasPropiedades = [...prev.propiedades];
      const propiedadIndex = nuevasPropiedades.findIndex(
        (p) => p.id === propiedadId
      );

      if (propiedadIndex !== -1) {
        const propiedad = { ...nuevasPropiedades[propiedadIndex] };
        const aumento = {
          ...propiedad.datos_alquiler.aumentos_programados[aumentoIndex],
        };

        const montoAnterior = propiedad.monto_contrato;
        const nuevoMonto = Math.round(
          montoAnterior * (1 + aumento.porcentaje / 100)
        );

        aumento.aplicado = true;
        aumento.monto_anterior = montoAnterior;
        aumento.nuevo_monto = nuevoMonto;

        propiedad.datos_alquiler.aumentos_programados[aumentoIndex] = aumento;
        propiedad.monto_contrato = nuevoMonto;

        nuevasPropiedades[propiedadIndex] = propiedad;
      }

      return { ...prev, propiedades: nuevasPropiedades };
    });
  };

  // ==============================================
  // 6. FUNCIÓN DE EXPORTACIÓN MEJORADA
  // ==============================================
  const exportToExcel = () => {
    // Preparar datos para Excel con todas las columnas necesarias
    const datos = propiedadesFiltradas.map((prop) => {
      const cobro = prop.cobros[data.configuracion.mes_actual] || {};
      const cobroAnterior = prop.cobros[data.configuracion.mes_anterior] || {};
      const metodo =
        data.metodos_cobro.find((m) => m.id === cobro.metodo_cobro_id)
          ?.nombre || "-";
      const propietario =
        data.propietarios.find((p) => p.id === prop.propietario_id)?.nombre ||
        "-";
      const estadoProp =
        data.estados_propiedad.find((e) => e.id === prop.estado_propiedad_id)
          ?.nombre || "-";
      const administra =
        data.administra_renta.find(
          (a) => a.id === prop.datos_alquiler?.administra_renta_id
        )?.nombre || "-";
      const aumentosPendientes = calcularAumentosPendientes(prop);

      return {
        ID: prop.id,
        Propiedad: prop.nombre,
        Descripción: prop.descripcion,
        Propietario: propietario,
        "Estado Propiedad": estadoProp,
        Administra: administra,
        Inquilino: prop.datos_alquiler?.alquilado_a || "-",
        "Monto Contrato": prop.monto_contrato,
        "Monto Cobrado": cobro.monto_cobrado || 0,
        Pendiente: Math.max(
          0,
          prop.monto_contrato - (cobro.monto_cobrado || 0)
        ),
        "Método de Pago": metodo,
        "Fecha Cobro": cobro.fecha_cobro || "-",
        "Cobro Anterior": cobroAnterior.monto_cobrado || 0,
        "Aumentos Pendientes":
          aumentosPendientes.length > 0
            ? `↑ ${aumentosPendientes[0].porcentaje}%`
            : "-",
        "Días Restantes Contrato": calcularDiasRestantesContrato(prop) || "-",
        Notas: cobro.notas || "-",
      };
    });

    // Crear libro de Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(datos);

    // Ajustar anchos de columnas para mejor visualización
    const columnWidths = [
      { wch: 5 }, // ID
      { wch: 20 }, // Propiedad
      { wch: 25 }, // Descripción
      { wch: 20 }, // Propietario
      { wch: 15 }, // Estado Propiedad
      { wch: 15 }, // Administra
      { wch: 20 }, // Inquilino
      { wch: 15 }, // Monto Contrato
      { wch: 15 }, // Monto Cobrado
      { wch: 15 }, // Pendiente
      { wch: 20 }, // Método de Pago
      { wch: 15 }, // Fecha Cobro
      { wch: 15 }, // Cobro Anterior
      { wch: 20 }, // Aumentos Pendientes
      { wch: 20 }, // Días Restantes
      { wch: 30 }, // Notas
    ];

    worksheet["!cols"] = columnWidths;

    // Agregar título y fecha
    const title = [
      ["REPORTE DE INGRESOS - DETALLE COMPLETO"],
      [`Período: ${data.configuracion.mes_actual}`],
      [`Fecha de generación: ${new Date().toLocaleDateString("es-AR")}`],
      [], // Espacio en blanco
    ];

    XLSX.utils.sheet_add_aoa(worksheet, title, { origin: "A1" });

    // Agregar totales al final
    const { totalContrato, totalActual, totalPendiente } = calcularTotales();
    const footer = [
      [],
      ["TOTALES:"],
      [
        `Contrato: ${
          data.configuracion.simbolo_moneda
        } ${totalContrato.toLocaleString("es-AR")}`,
      ],
      [
        `Cobrado: ${
          data.configuracion.simbolo_moneda
        } ${totalActual.toLocaleString("es-AR")}`,
      ],
      [
        `Pendiente: ${
          data.configuracion.simbolo_moneda
        } ${totalPendiente.toLocaleString("es-AR")}`,
      ],
    ];

    XLSX.utils.sheet_add_aoa(worksheet, footer, { origin: -1 });

    // Configurar para impresión en A4 apaisado
    worksheet["!pageSetup"] = {
      orientation: "landscape",
      paperSize: 9, // 9 = A4
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    };

    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Detalle Ingresos");

    // Exportar archivo
    XLSX.writeFile(
      workbook,
      `Reporte_Ingresos_${data.configuracion.mes_actual}.xlsx`
    );
  };

  // ==============================================
  // 7. RENDERIZADO DEL COMPONENTE
  // ==============================================
  if (data.isLoading) return <div className="loading">Cargando...</div>;
  if (data.error) return <div className="error">{data.error}</div>;

  const { totalActual, totalAnterior, totalContrato, totalPendiente } =
    calcularTotales();

  return (
    <div className="ingresos-cobros-container">
      {/* SECCIÓN SUPERIOR DE CONTROLES */}
      <div className="controles-superiores">
        {/* Título y fecha */}
        <div className="titulo-seccion">
          <h2>CUADRO DE INGRESOS MES CORRIENTE</h2>
          <div className="fecha-actual">
            <span>
              Recaudación al día: {new Date().toLocaleDateString("es-AR")}
            </span>
          </div>
        </div>

        {/* Filtro por estado */}
        <div className="filtro-estado">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(parseInt(e.target.value))}
          >
            <option value={0}>Todos los estados</option>
            {data.estados_propiedad.map((estado) => (
              <option key={estado.id} value={estado.id}>
                {estado.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Botones de exportación */}
        <div className="botones-exportacion">
          <button onClick={exportToExcel} className="btn-exportar">
            <i className="bi bi-file-earmark-excel"></i> Exportar Excel Completo
          </button>
          <button
            onClick={() => navigate("/ing-totales")}
            className="btn-exportar"
          >
            <i className="bi bi-graph-up"></i> Ver Totales
          </button>
        </div>

        {/* Resumen de totales */}
        <div className="resumen-totales">
          <div className="total-card">
            <span>Contrato:</span>
            <strong>
              {data.configuracion.simbolo_moneda}{" "}
              {totalContrato.toLocaleString("es-AR")}
            </strong>
            <div className="variacion">
              {totalAnterior > 0 && (
                <span
                  className={
                    totalContrato >= totalAnterior ? "positivo" : "negativo"
                  }
                >
                  {(
                    ((totalContrato - totalAnterior) / totalAnterior) *
                    100
                  ).toFixed(1)}
                  % vs mes anterior
                </span>
              )}
            </div>
          </div>
          <div className="total-card">
            <span>Cobrado:</span>
            <strong>
              {data.configuracion.simbolo_moneda}{" "}
              {totalActual.toLocaleString("es-AR")}
            </strong>
            <div className="porcentaje">
              <span>
                {totalContrato > 0
                  ? ((totalActual / totalContrato) * 100).toFixed(1)
                  : 0}
                % del total
              </span>
            </div>
          </div>
          <div className="total-card">
            <span>Pendiente:</span>
            <strong className={totalPendiente > 0 ? "pendiente" : ""}>
              {data.configuracion.simbolo_moneda}{" "}
              {totalPendiente.toLocaleString("es-AR")}
            </strong>
            <div className="detalle-pendiente">
              {totalPendiente > 0 && (
                <span>
                  {
                    propiedadesFiltradas.filter((p) => {
                      const cobro =
                        p.cobros[data.configuracion.mes_actual] || {};
                      return p.monto_contrato - (cobro.monto_cobrado || 0) > 0;
                    }).length
                  }{" "}
                  propiedades con saldo
                </span>
              )}
            </div>
          </div>
          <div className="total-card">
            <span>Saldo anterior:</span>
            <strong className={totalAnterior > 0 ? "saldo-anterior" : ""}>
              {data.configuracion.simbolo_moneda}{" "}
              {totalAnterior.toLocaleString("es-AR")}
            </strong>
            <div className="info-saldo">
              {totalAnterior > 0 && <span>Deuda acumulada</span>}
            </div>
          </div>
        </div>
      </div>

      {/* TABLA PRINCIPAL DE PROPIEDADES */}
      <div className="tabla-reorganizada">
        <table>
          <thead>
            <tr>
              <th className="id-col">ID</th>
              <th className="imagen-col">Imagen</th>
              <th className="propiedad-col">Propiedad</th>
              <th className="contrato-col">Contrato</th>
              <th className="estado-col">Estado</th>
              <th className="inquilino-col">Inquilino</th>
              <th className="metodo-col">Método</th>
              <th className="cobro-col">Cobro</th>
              <th className="acciones-col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {propiedadesFiltradas.map((propiedad) => {
              // Extraer datos para cada fila
              const cobro =
                propiedad.cobros[data.configuracion.mes_actual] || {};
              const cobroAnterior =
                propiedad.cobros[data.configuracion.mes_anterior] || {};
              const estadoCobro = data.estados_cobro.find(
                (e) => e.id === cobro.estado_cobro_id
              );
              const metodoCobro = data.metodos_cobro.find(
                (m) => m.id === cobro.metodo_cobro_id
              );
              const propietario = data.propietarios.find(
                (p) => p.id === propiedad.propietario_id
              );
              const estadoProp = data.estados_propiedad.find(
                (e) => e.id === propiedad.estado_propiedad_id
              );
              const administra = data.administra_renta.find(
                (a) => a.id === propiedad.datos_alquiler?.administra_renta_id
              );

              // Calcular valores derivados
              const pendientePorCobrar = Math.max(
                0,
                propiedad.monto_contrato - (cobro.monto_cobrado || 0)
              );
              const aumentosPendientes = calcularAumentosPendientes(propiedad);
              const diasRestantes = calcularDiasRestantesContrato(propiedad);
              const tieneAumentosPendientes = aumentosPendientes.length > 0;

              return (
                <tr
                  key={propiedad.id}
                  className={estadoCobro?.id === 2 ? "pendiente" : ""}
                >
                  {/* COLUMNA 1: ID */}
                  <td className="id-col">
                    <div className="id-minimo">{propiedad.id}</div>
                  </td>

                  {/* COLUMNA 2: IMAGEN */}
                  <td className="imagen-col">
                    <img
                      src={propiedad.imagen_principal}
                      alt=""
                      className="mini-imagen"
                      onClick={() =>
                        window.open(propiedad.imagen_principal, "_blank")
                      }
                    />
                  </td>

                  {/* COLUMNA 3: PROPIEDAD */}
                  <td className="propiedad-col">
                    <div className="propiedad-info">
                      <div className="nombre-propiedad">{propiedad.nombre}</div>
                      <div className="detalles-propiedad">
                        <span>{propiedad.descripcion}</span>
                        <span>Propietario: {propietario?.nombre || "-"}</span>
                      </div>
                    </div>
                  </td>

                  {/* COLUMNA 4: CONTRATO */}
                  <td className="contrato-col">
                    <div className="contrato-info">
                      <div
                        className={`monto-contrato ${
                          tieneAumentosPendientes ? "con-aumento" : ""
                        }`}
                      >
                        {data.configuracion.simbolo_moneda}
                        {propiedad.monto_contrato?.toLocaleString("es-AR")}
                        {tieneAumentosPendientes && (
                          <span
                            className="alerta-aumento"
                            title={`Aumento programado del ${aumentosPendientes[0].porcentaje}%`}
                          >
                            ↑ {aumentosPendientes[0].porcentaje}%
                          </span>
                        )}
                      </div>
                      {propiedad.datos_alquiler && (
                        <div className="fechas-contrato">
                          <span>
                            Fin:{" "}
                            {propiedad.datos_alquiler.fecha_fin_contrato || "-"}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* COLUMNA 5: ESTADO */}
                  <td className="estado-col">
                    <div className="estado-info">
                      <span
                        className="estado-propiedad"
                        style={{ color: estadoProp?.color }}
                      >
                        {estadoProp?.nombre}
                      </span>
                      <span className="administra">
                        {administra?.nombre || "-"}
                      </span>
                    </div>
                  </td>

                  {/* COLUMNA 6: INQUILINO */}
                  <td className="inquilino-col">
                    <div className="inquilino-info">
                      {propiedad.datos_alquiler ? (
                        <>
                          <span className="nombre-inquilino">
                            {propiedad.datos_alquiler.alquilado_a}
                          </span>
                          {propiedad.datos_alquiler.contrato_url && (
                            <button
                              className="btn-contrato"
                              onClick={() =>
                                window.open(
                                  propiedad.datos_alquiler.contrato_url,
                                  "_blank"
                                )
                              }
                            >
                              Ver contrato
                            </button>
                          )}
                        </>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </td>

                  {/* COLUMNA 7: MÉTODO DE COBRO */}
                  <td className="metodo-col">
                    <select
                      value={cobro.metodo_cobro_id || ""}
                      onChange={(e) =>
                        handleCambioCobro(
                          propiedad.id,
                          "metodo_cobro_id",
                          parseInt(e.target.value)
                        )
                      }
                      disabled={!propiedad.datos_alquiler}
                    >
                      <option value="">Seleccionar</option>
                      {data.metodos_cobro.map((metodo) => (
                        <option key={metodo.id} value={metodo.id}>
                          {metodo.nombre.split(" - ")[0]}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* COLUMNA 8: COBRO */}
                  <td className="cobro-col">
                    <div className="cobro-info">
                      <div className="monto-cobrado">
                        <input
                          type="number"
                          value={cobro.monto_cobrado || 0}
                          onChange={(e) =>
                            handleCambioCobro(
                              propiedad.id,
                              "monto_cobrado",
                              parseFloat(e.target.value)
                            )
                          }
                          disabled={!propiedad.datos_alquiler}
                          min="0"
                          max={propiedad.monto_contrato}
                          placeholder="Monto"
                        />
                      </div>
                      <div className="fecha-cobro">
                        <input
                          type="date"
                          value={cobro.fecha_cobro || ""}
                          onChange={(e) =>
                            handleCambioCobro(
                              propiedad.id,
                              "fecha_cobro",
                              e.target.value
                            )
                          }
                          disabled={!propiedad.datos_alquiler}
                          placeholder="Fecha"
                        />
                      </div>
                      <div className="cobro-anterior">
                        <span>
                          Anterior: {data.configuracion.simbolo_moneda}
                          {cobroAnterior.monto_cobrado?.toLocaleString(
                            "es-AR"
                          ) || 0}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* COLUMNA 9: ACCIONES */}
                  <td className="acciones-col">
                    <div className="acciones-info">
                      <button
                        className="btn-registrar"
                        onClick={() =>
                          handleCambioCobro(propiedad.id, "estado_cobro_id", 1)
                        }
                        disabled={!(cobro.monto_cobrado > 0)}
                        title="Registrar cobro"
                      >
                        Registrado
                      </button>

                      {tieneAumentosPendientes && (
                        <button
                          className="btn-aplicar-aumento"
                          onClick={() => aplicarAumento(propiedad.id, 0)}
                          title={`Aplicar aumento del ${aumentosPendientes[0].porcentaje}%`}
                        >
                          Aplicar Aumento
                        </button>
                      )}

                      <input
                        type="text"
                        value={cobro.notas || ""}
                        onChange={(e) =>
                          handleCambioCobro(
                            propiedad.id,
                            "notas",
                            e.target.value
                          )
                        }
                        placeholder="Notas"
                        className="input-notas"
                      />

                      <div className="cobro-anterior">
                        <span>
                          Falta: {data.configuracion.simbolo_moneda}
                          {pendientePorCobrar.toLocaleString("es-AR")}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngresosCobros;
