// src/pages/Delivery/Delivery.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import mockData from '../../Mock-data/mock-data.json';
import './Delivery.css';

const Delivery = () => {
  const deliveryData = mockData.delivery;
  const deliveryServices = deliveryData.deliveryServices;
  const [activeFilter, setActiveFilter] = useState('Fast Deliver');
  
  const filters = ['Fast Deliver', 'Low Delivery Fee', 'Top Rated'];

  return (
    <div className="delivery-page">
      {/* Filter Bar */}
      <div className="container" style={{ marginTop: '40px' }}>
        <div className="filter-bar">
          {filters.map(filter => (
            <div 
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </div>
          ))}
          <div className="search-icon-btn">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
      </div>

      <hr className="divider" />

      <h1 className="section-title" style={{ marginLeft: '45px' }}>Delivery</h1>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-image">
          <img
            src="./assets/images/delivery/deliveryCar.png"
            alt="Delivery Car"
          />
        </div>
        <div className="hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
            Delivery Options Around Campus
          </h1>
          <p className="hero-description">
            Discover every delivery service available around campus - rated,
            reviewed, and compared for you.
          </p>
          {/* button container */}
          <div className="hero-buttons">
            <button className="btn btn-primary">Order</button>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Top Delivery Services Section */}
      <section className="container" style={{ padding: '40px 20px' }}>
        <h1 className="section-title">Top Delivery Services</h1>
        <div className="businesses-grid">
          {deliveryServices.map((service, index) => (
            <div 
              key={service.id} 
              className={`business-card ${index === deliveryServices.length - 1 ? 'special' : ''}`} 
              style={{ padding: '30px' }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '20px' }}>
                {service.name}
              </h2>
              
              {/* Star Rating */}
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => {
                  if (i < Math.floor(service.rating)) {
                    return <i key={i} className="fa-solid fa-star"></i>;
                  } else if (i === Math.floor(service.rating) && service.rating % 1 >= 0.5) {
                    return <i key={i} className="fa-solid fa-star-half-stroke"></i>;
                  } else {
                    return <i key={i} className="fa-regular fa-star"></i>;
                  }
                })}
                <span>{service.rating} (Reviews)</span>
              </div>

              {/* Service Details */}
              <div className="card-details">
                <div><i className="fa-solid fa-location-dot"></i> {service.servicedAreas.join(', ')}</div>
                <div><i className="fa-solid fa-bolt"></i> {service.averageTime} Average</div>
                <div><i className="fa-solid fa-tag"></i> {service.deliveryFee} Fee</div>
              </div>

              {/* Button */}
              <button className="btn btn-outline" style={{ marginTop: '20px' }}>
                Explore
              </button>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* Reviews Section */}
      <section className="container" style={{ padding: '40px 20px' }}>
        <h1 className="section-title">Reviews</h1>
        {/* grid container */}
        <div className="reviews-list">
          {/* Using reviews from mock data or create delivery-specific reviews */}
          {deliveryServices.slice(0, 2).map((service) => (
            <div key={service.id} className="review-item">
              <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '15px' }}>
                {service.name}
              </h2>
              {/* image and name */}
              <div className="review-header">
                {/* img - using a placeholder or service logo */}
                <img
                  className="reviewer-img"
                  src={service.logo || "./assets/images/delivery/hana.png"}
                  alt={service.name}
                />
                {/* content container */}
                <div className="reviewer-info">
                  <h4>Sample Reviewer</h4>
                  <p>AAU Student</p>
                  {/* star container */}
                  <div className="rating-stars" style={{ fontSize: '0.8rem', margin: 0 }}>
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </div>
                </div>
              </div>
              <p className="review-body">
                "{service.description}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Delivery;