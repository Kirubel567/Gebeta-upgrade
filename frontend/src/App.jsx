import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import './styles/global.css';
import './styles/variable.css';
import { AuthProvider } from './contexts/authContext.jsx';
import ProtectedRoute from './components/protectedRoute.jsx';

// Import pages
import Home from './pages/Home/Home';
import About from './pages/About/about';
import Delivery from './pages/Delivery/Delivery';
import Reviews from './pages/Reviews/Reviews';
import CustomerReview from './pages/CustomerReview/CustomerReview';
import SubmitReview from './pages/SubmitReview/SubmitReview';
import Login from './pages/Login/Login';
import MenuItemDetail from './pages/MenuItemDetail/MenuItemDetail';
import UserProfile from './pages/UserProfile/UserProfile';
import Register from './pages/Register/Register';
import CompleteProfile from './pages/CompleteProfile/CompleteProfile';
import ChatWidget from './components/ChatWidget/ChatWidget';

function Layout() {
  const location = useLocation();
  // Hide header and footer on login, register, and completeprofile pages
  const hideHeaderFooter = 
    location.pathname === '/login' || 
    location.pathname.startsWith('/login/') ||
    location.pathname === '/register' ||
    location.pathname === '/completeprofile';

  return (
    <div className="app">
      {!hideHeaderFooter && <Navbar />}
      <main>
        <Routes>
          {/** Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/completeprofile" element={<CompleteProfile />} />

          {/** Protected Routes */}
          <Route path="/delivery" element={<ProtectedRoute><Delivery /></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
          <Route path="/customer-review/:id" element={<ProtectedRoute><CustomerReview /></ProtectedRoute>} />
          <Route path="/submit-review" element={<ProtectedRoute><SubmitReview /></ProtectedRoute>} />
          <Route path="/menu-item" element={<ProtectedRoute><MenuItemDetail /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
      {!hideHeaderFooter && <ChatWidget />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

export default App;