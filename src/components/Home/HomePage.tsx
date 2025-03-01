import React from 'react';
import InvoiceForm from '../FacturasComponent/InvoiceForm';

function HomePage() {
  return (
    <div className="container p-4 mx-auto">
      <h2 className="mb-4 text-3xl font-bold text-green-900">Crear Nueva Factura</h2>
      <InvoiceForm />
    </div>
  );
}

export default HomePage;