import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './Delivery.css';

const Delivery = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [allDeliveries, setAllDeliveries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('fast-deliver');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // JSON Server base URL
  const API_BASE = 'http://localhost:3001';

  // Image paths
  const imagePaths = {
    deliveryCar: 'https://plus.unsplash.com/premium_photo-1678283974882-a00a67c542a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D',
    hana: './images/delivery/hana.png',
    fallbackAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
  };

  // Filter options
  const filters = [
    { id: 'fast-deliver', label: 'Fast Deliver' },
    { id: 'low-fee', label: 'Low Delivery Fee' },
    { id: 'top-rated', label: 'Top Rated' }
  ];

  // Default deliveries data
  const defaultDeliveries = [
    {
      id: 'd1',
      name: 'Shega Delivery',
      description: 'Fastest delivery around campus. Under 20 minutes guaranteed.',
      servicedAreas: ['5k', '6k', '4k', 'Saris'],
      deliverySpeed: 'fast',
      averageDeliveryTime: 18,
      deliveryFee: { min: 20, max: 35 },
      rating: { average: 4.7, count: 120 }
    },
    {
      id: 'd2',
      name: 'Campus Express',
      description: 'Reliable campus delivery with great customer service.',
      servicedAreas: ['5k', '6k', '4k'],
      deliverySpeed: 'fast',
      averageDeliveryTime: 22,
      deliveryFee: { min: 15, max: 25 },
      rating: { average: 4.5, count: 89 }
    },
    {
      id: 'd3',
      name: 'Student Budget',
      description: 'Affordable delivery for students on tight budget.',
      servicedAreas: ['5k', '4k'],
      deliverySpeed: 'medium',
      averageDeliveryTime: 30,
      deliveryFee: { min: 10, max: 20 },
      rating: { average: 4.2, count: 76 }
    },
    {
      id: 'd4',
      name: 'Late Night Express',
      description: 'Open until 2 AM for night owls.',
      servicedAreas: ['5k', '6k'],
      deliverySpeed: 'fast',
      averageDeliveryTime: 25,
      deliveryFee: { min: 25, max: 40 },
      rating: { average: 4.3, count: 45 }
    },
    {
      id: 'd5',
      name: 'Food Express',
      description: 'Specialized food delivery from campus restaurants.',
      servicedAreas: ['5k', '6k', '4k', 'Saris', 'Megenagna'],
      deliverySpeed: 'fast',
      averageDeliveryTime: 20,
      deliveryFee: { min: 15, max: 28 },
      rating: { average: 4.6, count: 95 }
    }
  ];

  // Default reviews data
  const defaultReviews = [
    {
      id: 'dr1',
      deliveryId: 'd1',
      deliveryName: 'Shega Delivery',
      userName: 'Selam Tadesse',
      userUniversity: '6k, AAU',
      userAvatar: imagePaths.hana,
      rating: 5,
      review: 'Honestly the fastest around campus. I order between classes all the time — they usually show up in under 20 minutes.',
      date: '2024-12-15T10:30:00Z'
    },
    {
      id: 'dr2',
      deliveryId: 'd2',
      deliveryName: 'Campus Express',
      userName: 'Mihiret Admasu',
      userUniversity: '5k, AAU',
      userAvatar: imagePaths.hana,
      rating: 4,
      review: 'Great service but sometimes late during peak hours. Overall very reliable.',
      date: '2024-12-14T14:20:00Z'
    },
    {
      id: 'dr3',
      deliveryId: 'd3',
      deliveryName: 'Student Budget',
      userName: 'Alex Johnson',
      userUniversity: '4k, AAU',
      userAvatar: imagePaths.hana,
      rating: 4,
      review: 'Perfect for students! Very affordable prices and good service.',
      date: '2024-12-13T15:30:00Z'
    }
  ];

  // Fetch data - CORRECTED VERSION
  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        setLoading(true);
        
        // First try to fetch from local db.json
        const response = await fetch('/db.json');
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched data from db.json:', data);
          
          // 1. GET DELIVERIES FROM DB.JSON (YOUR deliveries array)
          const dbDeliveries = data.deliveries || [];
          console.log('Deliveries from db.json:', dbDeliveries);
          
          // Use db.json deliveries if available, otherwise use default
          const allDeliveriesData = dbDeliveries.length > 0 ? dbDeliveries : defaultDeliveries;
          
          setDeliveries(allDeliveriesData);
          setAllDeliveries(allDeliveriesData);
          
          // 2. GET REVIEWS FROM DB.JSON
          const dbReviews = data.reviews || [];
          console.log('Reviews from db.json:', dbReviews);
          
          if (dbReviews.length > 0) {
            // Transform reviews to match delivery reviews
            const transformedReviews = dbReviews.map((review, index) => {
              // Try to match review to a delivery
              const delivery = allDeliveriesData[index % allDeliveriesData.length] || allDeliveriesData[0];
              
              return {
                id: review.id || `dr${index}`,
                deliveryId: delivery.id,
                deliveryName: delivery.name,
                userName: data.users?.[index % data.users.length]?.name || 'Anonymous Student',
                userUniversity: `${data.users?.[index % data.users.length]?.dormitory || 'Campus'}, AAU`,
                userAvatar: imagePaths.hana,
                rating: review.rating || 4,
                review: review.body || 'Great delivery service!',
                date: review.createdAt || new Date().toISOString()
              };
            });
            
            setReviews(transformedReviews);
          } else {
            // Use default reviews if no reviews in db.json
            setReviews(defaultReviews);
          }
        } else {
          throw new Error('Failed to fetch db.json');
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use default data as fallback
        setDeliveries(defaultDeliveries);
        setAllDeliveries(defaultDeliveries);
        setReviews(defaultReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryData();
  }, []);

  // Local search fallback - SEARCHES YOUR DELIVERIES ARRAY
  const performLocalSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    const results = allDeliveries.filter(delivery => 
      delivery.name.toLowerCase().includes(query) ||
      delivery.description.toLowerCase().includes(query) ||
      delivery.servicedAreas?.some(area => area.toLowerCase().includes(query))
    );
    
    setSearchResults(results);
  };

  // Handle search - CORRECTED TO SEARCH DELIVERIES
  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);
      
      // FIRST try to fetch from JSON Server deliveries endpoint
      const deliveriesResponse = await fetch(`${API_BASE}/deliveries?name_like=${encodeURIComponent(searchQuery)}`);
      
      if (deliveriesResponse.ok) {
        const data = await deliveriesResponse.json();
        console.log('Search results from /deliveries endpoint:', data);
        setSearchResults(data);
      } else {
        // If no deliveries endpoint, try businesses with delivery category
        const businessesResponse = await fetch(`${API_BASE}/businesses?category=delivery&name_like=${encodeURIComponent(searchQuery)}`);
        
        if (businessesResponse.ok) {
          const data = await businessesResponse.json();
          console.log('Search results from /businesses endpoint:', data);
          setSearchResults(data);
        } else {
          // JSON Server failed, use local search in your deliveries array
          console.log('Using local search in deliveries array');
          performLocalSearch();
        }
      }
    } catch (error) {
      console.error('Error searching:', error);
      performLocalSearch();
    } finally {
      setLoading(false);
    }
  };

  // Handle filter click
  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    setShowSearch(false);
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };

  // Handle search click
  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };

  // Filter deliveries based on active filter
  const getFilteredDeliveries = () => {
    if (isSearching && searchResults.length > 0) {
      return searchResults;
    }

    const filtered = deliveries.filter(delivery => {
      switch (activeFilter) {
        case 'fast-deliver':
          return delivery.deliverySpeed === 'fast' || delivery.averageDeliveryTime <= 25;
        case 'low-fee':
          return delivery.deliveryFee.min <= 15;
        case 'top-rated':
          return delivery.rating.average >= 4.3;
        default:
          return true;
      }
    });

    // Sort based on active filter
    return [...filtered].sort((a, b) => {
      switch (activeFilter) {
        case 'fast-deliver':
          return a.averageDeliveryTime - b.averageDeliveryTime;
        case 'low-fee':
          return a.deliveryFee.min - b.deliveryFee.min;
        case 'top-rated':
          return b.rating.average - a.rating.average;
        default:
          return 0;
      }
    });
  };

  // Filter reviews based on active filter
  const getFilteredReviews = () => {
    const filteredDeliveries = getFilteredDeliveries();
    const filteredDeliveryIds = filteredDeliveries.map(d => d.id);
    
    return reviews.filter(review => 
      filteredDeliveryIds.includes(review.deliveryId)
    ).slice(0, 3);
  };

  // Render stars
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

  // Handlers
  const handleDeliveryClick = (deliveryId) => {
    navigate(`/delivery/${deliveryId}`, {
      state: { delivery: deliveries.find(d => d.id === deliveryId) }
    });
  };

  const handleOrderClick = () => {
    alert('Order feature coming soon!');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading delivery services...</p>
      </div>
    );
  }

  const filteredDeliveries = getFilteredDeliveries();
  const filteredReviews = getFilteredReviews();

  return (
    <main className="delivery-page">
      {/* Filter Bar */}
      <div className="container">
        <div className="filter-bar">
          {filters.map(filter => (
            <div
              key={filter.id}
              className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => handleFilterClick(filter.id)}
            >
              {filter.label}
            </div>
          ))}
          
          {/* Search Icon Button */}
          <div className="search-icon-btn" onClick={handleSearchClick}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
      </div>

      {/* Search Input (appears when search icon is clicked) */}
      {showSearch && (
        <div className="container">
          <div className="search-box-container">
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="Search delivery name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              {searchQuery && (
                <Button variant="neutral" size="small" onClick={handleClearSearch} className="clear-search-btn">
                  <i className="fa-solid fa-times"></i>
                </Button>
              )}
              <Button variant="primary" size="medium" onClick={handleSearch} className="search-action-btn">
                <i className="fa-solid fa-magnifying-glass"></i>
              </Button>
            </div>
            {loading && (
              <div className="search-loading">
                <div className="small-spinner"></div>
                <span>Searching...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Results */}
      {isSearching && (
        <div className="container">
          <div className="search-results">
            <h3 className="search-results-title">
              Search Results for "{searchQuery}"
              {searchResults.length > 0 && (
                <span className="results-count"> ({searchResults.length} found)</span>
              )}
            </h3>
            
            {loading ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>Searching...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="no-results">
                <p>No deliveries found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="deliveries-scroll-container">
                {searchResults.map((delivery) => (
                  <div 
                    key={delivery.id}
                    className="delivery-card-delivery"
                    onClick={() => handleDeliveryClick(delivery.id)}
                  >
                    <h3 className="delivery-card-title">{delivery.name}</h3>
                    
                    <div className="delivery-card-rating">
                      <div className="rating-stars-delivery">
                        {renderStars(delivery.rating?.average || 4.0)}
                      </div>
                      <span className="rating-text-delivery">
                        {(delivery.rating?.average || 4.0).toFixed(1)} ({delivery.rating?.count || 0})
                      </span>
                    </div>
                    
                    <p className="delivery-card-desc">
                      {delivery.description}
                    </p>
                    
                    <div className="delivery-card-details">
                      <div className="detail-item-delivery">
                        <i className="fa-solid fa-clock"></i>
                        <span>Avg. {delivery.averageDeliveryTime || 25} mins</span>
                      </div>
                      <div className="detail-item-delivery">
                        <i className="fa-solid fa-tag"></i>
                        <span>ETB {delivery.deliveryFee?.min || 15} - {delivery.deliveryFee?.max || 30}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeliveryClick(delivery.id);
                      }}
                    >
                      Explore
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Show main content when not searching */}
      {!isSearching && (
        <>
          <hr className="divider" />

          {/* Main Heading - Delivery */}
          <h1 className="delivery-main-heading">Delivery</h1>

          {/* Hero Section - Image on left, no border */}
          <section className="hero-section-delivery">
            <div className="hero-image-delivery">
              <img
                src={imagePaths.deliveryCar}
                alt="Delivery Car"
                className="delivery-hero-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1587476351660-e9fa4bb8b26c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D';
                }}
              />
            </div>
            <div className="hero-content-delivery">
              <h1 className="hero-title-delivery">
                Delivery Options Around Campus
              </h1>
              <p className="hero-description-delivery">
                Discover every delivery service available around campus - rated,
                reviewed, and compared for you.
              </p>
              <Button variant="outline" size="medium" onClick={handleOrderClick}>
                Order
              </Button>
            </div>
          </section>

          <hr className="divider" />

          {/* Top Five Deliveries Section - Scrollable */}
          <section className="top-deliveries-section">
            <h1 className="section-title-delivery">Top Five Deliveries</h1>
            <div className="deliveries-scroll-container">
              {filteredDeliveries.slice(0, 5).map((delivery) => (
                <div 
                  key={delivery.id}
                  className="delivery-card-delivery"
                  onClick={() => handleDeliveryClick(delivery.id)}
                >
                  <h3 className="delivery-card-title">{delivery.name}</h3>
                  
                  <div className="delivery-card-rating">
                    <div className="rating-stars-delivery">
                      {renderStars(delivery.rating.average)}
                    </div>
                    <span className="rating-text-delivery">
                      {delivery.rating.average.toFixed(1)} ({delivery.rating.count})
                    </span>
                  </div>
                  
                  <p className="delivery-card-desc">
                    {delivery.description}
                  </p>
                  
                  <div className="delivery-card-details">
                    <div className="detail-item-delivery">
                      <i className="fa-solid fa-clock"></i>
                      <span>Avg. {delivery.averageDeliveryTime} mins</span>
                    </div>
                    <div className="detail-item-delivery">
                      <i className="fa-solid fa-tag"></i>
                      <span>ETB {delivery.deliveryFee.min} - {delivery.deliveryFee.max}</span>
                    </div>
                    <div className="detail-item-delivery">
                      <i className="fa-solid fa-location-dot"></i>
                      <span>{delivery.servicedAreas?.slice(0, 3).join(', ')}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeliveryClick(delivery.id);
                    }}
                  >
                    Explore
                  </Button>
                </div>
              ))}
              
              {filteredDeliveries.length === 0 && (
                <div className="no-deliveries-message">
                  <p>No deliveries found matching your criteria</p>
                </div>
              )}
            </div>
          </section>

          <hr className="divider" />

          {/* Reviews Section - Filtered based on active filter */}
          <section className="reviews-section-delivery">
            <h1 className="section-title-delivery">Reviews</h1>
            <div className="reviews-grid-delivery">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <div key={review.id} className="review-card-delivery">
                    <div className="review-card-header-delivery">
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="review-avatar-delivery"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = imagePaths.fallbackAvatar;
                        }}
                      />
                      <div className="reviewer-info-delivery">
                        <h4 className="reviewer-name-delivery">{review.userName}</h4>
                        <p className="reviewer-university-delivery">{review.userUniversity}</p>
                        <div className="rating-stars-delivery">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="review-delivery-name-delivery">{review.deliveryName}</h3>
                    
                    <p className="review-text-delivery">
                      "{review.review}"
                    </p>
                    
                    <div className="review-date-delivery">
                      <i className="fa-solid fa-calendar-days"></i>
                      <span>{new Date(review.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-reviews-message">No reviews available for this filter</p>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Delivery;