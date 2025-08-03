import React from 'react';
import '../assets/scss/_03-Componentes/_SesionLoginRegister.scss';

// --------------------------------------------
// COMPONENTE DE SPINNER DE CARGA
// --------------------------------------------
const SesionLoginRegister = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
};

export default SesionLoginRegister;