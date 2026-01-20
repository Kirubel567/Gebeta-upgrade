import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Reviews.css';

const Reviews = () => {
  const [activeFilter, setActiveFilter] = useState('on-campus');

  // MOCK DATA - Enhanced with more details for CustomerReview page
  const mockData = {
    onCampus: {
      business: {
        id: 'b1',
        name: 'STUDENT CENTER CAFETERIA',
        mainImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
        peekImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
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
      }
    },
    delivery: {
      business: {
        id: 'd1',
        name: 'ARRIVE DELIVERY',
        mainImage: 'https://images.unsplash.com/photo-1587476351660-e9fa4bb8b26c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D',
        peekImage: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDV8fHxlbnwwfHx8fHw%3D',
        rating: 3.5,
        reviews: 280,
        location: '5K, 4K, 6K DORMITORY',
        groupFriendly: false,
        hours: '8pm',
        category: 'Delivery',
        description: 'Fast food delivery service covering all dormitories on campus.',
        menuItems: ['Burgers', 'Fries', 'Wings', 'Pizza', 'Soft Drinks'],
        priceRange: '$$',
        phone: '(123) 456-7891',
        website: 'https://arrivedelivery.com'
      }
    },
    offCampus: {
      business: {
        id: 'o1',
        name: 'OASIS CAFE',
        mainImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D',
        peekImage: 'https://images.unsplash.com/photo-1692911634014-a1446191fb7c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDR8fHxlbnwwfHx8fHw%3D',
        rating: 4.5,
        reviews: 234,
        location: 'Infront of 5K DORMITORY Main GATE',
        groupFriendly: true,
        hours: '6pm',
        category: 'Off-Campus',
        description: 'Cozy cafe near campus with great coffee and snacks.',
        menuItems: ['Coffee', 'Tea', 'Pastries', 'Sandwiches', 'Desserts'],
        priceRange: '$$',
        phone: '(123) 456-7892',
        website: 'https://oasiscafe.com'
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fa-solid fa-star"></i>);
    }

    // Half star
    if (hasHalfStar) {
      stars.push(<i key="half" className="fa-solid fa-star-half-stroke"></i>);
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="fa-regular fa-star"></i>);
    }

    return stars;
  };

  const renderBusinessCard = (business) => {
    return (
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
          </div>
          {/* LINK TO CUSTOMER REVIEW PAGE */}
          <Link 
            to="/customer-review" 
            state={{ business: business }} // Pass business data via state
          >
            <button className="btn btn-primary" style={{ fontSize: '1rem', padding: '10px 25px' }}>
              Read Reviews
            </button>
          </Link>
        </div>
      </div>
    );
  };

  const renderPeekCard = (business) => (
    <div className="peek-card">
      {/* LINK TO CUSTOMER REVIEW PAGE */}
      <Link 
        to="/customer-review" 
        state={{ business: business }}
      >
        <div 
          className="peek-image"
          style={{ backgroundImage: `url('${business.peekImage}')` }}
        ></div>
        <div className="peek-arrow"><i className="fa-solid fa-angle-right"></i></div>
      </Link>
    </div>
  );

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <main>
      {/* Filter Bar */}
      <div className="container">
        <div className="filter-bar">
          <div 
            className={`filter-btn ${activeFilter === 'on-campus' ? 'active' : ''}`}
            onClick={() => handleFilterClick('on-campus')}
          >
            On-Campus
          </div>
          <div 
            className={`filter-btn ${activeFilter === 'delivery' ? 'active' : ''}`}
            onClick={() => handleFilterClick('delivery')}
          >
            Delivery
          </div>
          <div 
            className={`filter-btn ${activeFilter === 'off-campus' ? 'active' : ''}`}
            onClick={() => handleFilterClick('off-campus')}
          >
            Off-Campus
          </div>
          <div className="search-icon-btn">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
      </div>

      {/* On-Campus Section */}
      <div className="hero-grid-container">
        <h1 className="section-title">Trending</h1>
        <h2 className="section-title" style={{ fontSize: '1.5rem' }}>ON-CAMPUS</h2>
        <hr className="divider" />
        <div className="hero-grid">
          {renderBusinessCard(mockData.onCampus.business)}
          {renderPeekCard(mockData.onCampus.business)}
        </div>
      </div>

      {/* Delivery Section */}
      <div className="hero-grid-container">
        <h2 className="section-title" style={{ fontSize: '1.5rem' }}>DELIVERY</h2>
        <hr className="divider" />
        <div className="hero-grid">
          {renderBusinessCard(mockData.delivery.business)}
          {renderPeekCard(mockData.delivery.business)}
        </div>
      </div>

      {/* Off-Campus Section */}
      <div className="hero-grid-container">
        <h2 className="section-title" style={{ fontSize: '1.5rem' }}>OFF-CAMPUS</h2>
        <hr className="divider" />
        <div className="hero-grid">
          {renderBusinessCard(mockData.offCampus.business)}
          {renderPeekCard(mockData.offCampus.business)}
        </div>
      </div>
    </main>
  );
};

export default Reviews;