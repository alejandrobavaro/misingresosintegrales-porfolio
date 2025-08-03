# Documentación del Sistema de Gestión de Ingresos por Alquileres

## Descripción General

Este sistema es una aplicación web para gestionar propiedades en alquiler, sus cobros, aumentos programados y vencimientos de contratos. Permite visualizar el estado de los pagos, registrar nuevos cobros, aplicar aumentos y realizar un seguimiento completo de los ingresos por alquileres.

## Componentes Principales

### 1. Componente `IngresosCobros`

#### Funcionalidades:
- Visualización de todas las propiedades con sus datos de alquiler
- Filtrado por estado de propiedad (Alquilado, No alquilado, etc.)
- Registro de cobros mensuales
- Aplicación de aumentos programados
- Visualización de totales (cobrado, pendiente, monto contrato)
- Gestión de métodos de pago
- Visualización de días restantes para vencimiento de contratos

#### Estructura:
1. **Estados del componente**:
   - Datos principales (propiedades, configuración, estados, métodos de pago)
   - Filtro por estado de propiedad

2. **Carga de datos**:
   - Obtiene información desde un archivo JSON local (`/data/ingresos-porfolio.json`)

3. **Funciones principales**:
   - Filtrado de propiedades
   - Manejo de cambios en los cobros
   - Cálculo de totales
   - Gestión de aumentos programados

4. **Renderizado**:
   - Sección de controles superiores (filtros y resumen de totales)
   - Tabla principal con todas las propiedades

### 2. Componente `IngFiltros`

#### Funcionalidades:
- Búsqueda por texto (nombre o descripción)
- Filtrado por propietario
- Filtrado por estado de propiedad

#### Props:
- `filtros`: Objeto con los valores actuales de los filtros
- `onChangeFiltros`: Función para actualizar los filtros
- `propietarios`: Listado de propietarios disponibles
- `estadosPropiedad`: Listado de estados de propiedad disponibles

### 3. Versión Compacta (`IngresosCobros` compacto)

Una versión alternativa del componente principal con:
- Visualización más compacta de la información
- Mismos datos pero con disposición diferente
- Enfoque en mostrar más propiedades en pantalla

## Estructura del JSON de Datos

El archivo `ingresos-porfolio.json` contiene toda la información del sistema:

1. **Metadata**: Información sobre la versión y autoría
2. **Configuración**: Moneda, formatos, meses actual/anterior
3. **Propietarios**: Listado de dueños de propiedades
4. **Propiedades**: Array con todas las propiedades y sus datos:
   - Información básica (nombre, descripción, imagen)
   - Datos de alquiler (inquilino, fechas de contrato, aumentos programados)
   - Cobros por mes
5. **Listas de referencia**: Estados, métodos de pago, tipos de alquiler, etc.

## Funcionalidades Clave

1. **Gestión de Cobros**:
   - Registrar montos cobrados
   - Seleccionar método de pago
   - Indicar fecha de cobro
   - Agregar notas

2. **Aumentos Programados**:
   - Visualización de aumentos pendientes
   - Aplicación de aumentos con un clic
   - Cálculo automático del nuevo monto

3. **Seguimiento de Vencimientos**:
   - Visualización de días restantes para el vencimiento del contrato
   - Indicación visual de urgencia (colores según días restantes)

4. **Filtrado y Búsqueda**:
   - Por estado de propiedad
   - Por propietario
   - Por texto (nombre o descripción)

5. **Visualización de Imágenes**:
   - Imagen principal de cada propiedad
   - Galería de imágenes adicionales
   - Visualización en ventana nueva al hacer clic

## Uso del Sistema

1. **Pantalla Principal**:
   - Seleccionar filtros si es necesario
   - Ver resumen de totales (cobrado, pendiente, monto contrato)
   - Revisar el listado de propiedades

2. **Registrar un Cobro**:
   - Ingresar monto cobrado en la propiedad correspondiente
   - Seleccionar método de pago
   - Indicar fecha de cobro
   - Hacer clic en "Registrado" para confirmar

3. **Aplicar Aumentos**:
   - Ver propiedades con aumentos pendientes (indicado con ↑%)
   - Hacer clic en "Aplicar Aumento" para confirmar

4. **Ver Detalles**:
   - Hacer clic en imágenes para ampliarlas
   - Ver contrato (botón "Ver contrato")
   - Revisar información adicional en cada fila

## Estructura de Archivos

```
Frontend/
├── public/
│   └── data/
│       └── ingresos-porfolio.json       # Datos principales del sistema
└── src/
    ├── assets/
    │   └── scss/
    │       └── _03-Componentes/
    │           └── _IngresosCobros.scss  # Estilos del componente
    └── components/
        ├── IngresosCobros.js   # Componente principal
        └── IngFiltros.js       # Componente de filtros
```

## Notas Técnicas

1. **Estados**:
   - Los cobros pueden estar en 3 estados: Cobrado, Pendiente o No se Cobra
   - Las propiedades tienen 4 estados posibles: Alquilado, No alquilado, A la venta, No se comercializa

2. **Métodos de Pago**:
   - Hay 25 métodos configurados (efectivo, transferencias, billeteras virtuales, etc.)

3. **Aumentos**:
   - Se pueden programar múltiples aumentos para cada propiedad
   - El sistema calcula automáticamente el nuevo monto al aplicar un aumento

4. **Responsividad**:
   - El sistema incluye una versión compacta para mejor visualización en pantallas pequeñas

# misingresosintegrales-porfolio
