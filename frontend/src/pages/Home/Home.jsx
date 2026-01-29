import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { businessService, reviewService } from '../../api/apiService';
import { handleApiError } from '../../utils/errorHandler';
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
      setLoading(true);
      setError(null);

      // 1. Fetch Businesses
      const businessesResponse = await businessService.getAll({ limit: 6 });

      // Axios/Standard Service check: 
      // Most API services return { success: true, data: [...] }
      if (!businessesResponse || !businessesResponse.data || businessesResponse.data.length === 0) {
        setBusinesses([]);
        setLoading(false);
        return;
      }

      const fetchedBusinesses = businessesResponse.data;
      setBusinesses(fetchedBusinesses);

      // 2. Fetch Reviews 
      // Use _id (standard for MongoDB) and add a safety check
      const firstBusinessId = fetchedBusinesses[0]._id || fetchedBusinesses[0].id;

      if (firstBusinessId) {
        const reviewsResponse = await reviewService.getByBusinessId(firstBusinessId);
        setReviews(reviewsResponse.data || []);
      }

    } catch (err) {
      // This catches 404s, 500s, and Network Errors
      handleApiError(err, setError);
      console.error('Gebeta Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // // Get businesses to display
  // const businessesToDisplay = businesses.length > 0 
  //   ? businesses.slice(0, 6)
  //   : [
  //       // Fallback static data if API returns nothing
  //       { 
  //         id: "b1", 
  //         name: "DESTA CAFE", 
  //         description: "Great coffee and sandwiches!", 
  //         image: [{url: "./images/featured-1.png", isPrimary: true}],
  //         rating: {average: 4.5, count: 42}
  //       },
  //       { 
  //         id: "b2", 
  //         name: "123FASTFOOD", 
  //         description: "Fast delivery and tasty burgers", 
  //         image: [{url: "./images/featured-2.png", isPrimary: true}],
  //         rating: {average: 4.2, count: 31}
  //       },
  //       { 
  //         id: "b3", 
  //         name: "CHRISTINA CAFE", 
  //         description: "Best traditional food on campus", 
  //         image: [{url: "./images/featured-3.png", isPrimary: true}],
  //         rating: {average: 4.8, count: 56}
  //       },
  //       { 
  //         id: "b4", 
  //         name: "SLEEK DELIVERY", 
  //         description: "Reliable delivery service", 
  //         image: [{url: "./images/featured-4.png", isPrimary: true}],
  //         rating: {average: 4.3, count: 28}
  //       },
  //       { 
  //         id: "b5", 
  //         name: "DESTA CAFE", 
  //         description: "Perfect for quick lunches", 
  //         image: [{url: "./images/featured-5.png", isPrimary: true}],
  //         rating: {average: 4.0, count: 19}
  //       },
  //       { 
  //         id: "b6", 
  //         name: "DESTA CAFE", 
  //         description: "Friendly staff and great prices", 
  //         image: [{url: "./images/featured-1.png", isPrimary: true}],
  //         rating: {average: 4.6, count: 47}
  //       }
  //     ];

  // // Get reviews for each business
  // const getBusinessReview = (business, index) => {
  //   // Try to find a review for this business
  //   if (reviews.length > 0) {
  //     const businessReview = reviews.find(review => review.businessId === business.id);
  //     if (businessReview) {
  //       return {
  //         text: businessReview.body || businessReview.comment,
  //         author: `- ${businessReview.userName || 'Student'}`,
  //         rating: `⭐ ${businessReview.rating}`,
  //         isReal: true
  //       };
  //     }

  //     // If no specific review, use any review
  //     const anyReview = reviews[index % reviews.length];
  //     if (anyReview) {
  //       return {
  //         text: anyReview.body || anyReview.comment,
  //         author: `- ${anyReview.userName || 'Student'}`,
  //         rating: `⭐ ${anyReview.rating}`,
  //         isReal: true
  //       };
  //     }
  //   }

  //   // Fallback static review
  //   return {
  //     text: "I ORDERED FROM HERE LAST WEEK - GOT MY ORDER IN 10 MINUTES! SUPER FAST AND FRIENDLY SERVICE.",
  //     author: "- ANNA, 2ND YEAR",
  //     rating: "⭐ 4.5",
  //     isReal: false
  //   };
  // };

  // Helper to get image URL from API structure
  const getImageUrl = (business) => {
    if (business.images && business.images.length > 0) {
      const primaryImage = business.images.find(img => img.isPrimary) || business.images[0];
      return primaryImage.url;
    }
    // Fallback to a placeholder if no image exists
    return "https://via.placeholder.com/400x300?text=Gebeta+Food";
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
            src="https://plus.unsplash.com/premium_photo-1676738356307-bc7d58a914a5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D"
            alt="Delicious campus food"
            style={{
              width: '100%',
              maxWidth: '500px',
              height: '400px',
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
          <div className="loading-state">Finding the best AAU eats...</div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <Button onClick={fetchData} variant="outline">Try Again</Button>
          </div>
        ) : businesses.length === 0 ? (
          <div className="error-state">
            <p>No businesses found. Check back soon!</p>
          </div>
        ) : (
          <div className="businesses-grid">
            {businesses.slice(0, 6).map((business, index) => {
              // Match reviews to businesses or fallback
              const businessReview = reviews.find(r => r.business === business._id) || reviews[index % Math.max(reviews.length, 1)];
              const imageUrl = business.images && business.images.length > 0
                ? business.images[0].url
                : `./images/featured-${(index % 5) + 1}.png`;
              const rating = businessReview?.rating || business.rating?.average || 0;
              const reviewText = businessReview?.body || "No reviews available";
              const reviewAuthor = businessReview?.user?.name || "Anonymous";

              return (
                <div key={business._id || index} className="business-card">
                  <div className="business-image-wrapper">
                    <img
                      src={imageUrl}
                      alt={business.name}
                      onError={(e) => {
                        e.target.src = `./images/featured-${(index % 5) + 1}.png`;
                      }}
                      style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                    />
                    <h3 className="business-overlay-title">{business.name.toUpperCase()}</h3>
                  </div>
                  <p className="business-review">
                    "{reviewText.substring(0, 100)}{reviewText.length > 100 ? '...' : ''}"
                  </p>
                  <p className="review-author">
                    ⭐ {rating} • {reviewAuthor}
                  </p>
                  <Link to={`/business/${business._id}`}>
                    <Button variant="outline">See More</Button>
                  </Link>
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