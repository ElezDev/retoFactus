import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/Home/LandingPage';
import HomePage from './components/Home/HomePage';
import InvoicePage from './components/FacturasComponent/InvoicePage';
import AboutPage from './components/Home/AboutPage';
import Footer from './components/Footer';
import Header from './components/Header';


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/invoice" element={<InvoicePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;