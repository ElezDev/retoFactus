import InvoiceList from './InvoiceList';

function InvoicePage() {

  return (
    <div className="container p-4 mx-auto">
      <h2 className="mb-4 text-3xl font-bold text-green-900">Lista de Facturas</h2>
      <InvoiceList />
    </div>
  );
}

export default InvoicePage;