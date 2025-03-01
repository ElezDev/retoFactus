import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="p-4 text-white bg-green-600 shadow-lg">
      <div className="container flex items-center justify-between mx-auto">
        <h1 className="text-2xl font-bold">Gestión de Facturas Electrónicas</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/home" className="hover:text-green-200">Inicio</Link>
            </li>
            <li>
              <Link to="/invoice" className="hover:text-green-200">Facturas</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-green-200">Acerca de</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;