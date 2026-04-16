import './App.css'
import './styles/Cart.css'
import './styles/PageContent.css'
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
import { AudioPlayerProvider, useAudioPlayer } from './components/AudioPlayerContext'
import AudioPlayer from './components/AudioPlayer'

const NotFound = () => (
  <div className="not-found">
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <Link to="/" className="cta-button primary">Return to Home</Link>
  </div>
);

function AppInner() {
  const { currentBeat, isPlaying, togglePlayPause, stopBeat } = useAudioPlayer();

  return (
    <div className="app-container" style={{ paddingBottom: currentBeat ? 'var(--audio-player-height, 72px)' : undefined }}>
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
      <AudioPlayer
        currentBeat={currentBeat}
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onEnded={stopBeat}
      />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AudioPlayerProvider>
        <AppInner />
      </AudioPlayerProvider>
    </CartProvider>
  )
}

export default App
