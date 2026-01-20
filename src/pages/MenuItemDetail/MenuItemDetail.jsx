import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './MenuItemDetail.css';

const MenuItemDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { menuItem, business } = location.state || {};
  
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [foodReviews, setFoodReviews] = useState([]);
  const [allData, setAllData] = useState(null);

  // Fetch all data from db.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/db.json');
        const data = await response.json();
        setAllData(data);
        
        // Get menu items for the business
        let menuItems = [];
        if (business && business.id) {
          // Filter menu items by business ID
          menuItems = data.menu.filter(item => item.businessId === business.id);
          
          // Format menu items with images
          const formattedMenuItems = menuItems.map(item => ({
            id: item.id,
            itemName: item.itemName,
            description: item.description,
            price: item.price,
            currency: item.currency,
            category: item.category,
            image: getMenuItemImage(item.id), // Helper function for images
            rating: 4.5, // Default rating
            isPopular: item.isPopular,
            isAvailable: item.isAvailable
          }));
          
          setAllMenuItems(formattedMenuItems);
          
          // Find the current item index
          if (menuItem && menuItem.id) {
            const foundIndex = formattedMenuItems.findIndex(item => item.id === menuItem.id);
            if (foundIndex !== -1) {
              setCurrentItemIndex(foundIndex);
            }
          }
        } else {
          // No business ID, use mock data
          console.log('No business ID, using mock menu items');
          setAllMenuItems(mockMenuItems);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to mock data
        setAllMenuItems(mockMenuItems);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [business, menuItem]);

  // Helper function to get menu item images
  const getMenuItemImage = (itemId) => {
    const imageMap = {
      'm1': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop', // Special Coffee
      'm2': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop', // Club Sandwich
      'm3': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1000&auto=format&fit=crop', // Fruit Juice
      'm4': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop', // Cheese Burger
      'm5': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop', // French Fries
      'default': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop'
    };
    
    return imageMap[itemId] || imageMap.default;
  };

  // Fetch reviews for current menu item
  useEffect(() => {
    const fetchItemReviews = () => {
      if (!allMenuItems.length) return;

      const currentItem = allMenuItems[currentItemIndex];
      
      try {
        // Get reviews from db.json that might be related to this item
        // Note: In your db.json, reviews are for businesses, not specific menu items
        // So we'll use mock reviews for demonstration
        
        // Get some general reviews for the business this item belongs to
        let businessReviews = [];
        if (allData && currentItem) {
          // Find the business for this menu item
          const menuItemFromData = allData.menu.find(item => item.id === currentItem.id);
          if (menuItemFromData) {
            businessReviews = allData.reviews
              .filter(review => review.businessId === menuItemFromData.businessId)
              .slice(0, 2); // Take max 2 reviews
          }
        }
        
        // Format reviews with user info
        const formattedReviews = businessReviews.map((review, index) => {
          const user = allData?.users?.find(u => u.id === review.userId) || {
            name: 'CUSTOMER',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
            university: 'AAU'
          };
          
          // Create a review that mentions the current menu item
          const itemSpecificReview = {
            ...review,
            user: {
              name: user.name,
              avatar: user.avatar,
              university: `${user.dormitory || ''}, ${user.university || 'AAU'}`
            },
            body: generateItemSpecificReview(currentItem.itemName, review.body)
          };
          
          return itemSpecificReview;
        });

        // If no reviews from db.json, use mock reviews
        if (formattedReviews.length === 0) {
          const mockItemReviews = itemReviewsData[currentItem.id] || [
            {
              id: 'default',
              user: {
                name: 'CUSTOMER',
                university: 'AAU',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop'
              },
              rating: 4,
              body: `The ${currentItem.itemName} is delicious! Great flavor and good portion size.`,
              createdAt: new Date().toISOString()
            }
          ];
          setFoodReviews(mockItemReviews);
        } else {
          setFoodReviews(formattedReviews);
        }
      } catch (error) {
        console.error('Error fetching item reviews:', error);
        // Fallback to default review
        const currentItem = allMenuItems[currentItemIndex] || mockMenuItems[0];
        setFoodReviews([{
          id: 'default',
          user: {
            name: 'CUSTOMER',
            university: 'AAU',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop'
          },
          rating: 4,
          body: `The ${currentItem.itemName} is delicious! Great flavor and good portion size.`,
          createdAt: new Date().toISOString()
        }]);
      }
    };

    fetchItemReviews();
  }, [currentItemIndex, allMenuItems, allData]);

  // Helper function to generate item-specific reviews
  const generateItemSpecificReview = (itemName, originalReview) => {
    const itemKeywords = [
      `The ${itemName} is amazing!`,
      `I love the ${itemName} here.`,
      `Best ${itemName} on campus!`,
      `The ${itemName} was perfectly cooked.`,
      `Highly recommend the ${itemName}.`
    ];
    
    const randomKeyword = itemKeywords[Math.floor(Math.random() * itemKeywords.length)];
    return `${randomKeyword} ${originalReview}`;
  };

  // Mock menu items data (fallback)
  const mockMenuItems = [
    {
      id: 'm1',
      itemName: 'BEYAYNETU',
      description: 'Traditional Ethiopian platter with assorted vegetables and injera',
      price: 120,
      currency: 'ETB',
      category: 'main',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
      rating: 4.5,
      isPopular: true,
      isAvailable: true
    },
    {
      id: 'm2',
      itemName: 'DORO WOT',
      description: 'Spicy chicken stew served with injera',
      price: 150,
      currency: 'ETB',
      category: 'main',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
      rating: 4.8,
      isPopular: true,
      isAvailable: true
    },
    {
      id: 'm3',
      itemName: 'TIBES',
      description: 'Fried meat cubes with spices and vegetables',
      price: 180,
      currency: 'ETB',
      category: 'main',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
      rating: 4.3,
      isPopular: false,
      isAvailable: true
    },
    {
      id: 'm4',
      itemName: 'SHIRO',
      description: 'Chickpea flour stew with spices',
      price: 100,
      currency: 'ETB',
      category: 'main',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
      rating: 4.6,
      isPopular: true,
      isAvailable: true
    },
    {
      id: 'm5',
      itemName: 'KITFO',
      description: 'Minced beef seasoned with spices',
      price: 160,
      currency: 'ETB',
      category: 'main',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
      rating: 4.4,
      isPopular: false,
      isAvailable: true
    }
  ];

  // Mock reviews per menu item (fallback)
  const itemReviewsData = {
    'm1': [
      {
        id: 'r1',
        user: {
          name: 'SELAM TADESSE',
          university: '6K, AAU',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop'
        },
        rating: 5,
        body: 'The Beyaynetu here is absolutely amazing! All vegetables are fresh and perfectly cooked. The injera is soft and has just the right amount of sourness. Best traditional food on campus!',
        createdAt: '2026-01-18T10:30:00Z'
      },
      {
        id: 'r2',
        user: {
          name: 'MIHIRET ADMASU',
          university: '5K, AAU',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop'
        },
        rating: 4,
        body: 'Good portion size for the price. The variety of vegetables is impressive. Could use a bit more spice for my taste, but overall very satisfying.',
        createdAt: '2026-01-17T14:20:00Z'
      }
    ],
    'm2': [
      {
        id: 'r3',
        user: {
          name: 'ABEL TADESSE',
          university: '4K, AAU',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop'
        },
        rating: 5,
        body: 'Best Doro Wot in town! The chicken is perfectly cooked and the berbere spice is amazing. Served with fresh injera.',
        createdAt: '2026-01-19T12:30:00Z'
      }
    ]
  };

  const currentItem = allMenuItems[currentItemIndex] || mockMenuItems[0];

  // Create array of 4 images - ALL SAME as the main image
  const smallImages = Array(4).fill(currentItem.image);

  // Navigation handlers
  const handleNextItem = () => {
    setCurrentItemIndex((prev) => (prev + 1) % allMenuItems.length);
  };

  const handlePrevItem = () => {
    setCurrentItemIndex((prev) => (prev - 1 + allMenuItems.length) % allMenuItems.length);
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
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

  if (loading) {
    return (
      <div className="menu-item-modal-overlay">
        <div className="menu-item-modal-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading menu item details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-item-modal-overlay">
      <div className="menu-item-modal-container">
        
        {/* Back button - Left side */}
        <button className="modal-back-btn" onClick={handleBack}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>

        {/* Main Content */}
        <div className="menu-item-modal-content">
          
          {/* Left Section - Large Food Image */}
          <div className="modal-left-section">
            <div className="modal-large-image-container">
              <img 
                src={currentItem.image} 
                alt={currentItem.itemName}
                className="modal-large-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop';
                }}
              />
              
              {/* Food Info Overlay */}
              <div className="modal-food-overlay">
                <div className="modal-food-basic">
                  <h1>{currentItem.itemName}</h1>
                  <div className="modal-food-price">{currentItem.price} {currentItem.currency}</div>
                </div>
                
                <div className="modal-food-rating">
                  {renderStars(currentItem.rating || 4.5)}
                  <span>{(currentItem.rating || 4.5).toFixed(1)} ({currentItem.reviewCount || 0} reviews)</span>
                </div>
                
                <p className="modal-food-desc">{currentItem.description}</p>
              </div>
            </div>
          </div>

          {/* Right Section - Content */}
          <div className="modal-right-section">
            
            {/* Arrow Navigation and Food Name */}
            <div className="modal-food-navigation">
              <button className="modal-nav-arrow" onClick={handlePrevItem}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              
              <h2 className="modal-food-title">
                {currentItem.itemName}
              </h2>
              
              <button className="modal-nav-arrow" onClick={handleNextItem}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            {/* 4 Small Photo Thumbnails */}
            <div className="modal-small-photos">
              <h3>More Photos</h3>
              <div className="modal-photos-grid">
                {smallImages.map((img, index) => (
                  <div key={index} className="modal-small-photo">
                    <img 
                      src={img} 
                      alt={`${currentItem.itemName} - view ${index + 1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Review Section*/}
            <div className="modal-review-section">
              <h3 className="modal-review-heading">Customer Reviews</h3>
              
              <div className="modal-reviews-container">
                {foodReviews.map((review, index) => (
                  <div key={review.id || index} className="modal-review-card">
                    <div className="modal-reviewer-info">
                      <img 
                        src={review.user?.avatar} 
                        alt={review.user?.name}
                        className="modal-reviewer-avatar"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop';
                        }}
                      />
                      <div className="modal-reviewer-details">
                        <h4>{review.user?.name}</h4>
                        <p>{review.user?.university}</p>
                        <div className="modal-review-stars">
                          {renderStars(review.rating || 4)}
                        </div>
                      </div>
                    </div>
                    <p className="modal-review-text">{review.body}</p>
                    <div className="modal-review-date">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'Recently'}
                    </div>
                  </div>
                ))}
                
                {foodReviews.length === 0 && (
                  <div className="no-reviews">
                    <p>No reviews yet for this item. Be the first to review!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetail;