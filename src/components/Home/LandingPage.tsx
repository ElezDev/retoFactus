import { Link } from 'react-router-dom';

function LandingPage() {

  return (
    <div className="min-h-screen bg-green-50">
      {/* Hero Section */}
      <section className="py-20 text-white bg-green-600">
        <div className="container mx-auto text-center">
          <h1 className="mb-4 text-5xl font-bold">Mi Solución al Reto</h1>
          <p className="mb-8 text-xl">
            Una aplicación moderna para la gestión de facturas electrónicas, diseñada con pasión y dedicación.
          </p>
          <Link
            to="/home"
            className="px-8 py-3 font-semibold text-green-600 transition duration-300 bg-white rounded-lg hover:bg-green-50"
          >
            Ver Demo
          </Link>
        </div>
      </section>

      {/* El Reto */}
      <section className="container py-16 mx-auto">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-green-900">El Reto</h2>
          <p className="max-w-2xl mx-auto text-lg text-green-700">
            El desafío consistía en crear una aplicación que simplificara la gestión de facturas electrónicas, haciendo que el proceso fuera más rápido, seguro y accesible para todos.
          </p>
        </div>
      </section>

      {/* Tu Solución */}
      <section className="py-16 bg-green-100">
        <div className="container mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-center text-green-900">Mi Solución</h2>
          <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
            <div className="text-center md:text-left">
              <h3 className="mb-4 text-xl font-bold text-green-900">¿Qué ofrece mi aplicación?</h3>
              <ul className="text-green-700 list-disc list-inside">
                <li>Interfaz intuitiva y fácil de usar.</li>
                <li>Gestión segura de facturas electrónicas.</li>
                <li>Acceso en tiempo real desde cualquier dispositivo.</li>
                <li>Exportación de facturas en múltiples formatos.</li>
              </ul>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <img
                src="/src/assets/images/factus.png" // Reemplaza con una captura de tu app
                alt="Captura de la aplicación"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tecnologías Usadas */}
      <section className="container py-16 mx-auto">
        <div className="text-center">
          <h2 className="mb-8 text-3xl font-bold text-green-900">Tecnologías Usadas</h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="p-6 text-center bg-white rounded-lg shadow-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" // Icono de React
                alt="React"
                className="h-12 mx-auto mb-4"
              />
              <p className="font-semibold text-green-900">React</p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" // Icono de Tailwind CSS
                alt="Tailwind CSS"
                className="h-12 mx-auto mb-4"
              />
              <p className="font-semibold text-green-900">Tailwind CSS</p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" // Icono de Node.js
                alt="Node.js"
                className="h-12 mx-auto mb-4"
              />
              <p className="font-semibold text-green-900">Node.js</p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" // Icono de MongoDB
                alt="MongoDB"
                className="h-12 mx-auto mb-4"
              />
              <p className="font-semibold text-green-900">MongoDB</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-16 text-white bg-green-600">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold">¿Quieres probar mi solución?

            
          </h2>
          <p className="mb-8 text-xl">Explora la aplicación y descubre cómo simplifica la gestión de facturas.</p>
          <Link
            to="/home"
            className="px-8 py-3 font-semibold text-green-600 transition duration-300 bg-white rounded-lg hover:bg-green-50"
          >
            Probar Ahora
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;