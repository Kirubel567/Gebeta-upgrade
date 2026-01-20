import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './Reviews.css';

const Reviews = () => {
  const [activeFilter, setActiveFilter] = useState('on-campus');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);

  // JSON Server base URL
  const API_BASE = 'http://localhost:3001';

  // Original image URLs from your previous code - ONLY IMAGES
  const originalImages = {
    'on-campus': {
      mainImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
      peekImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop'
    },
    'delivery': {
      mainImage: 'https://images.unsplash.com/photo-1587476351660-e9fa4bb8b26c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D',
      peekImage: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDV8fHxlbnwwfHx8fHw%3D'
    },
    'off-campus': {
      mainImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D',
      peekImage: 'https://images.unsplash.com/photo-1692911634014-a1446191fb7c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDR8fHxlbnwwfHx8fHw%3D'
    }
  };

  // Fetch businesses when filter changes
  useEffect(() => {
    if (!isSearching) {
      fetchBusinessesByCategory();
      fetchFeaturedBusinesses();
    }
  }, [activeFilter, isSearching]);

  // Fetch businesses by category from JSON Server
  const fetchBusinessesByCategory = async () => {
    try {
      setLoading(true);
      
      // JSON Server query: GET /businesses?category=on-campus
      const response = await fetch(`${API_BASE}/businesses?category=${activeFilter}`);
      
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data);
      } else {
        console.log('JSON Server failed, using mock data from db.json structure');
        // Fallback to mock data with db.json structure
        setBusinesses(getMockBusinessesByCategory(activeFilter));
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses(getMockBusinessesByCategory(activeFilter));
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured businesses from JSON Server
  const fetchFeaturedBusinesses = async () => {
    try {
      // JSON Server query: GET /businesses?isFeatured=true
      const response = await fetch(`${API_BASE}/businesses?isFeatured=true`);
      
      if (response.ok) {
        const data = await response.json();
        setFeaturedBusinesses(data);
      }
    } catch (error) {
      console.error('Error fetching featured businesses:', error);
    }
  };

  // Mock data fallback - USING DB.JSON STRUCTURE with original images
  const getMockBusinessesByCategory = (category) => {
    const mockBusinesses = {
      'on-campus': [
        {
          id: 'b1',
          name: 'DESTA CAFE',
          slug: 'desta-cafe',
          category: 'on-campus',
          description: 'Great coffee and sandwiches! Student favorite spot.',
          isFeatured: true,
          rating: {
            average: 4.5,
            count: 42
          },
          location: {
            address: '5K Campus, Building A',
            coordinates: {
              lat: 9.03,
              lng: 38.75
            }
          },
          hours: {
            openTime: '07:00 AM',
            closeTime: '09:00 PM'
          },
          // ORIGINAL IMAGES ONLY - rest from db.json
          image: [
            {
              url: originalImages['on-campus'].mainImage,
              isPrimary: true
            },
            {
              url: originalImages['on-campus'].peekImage,
              isPrimary: false
            }
          ]
        },
        {
          id: 'b3',
          name: 'CHRISTINA CAFE',
          slug: 'christina-cafe',
          category: 'on-campus',
          description: 'Best traditional Ethiopian food on campus.',
          isFeatured: true,
          rating: {
            average: 4.8,
            count: 56
          },
          location: {
            address: '4K Student Center',
            coordinates: {
              lat: 9.02,
              lng: 38.74
            }
          },
          hours: {
            openTime: '08:00 AM',
            closeTime: '08:00 PM'
          },
          // ORIGINAL IMAGES ONLY
          image: [
            {
              url: originalImages['on-campus'].mainImage,
              isPrimary: true
            },
            {
              url: originalImages['on-campus'].peekImage,
              isPrimary: false
            }
          ]
        }
      ],
      'delivery': [
        {
          id: 'b2',
          name: '123FASTFOOD',
          slug: '123fastfood',
          category: 'delivery',
          description: 'Fast delivery and tasty burgers. Open late for students.',
          isFeatured: true,
          rating: {
            average: 4.2,
            count: 31
          },
          location: {
            address: 'Near 6K Gate',
            coordinates: {
              lat: 9.04,
              lng: 38.76
            }
          },
          hours: {
            openTime: '10:00 AM',
            closeTime: '11:00 PM'
          },
          // ORIGINAL IMAGES ONLY
          image: [
            {
              url: originalImages['delivery'].mainImage,
              isPrimary: true
            },
            {
              url: originalImages['delivery'].peekImage,
              isPrimary: false
            }
          ]
        },
        {
          id: 'b4',
          name: 'SLEEK DELIVERY',
          slug: 'sleek-delivery',
          category: 'delivery',
          description: 'Reliable delivery service for all campuses.',
          isFeatured: true,
          rating: {
            average: 4.3,
            count: 28
          },
          location: {
            address: 'Multiple campuses',
            coordinates: {
              lat: 9.03,
              lng: 38.76
            }
          },
          hours: {
            openTime: '09:00 AM',
            closeTime: '10:00 PM'
          },
          // ORIGINAL IMAGES ONLY
          image: [
            {
              url: originalImages['delivery'].mainImage,
              isPrimary: true
            },
            {
              url: originalImages['delivery'].peekImage,
              isPrimary: false
            }
          ]
        }
      ],
      'off-campus': [
        {
          id: 'b5',
          name: 'MILLENNIUM CAFE',
          slug: 'millennium-cafe',
          category: 'off-campus',
          description: 'Perfect for quick lunches between classes.',
          isFeatured: true,
          rating: {
            average: 4.0,
            count: 19
          },
          location: {
            address: 'Across from 5K Main Gate',
            coordinates: {
              lat: 9.03,
              lng: 38.77
            }
          },
          hours: {
            openTime: '07:30 AM',
            closeTime: '07:00 PM'
          },
          // ORIGINAL IMAGES ONLY
          image: [
            {
              url: originalImages['off-campus'].mainImage,
              isPrimary: true
            },
            {
              url: originalImages['off-campus'].peekImage,
              isPrimary: false
            }
          ]
        },
        {
          id: 'b6',
          name: 'RED SEA RESTAURANT',
          slug: 'red-sea-restaurant',
          category: 'off-campus',
          description: 'Friendly staff and great prices. Popular for groups.',
          isFeatured: true,
          rating: {
            average: 4.6,
            count: 47
          },
          location: {
            address: 'Saris Area',
            coordinates: {
              lat: 9.05,
              lng: 38.78
            }
          },
          hours: {
            openTime: '11:00 AM',
            closeTime: '10:00 PM'
          },
          // ORIGINAL IMAGES ONLY
          image: [
            {
              url: originalImages['off-campus'].mainImage,
              isPrimary: true
            },
            {
              url: originalImages['off-campus'].peekImage,
              isPrimary: false
            }
          ]
        }
      ]
    };
    
    return mockBusinesses[category] || [];
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);
      
      // JSON Server search: GET /businesses?name_like=query
      const response = await fetch(`${API_BASE}/businesses?name_like=${encodeURIComponent(searchQuery)}`);
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        // JSON Server failed, use local search
        performLocalSearch();
      }
    } catch (error) {
      console.error('Error searching businesses:', error);
      performLocalSearch();
    } finally {
      setLoading(false);
    }
  };

  // Local search fallback
  const performLocalSearch = () => {
    const allMockBusinesses = [
      ...getMockBusinessesByCategory('on-campus'),
      ...getMockBusinessesByCategory('delivery'),
      ...getMockBusinessesByCategory('off-campus')
    ];
    
    const results = allMockBusinesses.filter(business => 
      business.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

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

  const renderBusinessCard = (business) => {
    const mainImage = business.image?.find(img => img.isPrimary) || business.image?.[0];
    const peekImage = business.image?.find(img => !img.isPrimary) || business.image?.[0];

    return (
      <div className="main-card">
        <div 
          className="main-card-image"
          style={{ 
            backgroundImage: `url('${mainImage?.url}')` 
          }}
        ></div>
        <div className="main-card-content">
          <h3>{business.name}</h3>
          <div className="rating-stars">
            {renderStars(business.rating?.average || 0)}
            <span>{(business.rating?.average || 0).toFixed(1)} ({business.rating?.count || 0} REVIEWS)</span>
          </div>
          <div className="card-details">
            <div><i className="fa-solid fa-location-dot"></i> {business.location?.address || 'AAU Campus'}</div>
            <div>
              <i className="fa-solid fa-calendar"></i> Open Until {business.hours?.closeTime || '6pm'}
            </div>
          </div>
          <Link to="/customer-review" state={{ business: business }}>
            <Button variant="primary" size="medium">
              Read Reviews
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  const renderPeekCard = (business) => {
    const peekImage = business.image?.find(img => !img.isPrimary) || business.image?.[0];
    
    return (
      <div className="peek-card">
        <Link to="/customer-review" state={{ business: business }}>
          <div 
            className="peek-image"
            style={{ 
              backgroundImage: `url('${peekImage?.url}')` 
            }}
          ></div>
          <div className="peek-arrow"><i className="fa-solid fa-angle-right"></i></div>
        </Link>
      </div>
    );
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setShowSearch(false);
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };

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

  // Render section for current filter
  const renderFilterSection = () => {
    const filterTitles = {
      'on-campus': 'ON-CAMPUS',
      'delivery': 'DELIVERY',
      'off-campus': 'OFF-CAMPUS'
    };

    return (
      <div className="hero-grid-container">
        <h1 className="section-title">Trending</h1>
        <h2 className="section-title" style={{ fontSize: '1.5rem' }}>
          {filterTitles[activeFilter]}
        </h2>
        <hr className="divider" />
        
        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading businesses...</p>
          </div>
        ) : businesses.length > 0 ? (
          businesses.map((business, index) => (
            <div key={business.id || index} className="hero-grid">
              {renderBusinessCard(business)}
              {renderPeekCard(business)}
            </div>
          ))
        ) : (
          <div className="no-businesses">
            <p>No businesses found in this category</p>
          </div>
        )}
      </div>
    );
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
                placeholder="Search business name..."
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
                <p>No businesses found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="results-grid">
                {searchResults.map((business, index) => (
                  <div key={business.id || index} className="hero-grid">
                    {renderBusinessCard(business)}
                    {renderPeekCard(business)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Show filter section when not searching */}
      {!isSearching && renderFilterSection()}
    </main>
  );
};

export default Reviews;