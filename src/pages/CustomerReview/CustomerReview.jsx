import React, { useState, useEffect } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import './CustomerReview.css';

const CustomerReview = () => {
  const location = useLocation();
  const params = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Get business data from state or use fallback
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        // If business data is passed via state, use it
        if (location.state?.business) {
          setBusiness(location.state.business);
          setLoading(false);
        } 
        // Otherwise, try to fetch from API
        else if (params.id) {
          // API Endpoint: GET /api/businesses/:id
          const response = await fetch(`/api/businesses/${params.id}`);
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setBusiness(data.data);
            } else {
              throw new Error('Failed to fetch business data');
            }
          } else {
            // Fallback to mock data
            console.log('API call failed, using mock data');
            setBusiness(getFallbackBusiness(params.id));
          }
        } else {
          // No ID or state, use default mock data
          setBusiness(getFallbackBusiness('b1'));
        }
      } catch (error) {
        console.error('Error fetching business:', error);
        setBusiness(getFallbackBusiness('b1'));
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        // API Endpoint: GET /api/reviews/business/:businessId
        const businessId = location.state?.business?.id || params.id || 'b1';
        const response = await fetch(`/api/reviews/business/${businessId}?limit=5&sort=newest`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setReviews(data.data);
            // Initialize expanded state for reviews
            const initialExpanded = {};
            data.data.forEach(review => {
              initialExpanded[review.id] = false;
            });
            setExpandedReviews(initialExpanded);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Use mock reviews as fallback
        setReviews(mockReviews);
        // Initialize expanded state for mock reviews
        const initialExpanded = {};
        mockReviews.forEach(review => {
          initialExpanded[review.id] = false;
        });
        setExpandedReviews(initialExpanded);
      }
    };

    const fetchMenuItems = async () => {
      try {
        // API Endpoint: GET /api/menu/:businessId
        const businessId = location.state?.business?.id || params.id || 'b1';
        const response = await fetch(`/api/menu/${businessId}?limit=4`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMenuItems(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        // Use mock menu items as fallback
        setMenuItems(mockMenuItems);
      }
    };

    fetchBusinessData();
    fetchReviews();
    fetchMenuItems();
  }, [location, params.id]);

  const getFallbackBusiness = (id) => {
    const businesses = {
      'b1': {
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
      },
      'd1': {
        id: 'd1',
        name: 'ARRIVE DELIVERY',
        mainImage: 'https://images.unsplash.com/photo-1587476351660-e9fa4bb8b26c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D',
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
      },
      'o1': {
        id: 'o1',
        name: 'OASIS CAFE',
        mainImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D',
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
    };
    return businesses[id] || businesses['b1'];
  };

  // Mock data as fallback with longer reviews
  const mockReviews = [
    {
      id: 1,
      name: 'SELAM TADESSE',
      year: '4th Year',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      review: '"I HAD AN AMAZING EXPERIENCE AT THIS RESTAURANT! THE PLACE WAS CLEAN, BEAUTIFULLY DECORATED, AND THE STAFF WERE INCREDIBLY POLITE. I ORDERED THE BEEF TIBS WITH INJERA, AND IT WAS ABSOLUTELY PERFECT. THE FLAVORS WERE AUTHENTIC AND THE PORTION WAS VERY GENEROUS. I WILL DEFINITELY BE COMING BACK WITH MY FRIENDS NEXT WEEK!"'
    },
    {
      id: 2,
      name: 'Miheret',
      year: 'CC, AAU',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      review: '"I HAD AN AMAZING EXPERIENCE AT THIS RESTAURANT! THE PLACE WAS CLEAN, BEAUTIFULLY DECORATED, AND THE STAFF WERE INCREDIBLY POLITE. TASTED FRESH AND NATURAL. NOT SUGARY LIKE OTHER PLACES. THE ATMOSPHERE WAS VERY WELCOMING AND THE PRICES ARE REASONABLE FOR STUDENTS."'
    },
    {
      id: 3,
      name: 'Kenean Eshetu',
      year: 'Freshman, AAU',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
      review: '"I HAD AN AMAZING EXPERIENCE AT THIS RESTAURANT! THE PLACE WAS CLEAN, BEAUTIFULLY DECORATED, AND THE STAFF WERE INCREDIBLY POLITE. I ORDERED THE BEEF TIBS WITH INJERA AND IT WAS SERVED HOT AND FRESH. THE SERVICE WAS QUICK AND EFFICIENT EVEN DURING PEAK HOURS."'
    },
    {
      id: 4,
      name: 'Beza Tadesse',
      year: '3rd Year',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=200&auto=format&fit=crop',
      review: '"GOOD FOOD OVERALL, BUT THE SERVICE CAN BE SLOW DURING PEAK HOURS. THE MANGO JUICE WAS EXCELLENT - FRESH AND NOT TOO SWEET. THE SEATING AREA IS COMFORTABLE AND CLEAN. I RECOMMEND COMING DURING OFF-PEAK HOURS FOR BETTER SERVICE."'
    }
  ];

  const mockMenuItems = [
    { id: 1, name: 'BEYAYNET', price: '120 ETB', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=400&auto=format&fit=crop' },
    { id: 2, name: 'SPAGHETTI', price: '120 ETB', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=400&auto=format&fit=crop' },
    { id: 3, name: 'BEYAYNET', price: '120 ETB', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=400&auto=format&fit=crop' },
    { id: 4, name: 'BEYAYNET', price: '120 ETB', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop' }
  ];

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

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleLoadMoreReviews = async () => {
    try {
      // API Endpoint: GET /api/reviews/business/:businessId with pagination
      const businessId = business?.id || params.id || 'b1';
      const currentPage = Math.ceil(reviews.length / 3) + 1;
      const response = await fetch(`/api/reviews/business/${businessId}?page=${currentPage}&limit=2&sort=newest`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setReviews(prev => [...prev, ...data.data]);
          // Initialize expanded state for new reviews
          const newExpanded = {};
          data.data.forEach(review => {
            newExpanded[review.id] = false;
          });
          setExpandedReviews(prev => ({ ...prev, ...newExpanded }));
        } else {
          // If no more reviews from API, add mock reviews
          const additionalMockReviews = [
            {
              id: 5,
              name: 'Dawit Assefa',
              year: '2nd Year',
              rating: 5,
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
              review: '"BEST BEYAYNET IN CAMPUS! THE VARIETY OF VEGETABLES IS IMPRESSIVE AND EVERYTHING TASTES FRESH. THE INJERA IS SOFT AND PERFECTLY FERMENTED. VERY AFFORDABLE FOR STUDENTS. THE STAFF ARE FRIENDLY AND ALWAYS SMILING."'
            },
            {
              id: 6,
              name: 'Hana Solomon',
              year: '1st Year',
              rating: 4,
              image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
              review: '"GREAT PLACE FOR STUDENTS. THE FOOD IS DELICIOUS AND THE PRICES ARE STUDENT-FRIENDLY. THE ONLY DOWNSIDE IS THAT IT GETS CROWDED DURING LUNCH HOURS. I RECOMMEND GOING A BIT EARLY OR LATE."'
            }
          ];
          setReviews(prev => [...prev, ...additionalMockReviews]);
          const newExpanded = {};
          additionalMockReviews.forEach(review => {
            newExpanded[review.id] = false;
          });
          setExpandedReviews(prev => ({ ...prev, ...newExpanded }));
        }
      }
    } catch (error) {
      console.error('Error loading more reviews:', error);
      // Add mock reviews as fallback
      const additionalMockReviews = [
        {
          id: 5,
          name: 'Dawit Assefa',
          year: '2nd Year',
          rating: 5,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          review: '"BEST BEYAYNET IN CAMPUS! THE VARIETY OF VEGETABLES IS IMPRESSIVE AND EVERYTHING TASTES FRESH. THE INJERA IS SOFT AND PERFECTLY FERMENTED. VERY AFFORDABLE FOR STUDENTS. THE STAFF ARE FRIENDLY AND ALWAYS SMILING."'
        }
      ];
      setReviews(prev => [...prev, ...additionalMockReviews]);
      const newExpanded = {};
      additionalMockReviews.forEach(review => {
        newExpanded[review.id] = false;
      });
      setExpandedReviews(prev => ({ ...prev, ...newExpanded }));
    }
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

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

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
          <Link 
            to="/submit-review" 
            state={{ business: business }}
          >
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
          {(menuItems.length > 0 ? menuItems : mockMenuItems).map((item) => (
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
          {displayedReviews.map((review) => {
            const isExpanded = expandedReviews[review.id];
            const displayText = isExpanded || review.review.length <= 200 
              ? review.review 
              : `${review.review.substring(0, 200)}...`;

            return (
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
                <p className="review-body">{displayText}</p>
                
                {review.review.length > 200 && (
                  <button 
                    className="btn btn-outline read-more-btn"
                    onClick={() => toggleReviewExpansion(review.id)}
                  >
                    {isExpanded ? 'SHOW LESS' : 'READ MORE'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add more reviews button - OUTSIDE the review boxes */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          {!showAllReviews && reviews.length > 3 && (
            <button 
              className="btn btn-outline"
              onClick={() => setShowAllReviews(true)}
              style={{ marginRight: '15px' }}
            >
              View More Reviews
            </button>
          )}
          
          {showAllReviews && reviews.length < 8 && (
            <button 
              className="btn btn-outline"
              onClick={handleLoadMoreReviews}
            >
              Load More Reviews
            </button>
          )}
       
        </div>
      </section>
    </main>
  );
};

export default CustomerReview;