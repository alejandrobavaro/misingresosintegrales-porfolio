// ============================================
// IMPORTACIONES DE DEPENDENCIAS EXTERNAS
// ============================================
import React, { useState, useCallback } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";

// ============================================
// IMPORTACIONES DE ESTILOS
// ============================================
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/scss/_01-General/_App.scss";

// ============================================
// IMPORTACIONES DE CONTEXTOS
// ============================================
import { AuthProvider, useAuth } from "./componentes/SesionAuthContext";

// ============================================
// IMPORTACIONES DE COMPONENTES
// ============================================
// Layout
import HeaderUnificado from "./componentes/HeaderUnificado";
import MainContent from "./componentes/MainContent";
import MainWhatsappIcon from "./componentes/MainWhatsappIcon";
import Footer from "./componentes/Footer";

// Contacto
import ContactoLogoRedes from "./componentes/ContactoLogoRedes";
import ContactoFormularioSlider from "./componentes/ContactoFormularioSlider";

// Autenticación
import SesionRegister from "./componentes/SesionRegister";
import SesionLogout from "./componentes/SesionLogout";
import SesionLogin from "./componentes/SesionLogin";

// Datos
import DataInfoCuentas from "./componentes/DataInfoCuentas";
import IngresosCobros from "./componentes/IngresosCobros";
import DatosCompletos from "./componentes/DatosCompletos";
import IngTotales from "./componentes/IngTotales";

// ============================================
// COMPONENTES AUXILIARES
// ============================================

/**
 * Maneja errores en la renderización de componentes hijos
 */
const ErrorBoundary = () => (
  <div className="error-boundary">
    <h2>Algo salió mal</h2>
    <p>Por favor, recarga la página o intenta nuevamente más tarde.</p>
    <button onClick={() => window.location.reload()}>Recargar</button>
  </div>
);

/**
 * Página de contacto unificada
 */
const ContactoPage = () => (
  <>
    <ContactoLogoRedes />
    <ContactoFormularioSlider />
  </>
);

/**
 * Protege rutas que requieren autenticación
 */
const RequireAuth = ({ children }) => {
  const { state } = useAuth();
  const location = useLocation();

  return state.isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

// ============================================
// LAYOUT PRINCIPAL
// ============================================

const LayoutWrapper = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  return (
    <>
      <HeaderUnificado
        categories={['gastos', 'Impuestos', 'Alquileres']}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="main-content">
        <div className="content">
          <Outlet />
        </div>
      </div>

      <Footer />
      <MainWhatsappIcon />
    </>
  );
};

// ============================================
// CONFIGURACIÓN DE RUTAS
// ============================================

const router = createBrowserRouter([
  {
    path: "/login",
    element: <SesionLogin />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/register",
    element: <SesionRegister />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/logout",
    element: <SesionLogout />,
    errorElement: <ErrorBoundary />,
  },
  {
    element: <LayoutWrapper />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <RequireAuth><MainContent /></RequireAuth>
      },
      {
        path: "/ing-totales",
        element: (
          <RequireAuth>
            <IngTotales 
              propiedades={[]}  // Array vacío o datos reales
              configuracion={{}} // Objeto vacío o configuración real
              estados_cobro={[]} // Array vacío o datos reales
              metodos_cobro={[]} // Array vacío o datos reales
              propietarios={[]} // Array vacío o datos reales
              estados_propiedad={[]} // Array vacío o datos reales
            />
          </RequireAuth>
        )
      },
      {
        path: "/contacto",
        element: <RequireAuth><ContactoPage /></RequireAuth>
      },
      {
        path: "/data",
        element: <RequireAuth><DataInfoCuentas /></RequireAuth>
      },
      {
        path: "/ingresos-cobros",
        element: <RequireAuth><IngresosCobros /></RequireAuth>
      },
      {
        path: "/ing-data",
        element: <RequireAuth><DatosCompletos /></RequireAuth>
      }
    ]
  }
]);

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;