import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import React from 'react';
import Footer from './components/footer/footer';
import './styles/global.css';
import './styles/variable.css';
import { AuthProvider } from './contexts/authContext.jsx';
import ProtectedRoute from './components/protectedRoute.jsx';

// // Layout
// import MainLayout from './layouts/MainLayout';

// Import pages
import Home from './pages/Home/Home';
import About from './pages/About/About.jsx';
import Delivery from './pages/Delivery/Delivery';
import Reviews from './pages/Reviews/Reviews';
import CustomerReview from './pages/CustomerReview/CustomerReview';
import SubmitReview from './pages/SubmitReview/SubmitReview';
import Login from './pages/Login/Login';
import MenuItemDetail from './pages/MenuItemDetail/MenuItemDetail';
import UserProfile from './pages/UserProfile/UserProfile';
import Register from './pages/Register/Register';
import CompleteProfile from './pages/CompleteProfile/CompleteProfile';
import Register from './pages/Register/Register';
import CompleteProfile from './pages/CompleteProfile/CompleteProfile';
import ChatWidget from './components/ChatWidget/ChatWidget';
import ReviewsDelivery from './pages/ReviewsDelivery/ReviewsDelivery';
import SubmitReviews from './pages/SubmitReviews/SubmitReviews';
import NotFound from './pages/NotFound/NotFound';

// Import global styles
import './styles/globals.css';

function Layout() {
  const location = useLocation();
  // Hide header and footer on login, register, and completeprofile pages
  const hideHeaderFooter = 
    location.pathname === '/login' || 
    location.pathname.startsWith('/login/') ||
    location.pathname === '/register' ||
    location.pathname === '/completeprofile';
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
          <Route path="/register" element={<Register />} />
          <Route path="/completeprofile" element={<CompleteProfile />} />

          {/** Protected Routes */}
          <Route path="/delivery" element={<ProtectedRoute><Delivery /></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
          <Route path="/delivery" element={<ProtectedRoute><Delivery /></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
          <Route path="/customer-review/:id" element={<ProtectedRoute><CustomerReview /></ProtectedRoute>} />
          <Route path="/submit-review" element={<ProtectedRoute><SubmitReview /></ProtectedRoute>} />
          <Route path="/menu-item" element={<ProtectedRoute><MenuItemDetail /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          
          <Route path="/register" element={<Register />} />
          <Route path="/completeprofile" element={<CompleteProfile />} />
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
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
export default App;// src/App.jsx




// // Pages




// const App = () => {
//   return (
//     <Router>
//       <MainLayout>
//         <Routes>
//           {/* Home Page */}
//           <Route path="/" element={<Home />} />
          
//           {/* Reviews Page */}
//           <Route path="/reviews" element={<ReviewsDelivery />} />
          
//           {/* Delivery Page */}
//           <Route path="/delivery" element={<ReviewsDelivery isDeliveryPage={true} />} />
          
//           {/* Submit Review Page */}
//           <Route path="/submit-review" element={<SubmitReviews />} />
          
//           {/* Submit Review for Specific Business */}
//           <Route path="/submit-review/:businessId" element={<SubmitReviews />} />
          
//           {/* About Page */}
//           <Route path="/about" element={<About />} />
          
//           {/* Business Detail Page */}
//           <Route path="/business/:id" element={<CustomerReview />} />
          
//           {/* Legacy HTML routes redirect */}
//           <Route path="/customerReview.html" element={<Navigate to="/business/b1" replace />} />
//           <Route path="/reviews.html" element={<Navigate to="/reviews" replace />} />
//           <Route path="/delivery.html" element={<Navigate to="/delivery" replace />} />
//           <Route path="/submitReviews.html" element={<Navigate to="/submit-review" replace />} />
//           <Route path="/about.html" element={<Navigate to="/about" replace />} />
//           <Route path="/index.html" element={<Navigate to="/" replace />} />
          
          
//         </Routes>
//       </MainLayout>
//     </Router>
//   );
// };

// export default App;