import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './Home.css';

const Home = () => {
  const [businesses, setBusinesses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch featured businesses AND reviews using API documentation structure
      const [businessesResponse, reviewsResponse] = await Promise.all([
        fetch('http://localhost:3000/businesses?isFeatured=true&_limit=6'),
        fetch('http://localhost:3000/reviews?_limit=6&_sort=createdAt&_order=desc')
      ]);
      
      if (!businessesResponse.ok || !reviewsResponse.ok) {
        throw new Error('Failed to fetch data from server');
      }
      
      const businessesData = await businessesResponse.json();
      const reviewsData = await reviewsResponse.json();
      
      setBusinesses(businessesData);
      setReviews(reviewsData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get businesses to display
  const businessesToDisplay = businesses.length > 0 
    ? businesses.slice(0, 6)
    : [
        // Fallback static data if API returns nothing
        { 
          id: "b1", 
          name: "DESTA CAFE", 
          description: "Great coffee and sandwiches!", 
          image: [{url: "./images/featured-1.png", isPrimary: true}],
          rating: {average: 4.5, count: 42}
        },
        { 
          id: "b2", 
          name: "123FASTFOOD", 
          description: "Fast delivery and tasty burgers", 
          image: [{url: "./images/featured-2.png", isPrimary: true}],
          rating: {average: 4.2, count: 31}
        },
        { 
          id: "b3", 
          name: "CHRISTINA CAFE", 
          description: "Best traditional food on campus", 
          image: [{url: "./images/featured-3.png", isPrimary: true}],
          rating: {average: 4.8, count: 56}
        },
        { 
          id: "b4", 
          name: "SLEEK DELIVERY", 
          description: "Reliable delivery service", 
          image: [{url: "./images/featured-4.png", isPrimary: true}],
          rating: {average: 4.3, count: 28}
        },
        { 
          id: "b5", 
          name: "DESTA CAFE", 
          description: "Perfect for quick lunches", 
          image: [{url: "./images/featured-5.png", isPrimary: true}],
          rating: {average: 4.0, count: 19}
        },
        { 
          id: "b6", 
          name: "DESTA CAFE", 
          description: "Friendly staff and great prices", 
          image: [{url: "./images/featured-1.png", isPrimary: true}],
          rating: {average: 4.6, count: 47}
        }
      ];

  // Get reviews for each business
  const getBusinessReview = (business, index) => {
    // Try to find a review for this business
    if (reviews.length > 0) {
      const businessReview = reviews.find(review => review.businessId === business.id);
      if (businessReview) {
        return {
          text: businessReview.body || businessReview.comment,
          author: `- ${businessReview.userName || 'Student'}`,
          rating: `⭐ ${businessReview.rating}`,
          isReal: true
        };
      }
      
      // If no specific review, use any review
      const anyReview = reviews[index % reviews.length];
      if (anyReview) {
        return {
          text: anyReview.body || anyReview.comment,
          author: `- ${anyReview.userName || 'Student'}`,
          rating: `⭐ ${anyReview.rating}`,
          isReal: true
        };
      }
    }
    
    // Fallback static review
    return {
      text: "I ORDERED FROM HERE LAST WEEK - GOT MY ORDER IN 10 MINUTES! SUPER FAST AND FRIENDLY SERVICE.",
      author: "- ANNA, 2ND YEAR",
      rating: "⭐ 4.5",
      isReal: false
    };
  };

  // Helper to get image URL from API structure
  const getImageUrl = (business) => {
    if (business.image && business.image.length > 0) {
      // Get primary image or first image
      const primaryImage = business.image.find(img => img.isPrimary);
      return primaryImage ? primaryImage.url : business.image[0].url;
    }
    // Fallback based on index if no image
    return "./images/default.png";
  };

  // Helper to get rating from API structure
  const getRating = (business) => {
    if (business.rating && business.rating.average) {
      return business.rating.average;
    }
    return 0;
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      {/* Hero Section */}
<section style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '60px 5%',
  minHeight: '80vh',
  maxWidth: '1200px',
  margin: '0 auto',
  gap: '60px',
  backgroundColor: '#050A30',
  flexDirection: 'row'
}}>
  {/* Image on LEFT */}
  <div style={{
    flex: 1,
    maxWidth: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <img 
      src="https://plus.unsplash.com/premium_photo-1695297516798-d275bdf26575?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MjAxN3wwfDF8c2VhcmNofDV8fGV0aGlvcGlhbiUyMGZvb2R8ZW58MHx8fHwxNzY4OTA0NTk3fDA&ixlib=rb-4.1.0&q=85&q=85&fmt=jpg&crop=entropy&cs=tinysrgb&w=450" 
      alt="Delicious campus food"
      style={{
        width: '100%',
        maxWidth: '500px',
        height: '500px',
        borderRadius: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}
    />
  </div>
  
  {/* Content on RIGHT */}
  <div style={{
    flex: 1,
    maxWidth: '50%'
  }}>
    <h1 style={{
      fontFamily: "'Poppins', sans-serif",
      fontSize: '40px',
      fontWeight: '800',
      lineHeight: '1.2',
      marginBottom: '20px',
      color: '#ffffff'
    }}>
      DISCOVER THE BEST<br />EATS IN & AROUND<br />CAMPUS
    </h1>
    <p style={{
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      color: '#cccccc',
      marginBottom: '40px',
      maxWidth: '500px'
    }}>
      From hidden cafeteria gems to top-rated street spots and student-run delivery
      startups, explore every bite your university has to offer.
    </p>
    <div style={{ display: 'flex', gap: '20px' }}>
  <Link to="/reviews">
    <Button variant="primary">Explore</Button>
  </Link>
  <Link to="/submit-review">
    <Button variant="outline">Rate</Button>
  </Link>
</div>
  </div>
</section>
<hr style={{
  border: 'none',
  height: '1px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  margin: '0'
}} />
<hr className="divider" />

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <img src="./images/icon1.png" alt="On-Campus Meals" />
            <h3>ON-CAMPUS<br />MEALS</h3>
            <p>Discover & rate the food available right inside campus.</p>
          </div>
          <div className="feature-card highlight">
            <img src="./images/icon2.png" alt="Delivery Options" />
            <h3>DELIVERY<br />OPTIONS</h3>
            <p>Check delivery time, service quality, fees, and which meals are worth ordering according to student reviews.</p>
          </div>
          <div className="feature-card">
            <img src="./images/icon3.png" alt="Off-Campus Restaurants" />
            <h3>OFF-CAMPUS RESTAURANTS</h3>
            <p>Explore the best nearby places to eat around your campus.</p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Featured Businesses Section */}
      <section className="featured-businesses">
        <h2 className="section-title">FEATURED BUSINESSES</h2>
        
        {loading ? (
          <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-color)'}}>
            Loading featured businesses...
          </div>
        ) : error ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#ff4444'}}>
            Error loading businesses. Please make sure JSON Server is running on port 3000.
          </div>
        ) : (
          <div className="businesses-grid">
            {businessesToDisplay.map((business, index) => {
              const review = getBusinessReview(business, index);
              const imageUrl = getImageUrl(business);
              const rating = getRating(business);
              
              return (
                <div key={business.id || index} className="business-card">
                  <div className="business-image-wrapper">
                    <img 
                      src={imageUrl} 
                      alt={business.name} 
                      onError={(e) => {
                        e.target.src = `./images/featured-${(index % 5) + 1}.png`;
                      }}
                    />
                    <h3 className="business-overlay-title">{business.name.toUpperCase()}</h3>
                  </div>
                  <p className="business-review">
                    "{review.text.substring(0, 100)}{review.text.length > 100 ? '...' : ''}"
                  </p>
                  <p className="review-author">
                    {review.rating} • {review.author}
                  </p>
                  <Button variant="outline">See More</Button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;