// src/pages/CustomerReview/CustomerReview.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './CustomerReview.css';

const CustomerReview = () => {
  const location = useLocation();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get business data from state or use fallback
  useEffect(() => {
    if (location.state?.business) {
      setBusiness(location.state.business);
      setLoading(false);
    } else {
      // Fallback: You could fetch business data based on ID from params
      // For now, use a default business
      setBusiness({
        id: 'b1',
        name: 'STUDENT CENTER CAFETERIA',
        mainImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
        rating: 4.5,
        reviews: 234,
        location: '5K DORMITORY',
        groupFriendly: true,
        hours: '6pm',
        category: 'On-Campus',
        description: 'The main cafeteria serving students with a variety of meals throughout the day.',
        menuItems: ['Pizza', 'Pasta', 'Salads', 'Burgers', 'Daily Specials'],
        priceRange: '$',
        phone: '(123) 456-7890',
        website: 'https://university.edu/cafeteria'
      });
      setLoading(false);
    }
  }, [location]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fa-solid fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fa-solid fa-star-half-stroke"></i>);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="fa-regular fa-star"></i>);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading business details...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="error-container">
        <p>No business data found.</p>
        <Link to="/reviews">
          <button className="btn btn-primary">Back to Reviews</button>
        </Link>
      </div>
    );
  }

  // Mock reviews data
  const mockReviews = [
    {
      id: 1,
      name: 'SELAM TADESSE',
      year: '4th Year',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      review: '"I HAD AN AMAZING EXPERIENCE AT THIS RESTAURANT! THE PLACE WAS CLEAN, BEAUTIFULLY DECORATED, AND THE STAFF WERE INCREDIBLY POLITE. I ORDERED THE BEEF TIBS WITH INJERA, AND IT WAS ABSOLUTELY PERFECT."'
    },
    {
      id: 2,
      name: 'Miheret',
      year: 'CC, AAU',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      review: '"I HAD AN AMAZING EXPERIENCE AT THIS RESTAURANT! THE PLACE WAS CLEAN, BEAUTIFULLY DECORATED, AND THE STAFF WERE INCREDIBLY POLITE. TASTED FRESH AND NATURAL. NOT SUGARY LIKE OTHER PLACES."'
    },
    {
      id: 3,
      name: 'Kenean Eshetu',
      year: 'Freshman, AAU',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
      review: '"I HAD AN AMAZING EXPERIENCE AT THIS RESTAURANT! THE PLACE WAS CLEAN, BEAUTIFULLY DECORATED, AND THE STAFF WERE INCREDIBLY POLITE. I ORDERED THE BEEF TIBS WITH INJERA."'
    }
  ];

  // Mock menu items
  const mockMenuItems = [
    { id: 1, name: 'BEYAYNET', price: '120 ETB', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=400&auto=format&fit=crop' },
    { id: 2, name: 'SPAGHETTI', price: '120 ETB', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=400&auto=format&fit=crop' },
    { id: 3, name: 'BEYAYNET', price: '120 ETB', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=400&auto=format&fit=crop' },
    { id: 4, name: 'BEYAYNET', price: '120 ETB', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop' }
  ];

  return (
    <main>
      {/* Business Header Section */}
      <section className="container" style={{ padding: '40px 20px' }}>
        <h2 className="section-title">{business.category}</h2>

        <div className="hero-grid">
          <div className="main-card">
            <div 
              className="main-card-image"
              style={{ backgroundImage: `url('${business.mainImage}')` }}
            ></div>
            <div className="main-card-content">
              <h3>{business.name}</h3>
              <div className="rating-stars">
                {renderStars(business.rating)}
                <span>{business.rating.toFixed(1)} ({business.reviews} REVIEWS)</span>
              </div>
              <div className="card-details">
                <div><i className="fa-solid fa-location-dot"></i> {business.location}</div>
                <div>
                  {business.groupFriendly && (
                    <><i className="fa-solid fa-users"></i> Large Group Friendly &nbsp; &nbsp; &nbsp;</>
                  )}
                  <i className="fa-solid fa-calendar"></i> Open Until {business.hours}
                </div>
                {business.phone && (
                  <div><i className="fa-solid fa-phone"></i> {business.phone}</div>
                )}
                {business.website && (
                  <div><i className="fa-solid fa-globe"></i> {business.website}</div>
                )}
                <div><i className="fa-solid fa-tag"></i> Price Range: {business.priceRange}</div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <Link to="/submit-review">
                  <button className="btn btn-primary">Write a Review</button>
                </Link>
              </div>
            </div>
          </div>

          <div className="peek-card">
            <div 
              className="peek-image"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400&auto=format&fit=crop')` }}
            ></div>
            <div 
              className="peek-image"
              style={{ 
                backgroundImage: `url('https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=400&auto=format&fit=crop')`,
                marginTop: '10px'
              }}
            ></div>
          </div>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <Link to="/submit-review">
            <button className="btn btn-primary">Review</button>
          </Link>
        </div>
      </section>

      <hr className="divider" />

      {/* Menu Section */}
      <section className="container" style={{ padding: '40px 20px' }}>
        <h2 className="section-title">MENU</h2>
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '20px' }}>TOP</h3>

        <div className="businesses-grid">
          {mockMenuItems.map((item) => (
            <div key={item.id} className="business-card">
              <div className="business-image-wrapper">
                <img src={item.image} alt={item.name} />
                <div className="price-tag">{item.price}</div>
              </div>
              <h4 style={{ margin: '10px 0' }}>{item.name}</h4>
              <div className="rating-stars" style={{ fontSize: '0.8rem', marginBottom: '10px' }}>
                {renderStars(4.5)}
                <span>4.5 (234)</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button className="btn btn-outline">Full Menu</button>
        </div>
      </section>

      <hr className="divider" />

      {/* Reviews Section */}
      <section className="container" style={{ padding: '40px 20px' }}>
        <h2 className="section-title">CUSTOMER REVIEWS</h2>

        <div className="reviews-list">
          {mockReviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <img className="reviewer-img" src={review.image} alt={review.name} />
                <div className="reviewer-info">
                  <h4>{review.name}</h4>
                  <p>{review.year}</p>
                  <div className="rating-stars" style={{ fontSize: '0.8rem', margin: 0 }}>
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              <p className="review-body">{review.review}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default CustomerReview;