import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaPlus, FaTrash, FaFilePdf, FaSpinner } from 'react-icons/fa';
import { productsData } from './Data/data';

function InvoiceForm() {
  const [products, setProducts] = useState(productsData);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customer, setCustomer] = useState({
    identification: "",
    dv: "3",
    company: "elezdev",
    trade_name: "",
    names: "",
    address: "",
    email: "",
    phone: "",
    legal_organization_id: "2",
    tribute_id: "21",
    identification_document_id: "3",
    municipality_id: "427",
  });
  const [invoice, setInvoice] = useState({
    numbering_range_id: "8",
    reference_code: "elezdev-004",
    observation: "",
    payment_form: "1",
    payment_due_date: "2024-12-30",
    payment_method_code: "10",
    billing_period: {
      start_date: "2024-01-10",
      start_time: "00:00:00",
      end_date: "2024-02-09",
      end_time: "23:59:59",
    },
  });
  const [municipalities, setMunicipalities] = useState<{ id: number; name: string; department: string }[]>([]);
  const [numberingRanges, setNumberingRanges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_URL_API;
  const token = import.meta.env.VITE_TOKEN;

  useEffect(() => {
    fetchMunicipalities();
    fetchNumberingRanges();
  }, []);

  const fetchMunicipalities = async (name = '') => {
    try {
      const response = await axios.get(`${apiUrl}/v1/municipalities?name=${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setMunicipalities(response.data.data);
    } catch (error) {
      console.error('Error fetching municipalities:', error);
      toast.error('Error al cargar los municipios');
    }
  };

  const fetchNumberingRanges = async () => {
    try {
      const response = await axios.get(`${apiUrl}/v1/numbering-ranges`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setNumberingRanges(response.data.data);
    } catch (error) {
      console.error('Error fetching numbering ranges:', error);
      toast.error('Error al cargar los rangos de numeración');
    }
  };

  const filteredProducts = searchTerm
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  const addProductToInvoice = (product: any) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} agregado a la factura`);
  };

  const removeProductFromInvoice = (productId: any) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
    toast.info('Producto eliminado de la factura');
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) return;
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.id === productId ? { ...p, quantity: quantity } : p
      )
    );
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => {
      const priceAfterDiscount = product.price * (1 - product.discount_rate / 100);
      const taxAmount = priceAfterDiscount * (parseFloat(product.tax_rate) / 100);
      return total + (priceAfterDiscount + taxAmount) * product.quantity;
    }, 0);
  };

  const validateFields = () => {
    if (!customer.names) {
      toast.error('El nombre del cliente es obligatorio');
      return false;
    }
    if (!customer.identification) {
      toast.error('La identificación del cliente es obligatoria');
      return false;
    }
    if (!customer.email) {
      toast.error('El email del cliente es obligatorio');
      return false;
    }
    if (!customer.phone) {
      toast.error('El teléfono del cliente es obligatorio');
      return false;
    }
    if (!customer.municipality_id) {
      toast.error('El municipio es obligatorio');
      return false;
    }
    if (selectedProducts.length === 0) {
      toast.error('Debe seleccionar al menos un producto');
      return false;
    }
    return true;
  };

  const generateInvoice = async () => {
    // Validar campos obligatorios
    if (!validateFields()) return;

    setIsLoading(true);
    const selectedRange = numberingRanges.find(
      (range) => range.id === parseInt(invoice.numbering_range_id)
    );

    const invoiceData = {
      ...invoice,
      customer: customer,
      items: selectedProducts.map((product) => ({
        code_reference: product.code_reference,
        name: product.name,
        quantity: product.quantity,
        discount_rate: product.discount_rate,
        price: product.price,
        tax_rate: product.tax_rate,
        unit_measure_id: product.unit_measure_id,
        standard_code_id: product.standard_code_id,
        is_excluded: product.is_excluded,
        tribute_id: product.tribute_id,
        withholding_taxes: product.withholding_taxes,
      })),
      numbering_range: selectedRange,
    };

    try {
      const response = await axios.post(`${apiUrl}/v1/bills/validate`, invoiceData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Respuesta del servidor:', response.data);
      toast.success('Factura validada correctamente');
    } catch (error) {
      console.error('Error validando la factura:', error);
      toast.error('Error validando la factura');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerChange = (e: any) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleInvoiceChange = (e: any) => {
    const { name, value } = e.target;
    setInvoice({ ...invoice, [name]: value });
  };

  const handleMunicipalityChange = (e: any) => {
    const { value } = e.target;
    setCustomer({ ...customer, municipality_id: value });
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">Sistema POS</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Sección de Productos */}
        <div className="p-4 rounded-lg shadow-sm bg-gray-50">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Productos Disponibles</h2>
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute text-gray-400 top-3 left-3" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="p-2 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-24 mb-2 rounded-lg"
                />
                <h3 className="text-sm font-bold text-gray-800">{product.name}</h3>
                <p className="text-xs text-gray-600">Precio: ${product.price}</p>
                <button
                  onClick={() => addProductToInvoice(product)}
                  className="flex items-center justify-center w-full px-2 py-1 mt-2 text-sm text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  <FaPlus className="mr-1" /> Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de Factura y Datos del Cliente */}
        <div className="p-4 rounded-lg shadow-sm bg-gray-50">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Factura</h2>
          <div className="p-4 bg-white rounded-lg shadow-md">
            {/* Formulario del Cliente */}
            <div className="mb-4">
              <h3 className="mb-2 font-bold text-gray-800">Datos del Cliente</h3>
              <input
                type="text"
                name="names"
                value={customer.names}
                onChange={handleCustomerChange}
                placeholder="Nombre *"
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="identification"
                value={customer.identification}
                onChange={handleCustomerChange}
                placeholder="Identificación *"
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="email"
                value={customer.email}
                onChange={handleCustomerChange}
                placeholder="Email *"
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="phone"
                value={customer.phone}
                onChange={handleCustomerChange}
                placeholder="Teléfono *"
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="municipality_id"
                value={customer.municipality_id}
                onChange={handleMunicipalityChange}
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un municipio *</option>
                {municipalities.map((municipality) => (
                  <option key={municipality.id} value={municipality.id}>
                    {municipality.name} - {municipality.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Configuración de la Factura */}
            <div className="mb-4">
              <h3 className="mb-2 font-bold text-gray-800">Configuración de la Factura</h3>
              <select
                name="numbering_range_id"
                value={invoice.numbering_range_id}
                onChange={handleInvoiceChange}
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un rango de numeración</option>
                {numberingRanges.map((range) => (
                  <option key={range.id} value={range.id}>
                    {range.document} ({range.prefix}) - Actual: {range.current}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="reference_code"
                value={invoice.reference_code}
                onChange={handleInvoiceChange}
                placeholder="Código de Referencia"
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="payment_form"
                value={invoice.payment_form}
                onChange={handleInvoiceChange}
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Contado</option>
                <option value="2">Crédito</option>
              </select>
              <select
                name="payment_method_code"
                value={invoice.payment_method_code}
                onChange={handleInvoiceChange}
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="10">Efectivo</option>
                <option value="20">Tarjeta</option>
                <option value="30">Transferencia</option>
              </select>
            </div>

            {/* Tabla de Productos Seleccionados */}
            <div className="mb-4 overflow-x-auto">
              <h3 className="mb-2 font-bold text-gray-800">Productos Seleccionados</h3>
              <div className="border border-gray-200 rounded-lg shadow-sm">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-sm font-semibold text-left text-gray-700">Producto</th>
                      <th className="p-3 text-sm font-semibold text-left text-gray-700">Cantidad</th>
                      <th className="hidden p-3 text-sm font-semibold text-left text-gray-700 md:table-cell">Precio</th>
                      <th className="hidden p-3 text-sm font-semibold text-left text-gray-700 md:table-cell">Descuento</th>
                      <th className="hidden p-3 text-sm font-semibold text-left text-gray-700 md:table-cell">Impuesto</th>
                      <th className="p-3 text-sm font-semibold text-left text-gray-700">Subtotal</th>
                      <th className="p-3 text-sm font-semibold text-left text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map((product, index) => (
                      <tr
                        key={index}
                        className="transition-colors border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="p-3 text-sm text-gray-800">{product.name}</td>
                        <td className="p-3 text-sm text-gray-800">
                          <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => updateProductQuantity(product.id, parseInt(e.target.value))}
                            className="w-16 p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="hidden p-3 text-sm text-gray-800 md:table-cell">${product.price}</td>
                        <td className="hidden p-3 text-sm text-gray-800 md:table-cell">{product.discount_rate}%</td>
                        <td className="hidden p-3 text-sm text-gray-800 md:table-cell">{product.tax_rate}%</td>
                        <td className="p-3 text-sm text-gray-800">
                          ${(product.price * product.quantity * (1 - product.discount_rate / 100) * (1 + parseFloat(product.tax_rate) / 100)).toFixed(2)}
                        </td>
                        <td className="p-3 text-sm text-gray-800">
                          <button
                            onClick={() => removeProductFromInvoice(product.id)}
                            className="flex items-center justify-center px-2 py-1 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                          >
                            <FaTrash className="mr-1" /> Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total y Botón de Generar Factura */}
            <div className="mt-4">
              <p className="font-bold text-gray-800">Total: ${calculateTotal().toFixed(2)}</p>
              <button
                onClick={generateInvoice}
                disabled={isLoading}
                className="w-full px-4 py-2 mt-2 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-green-300"
              >
                {isLoading ? (
                  <FaSpinner className="inline-block mr-2 animate-spin" />
                ) : (
                  <FaFilePdf className="inline-block mr-2" />
                )}
                {isLoading ? 'Validando...' : 'Generar Factura'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceForm;