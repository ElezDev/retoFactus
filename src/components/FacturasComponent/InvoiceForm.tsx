import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaPlus, FaTrash } from 'react-icons/fa'; 
import arrozImage from '../../assets/images/arroz.webp';
import frijolesImage from '../../assets/images/frijoles.webp';
import aceiteImage from '../../assets/images/aceite.png';

const productsData = [
  {
    id: 1,
    code_reference: "12345",
    name: "Arroz",
    price: 2500,
    tax_rate: "19.00",
    discount_rate: 10,
    unit_measure_id: 70,
    standard_code_id: 1,
    is_excluded: 0,
    tribute_id: 1,
    withholding_taxes: [{ code: "06", withholding_tax_rate: "7.00" }],
    image: arrozImage,
  },
  {
    id: 2,
    code_reference: "54321",
    name: "Frijoles",
    price: 3000,
    tax_rate: "5.00",
    discount_rate: 0,
    unit_measure_id: 70,
    standard_code_id: 1,
    is_excluded: 0,
    tribute_id: 1,
    withholding_taxes: [],
    image: frijolesImage,
  },
  {
    id: 3,
    code_reference: "67890",
    name: "Aceite",
    price: 8000,
    tax_rate: "19.00",
    discount_rate: 5,
    unit_measure_id: 70,
    standard_code_id: 1,
    is_excluded: 0,
    tribute_id: 1,
    withholding_taxes: [{ code: "05", withholding_tax_rate: "15.00" }],
    image: aceiteImage,
  },
  // ... (puedes agregar más productos aquí)
];

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
  const [invoicePublicUrl, setInvoicePublicUrl] = useState<string | null>(null);
  const [municipalities, setMunicipalities] = useState<{ id: number; name: string; department: string }[]>([]);
  const apiUrl = import.meta.env.VITE_URL_API;
  const token = import.meta.env.VITE_TOKEN;

  useEffect(() => {
    fetchMunicipalities();
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

  const filteredProducts = searchTerm
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  const filteredMunicipalities = searchTerm
    ? municipalities.filter(
        (municipality) =>
          municipality.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          municipality.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : municipalities;

  const addProductToInvoice = (product:any) => {
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

  const removeProductFromInvoice = (productId:any) => {
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

  const generateInvoice = () => {
    const invoice = {
      numbering_range_id: 8,
      reference_code: "elezdev-002",
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
    };
    console.log(invoice);
    validateInvoice(invoice);
  };

  const validateInvoice = async (invoice:any) => {
    try {
      const response = await axios.post(`${apiUrl}/v1/bills/validate`, invoice, {
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
    }
  };

  const handleCustomerChange = (e:any) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleMunicipalityChange = (e:any) => {
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
                placeholder="Nombre"
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="identification"
                value={customer.identification}
                onChange={handleCustomerChange}
                placeholder="Identificación"
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="email"
                value={customer.email}
                onChange={handleCustomerChange}
                placeholder="Email"
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="phone"
                value={customer.phone}
                onChange={handleCustomerChange}
                placeholder="Teléfono"
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar municipio (opcional)"
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              /> */}
              <select
                name="municipality_id"
                value={customer.municipality_id}
                onChange={handleMunicipalityChange}
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un municipio</option>
                {filteredMunicipalities.map((municipality) => (
                  <option key={municipality.id} value={municipality.id}>
                    {municipality.name} - {municipality.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabla de Productos Seleccionados */}
            <div className="mb-4">
              <h3 className="mb-2 font-bold text-gray-800">Productos Seleccionados</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Producto</th>
                    <th className="p-2 border">Cantidad</th>
                    <th className="p-2 border">Precio</th>
                    <th className="p-2 border">Descuento</th>
                    <th className="p-2 border">Impuesto</th>
                    <th className="p-2 border">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product, index) => (
                    <tr key={index} className="border">
                      <td className="p-2 border">{product.name}</td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => updateProductQuantity(product.id, parseInt(e.target.value))}
                          className="w-16 p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-2 border">${product.price}</td>
                      <td className="p-2 border">{product.discount_rate}%</td>
                      <td className="p-2 border">{product.tax_rate}%</td>
                      <td className="p-2 border">
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

            {/* Total y Botón de Generar Factura */}
            <div className="mt-4">
              <p className="font-bold text-gray-800">Total: ${calculateTotal().toFixed(2)}</p>
              <button
                onClick={generateInvoice}
                className="w-full px-4 py-2 mt-2 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
              >
                Generar Factura
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceForm;