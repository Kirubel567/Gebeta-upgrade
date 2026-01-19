// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import MainLayout from './layouts/MainLayout';

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
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;