import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Importar imágenes desde la carpeta assets
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
    withholding_taxes: [
      { code: "06", withholding_tax_rate: "7.00" }
    ],
    image: arrozImage // Usar la imagen importada
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
    image: frijolesImage // Usar la imagen importada
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
    withholding_taxes: [
      { code: "05", withholding_tax_rate: "15.00" }
    ],
    image: aceiteImage // Usar la imagen importada
  }
];

function InvoiceForm() {
  const [products, setProducts] = useState(productsData);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const apiUrl = import.meta.env.VITE_URL_API;
  const token = import.meta.env.VITE_TOKEN;
  const [customer, setCustomer] = useState({
    identification: "10029238873",
    dv: "3",
    company: "elezdev",
    trade_name: "",
    names: "Edwin",
    address: "N/A",
    email: "elezdev2023@gmail.com",
    phone: "1234567890",
    legal_organization_id: "2",
    tribute_id: "21",
    identification_document_id: "3",
    municipality_id: "427"
  });

  const [municipalities, setMunicipalities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    fetchMunicipalities();
  }, []);

  const fetchMunicipalities = async (name = '') => {
    try {
      const response = await axios.get(`${apiUrl}/v1/municipalities?name=${name}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setMunicipalities(response.data.data); 
    } catch (error) {
      console.error('Error fetching municipalities:', error);
    }
  };

  const filteredMunicipalities = searchTerm
    ? municipalities.filter(municipality =>
        municipality.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        municipality.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : municipalities;
    
  const handleMunicipalityChange = (e) => {
    const { value } = e.target;
    setCustomer({ ...customer, municipality_id: value });
  };

  const addProductToInvoice = (product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(selectedProducts.map(p =>
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const removeProductFromInvoice = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const updateProductQuantity = (productId, quantity) => {
    if (quantity <= 0) return;
    setSelectedProducts(selectedProducts.map(p =>
      p.id === productId ? { ...p, quantity: quantity } : p
    ));
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
      reference_code: "elezdev-001",
      observation: "",
      payment_form: "1",
      payment_due_date: "2024-12-30",
      payment_method_code: "10",
      billing_period: {
        start_date: "2024-01-10",
        start_time: "00:00:00",
        end_date: "2024-02-09",
        end_time: "23:59:59"
      },
      customer: customer,
      items: selectedProducts.map(product => ({
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
        withholding_taxes: product.withholding_taxes
      }))
    };
    console.log(invoice);
    validateInvoice(invoice);
  };

  const validateInvoice = async (invoice) => {
    try {
      const response = await axios.post(`${apiUrl}/v1/bills/validate`, invoice, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Respuesta del servidor:', response.data);
      alert('Factura validada correctamente');
    } catch (error) {
      console.error('Error validando la factura:', error);
      alert('Error validando la factura');
    }
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Sistema POS</h1>
      <div className="grid grid-cols-2 gap-4">
        {/* Sección de Productos */}
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="mb-4 text-xl font-semibold">Productos Disponibles</h2>
          <div className="grid grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product.id} className="p-4 bg-white rounded-lg shadow-md">
                <img
                  src={product.image} // Usar la imagen importada
                  alt={product.name}
                  className="object-cover w-full h-32 mb-2 rounded-lg"
                />
                <h3 className="font-bold">{product.name}</h3>
                <p>Precio: ${product.price}</p>
                <button
                  onClick={() => addProductToInvoice(product)}
                  className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de Factura y Datos del Cliente */}
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="mb-4 text-xl font-semibold">Factura</h2>
          <div className="p-4 bg-white rounded-lg shadow-md">
            {/* Formulario del Cliente */}
            <div className="mb-4">
              <h3 className="mb-2 font-bold">Datos del Cliente</h3>
              <input
                type="text"
                name="names"
                value={customer.names}
                onChange={handleCustomerChange}
                placeholder="Nombre"
                className="w-full p-2 mb-2 border rounded-lg"
              />
              <input
                type="text"
                name="identification"
                value={customer.identification}
                onChange={handleCustomerChange}
                placeholder="Identificación"
                className="w-full p-2 mb-2 border rounded-lg"
              />
              <input
                type="text"
                name="email"
                value={customer.email}
                onChange={handleCustomerChange}
                placeholder="Email"
                className="w-full p-2 mb-2 border rounded-lg"
              />
              <input
                type="text"
                name="phone"
                value={customer.phone}
                onChange={handleCustomerChange}
                placeholder="Teléfono"
                className="w-full p-2 mb-2 border rounded-lg"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar municipio (opcional)"
                className="w-full p-2 mb-2 border rounded-lg"
              />
              <select
                name="municipality_id"
                value={customer.municipality_id}
                onChange={handleMunicipalityChange}
                className="w-full p-2 mb-2 border rounded-lg"
              >
                <option value="">Seleccione un municipio</option>
                {filteredMunicipalities.map(municipality => (
                  <option key={municipality.id} value={municipality.id}>
                    {municipality.name} - {municipality.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabla de Productos Seleccionados */}
            <div className="mb-4">
              <h3 className="mb-2 font-bold">Productos Seleccionados</h3>
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
                          className="w-16 p-1 border rounded-lg"
                        />
                      </td>
                      <td className="p-2 border">${product.price}</td>
                      <td className="p-2 border">{product.discount_rate}%</td>
                      <td className="p-2 border">{product.tax_rate}%</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => removeProductFromInvoice(product.id)}
                          className="px-2 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total y Botón de Generar Factura */}
            <div className="mt-4">
              <p className="font-bold">Total: ${calculateTotal().toFixed(2)}</p>
              <button
                onClick={generateInvoice}
                className="px-4 py-2 mt-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
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