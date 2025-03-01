import React from 'react';
import InvoiceList from './InvoiceList';

function InvoicePage() {
  const invoices = [
    { clientName: 'Cliente 1', amount: 100, date: '2023-10-01' },
    { clientName: 'Cliente 2', amount: 200, date: '2023-10-02' },
  ];

  return (
    <div className="container p-4 mx-auto">
      <h2 className="mb-4 text-3xl font-bold text-green-900">Lista de Facturas</h2>
      <InvoiceList invoices={invoices} />
    </div>
  );
}

export default InvoicePage;