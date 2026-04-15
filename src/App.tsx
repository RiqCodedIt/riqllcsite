import './App.css'
import './styles/Cart.css'
import Home from './pages/Home.tsx'
import { Routes, Route, Link } from 'react-router-dom'
import About from './pages/About.tsx'
import Beats from './pages/Beats.tsx'
import Services from './pages/Services.tsx'
import Success from './pages/Success.tsx'
import FeaturedWork from './pages/FeaturedWork.tsx'
import Admin from './pages/Admin.tsx'
import NavBar from './components/NavBar.tsx'
import Footer from './components/Footer.tsx'
import { CartProvider } from './components/cart/CartProvider'
import CartDrawer from './components/cart/CartDrawer'

const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
    <h2>Page Not Found</h2>
    <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>
      The page you're looking for doesn't exist.
    </p>
    <Link to="/" style={{ color: 'var(--accent-primary)' }}>Return to Home</Link>
  </div>
);

function App() {
  return (
    <CartProvider>
      <div className="app-container">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/beats" element={<Beats />} />
            <Route path="/services" element={<Services />} />
            <Route path="/featured-work" element={<FeaturedWork />} />
            <Route path="/success" element={<Success />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}

export default App
