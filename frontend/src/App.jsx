<<<<<<< HEAD
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
  // Hide header and footer on login page
  const hideHeaderFooter = location.pathname === '/login' || location.pathname.startsWith('/login/');

  return (
    <div className="app">
      {!hideHeaderFooter && <Navbar />}
      <main>
        
          <Routes>
          {/** Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route path="/about" element={<About />} />

          {/** Protected Routes */}
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/customer-review/:id" element={<ProtectedRoute><CustomerReview /></ProtectedRoute>} />
          <Route path="/submit-review" element={<ProtectedRoute><SubmitReview /></ProtectedRoute>} />
          
          <Route path="/menu-item" element={<MenuItemDetail />} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          
          <Route path="/register" element={<Register />} />
          <Route path="/completeprofile" element={<CompleteProfile />} />
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
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Pages
import Home from './pages/Home/Home';
import ReviewsDelivery from './pages/ReviewsDelivery/ReviewsDelivery';
import SubmitReviews from './pages/SubmitReviews/SubmitReviews';
import About from './pages/About/About';
import CustomerReview from './pages/CustomerReview/CustomerReview';
import NotFound from './pages/NotFound/NotFound';

// Import global styles
import './styles/globals.css';

const App = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />
          
          {/* Reviews Page */}
          <Route path="/reviews" element={<ReviewsDelivery />} />
          
          {/* Delivery Page */}
          <Route path="/delivery" element={<ReviewsDelivery isDeliveryPage={true} />} />
          
          {/* Submit Review Page */}
          <Route path="/submit-review" element={<SubmitReviews />} />
          
          {/* Submit Review for Specific Business */}
          <Route path="/submit-review/:businessId" element={<SubmitReviews />} />
          
          {/* About Page */}
          <Route path="/about" element={<About />} />
          
          {/* Business Detail Page */}
          <Route path="/business/:id" element={<CustomerReview />} />
          
          {/* Legacy HTML routes redirect */}
          <Route path="/customerReview.html" element={<Navigate to="/business/b1" replace />} />
          <Route path="/reviews.html" element={<Navigate to="/reviews" replace />} />
          <Route path="/delivery.html" element={<Navigate to="/delivery" replace />} />
          <Route path="/submitReviews.html" element={<Navigate to="/submit-review" replace />} />
          <Route path="/about.html" element={<Navigate to="/about" replace />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

>>>>>>> adfaa71b4e82d691d181705af5e9a35d006e85c0
export default App;