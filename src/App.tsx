import './App.css'
import './styles/Cart.css'
import Home from './pages/Home.tsx'
import { Routes, Route } from 'react-router-dom'
import About from './pages/About.tsx'
import Beats from './pages/Beats.tsx'
import Services from './pages/Services.tsx'
import Booking from './pages/Booking.tsx'
import Success from './pages/Success.tsx'
import FeaturedWork from './pages/FeaturedWork.tsx'
import Admin from './pages/Admin.tsx'
import NavBar from './components/NavBar.tsx'
import Footer from './components/Footer.tsx'
import { CartProvider } from './components/cart/CartProvider'
import CartDrawer from './components/cart/CartDrawer'


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
            <Route path="/booking" element={<Booking />} />
            <Route path="/featured-work" element={<FeaturedWork />} />
            <Route path="/success" element={<Success />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}

export default App
