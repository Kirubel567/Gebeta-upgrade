import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleReviews, setVisibleReviews] = useState(4);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    location: '',
    description: '',
    avatar: ''
  });
  const [avatarPreview, setAvatarPreview] = useState('');

  // Food images database
  const foodImages = {
    'Special Coffee': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1000&auto=format&fit=crop',
    'Club Sandwich': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
    'Fruit Juice': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
    'BEYAYNETU': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1000&auto=format&fit=crop',
    'DORO WOT': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
    'TIBES': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
    'SHIRO': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
    'KITFO': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
    'SPAGHETTI': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop',
    'PIZZA': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
    'BURGER': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop',
    'default': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop'
  };

  // Fetch user data from your db.json
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch from db.json
        const response = await fetch('/db.json');
        const data = await response.json();
        
        // Get the current user (Anna from your db.json)
        const currentUser = data.users.find(u => u.id === 'u1') || {
          id: 'u1',
          name: 'Anna',
          avatar: 'https://i.pravatar.cc/150?img=1',
          email: 'student1@aau.edu.et',
          role: 'user',
          university: 'AAU',
          dormitory: '5K',
          yearOfStudy: '2nd Year',
          followers: 128,
          following: 56
        };
        
        // Set user with location from dormitory
        const userWithLocation = {
          ...currentUser,
          location: `${currentUser.dormitory} Dormitory, ${currentUser.university}`,
          description: 'Food enthusiast & coffee lover. Always exploring new campus spots!',
          followers: currentUser.followers || 128,
          following: currentUser.following || 56
        };
        
        setUser(userWithLocation);
        setEditedUser({
          name: userWithLocation.name,
          location: userWithLocation.location,
          description: userWithLocation.description,
          avatar: userWithLocation.avatar
        });
        setAvatarPreview(userWithLocation.avatar);
        
        // Get user's reviews from db.json (Anna's reviews - she has review r1)
        const userReviews = data.reviews
          .filter(review => review.userId === 'u1')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Enrich reviews with business info from db.json
        const enrichedReviews = userReviews.map((review) => {
          const business = data.businesses.find(b => b.id === review.businessId);
          const menuItem = data.menu.find(m => m.businessId === review.businessId);
          const foodName = menuItem?.itemName || 'Special Dish';
          
          return {
            id: review.id,
            rating: review.rating,
            body: review.body,
            createdAt: review.createdAt,
            helpfulCount: review.helpfulCount || 0,
            business: {
              name: business?.name || 'Unknown Restaurant',
              category: business?.category,
              location: business?.location?.address,
            },
            food: {
              name: foodName,
              price: menuItem?.price,
              currency: menuItem?.currency,
              image: foodImages[foodName] || foodImages.default
            }
          };
        });
        
        // If user has no reviews, show some mock reviews for demonstration
        if (enrichedReviews.length === 0) {
          setRecentReviews([
            {
              id: 'r1',
              rating: 4.5,
              body: 'I ORDERED FROM HERE LAST WEEK - GOT MY ORDER IN 10 MINUTES! SUPER FAST AND FRIENDLY SERVICE.',
              createdAt: '2024-12-15T10:30:00Z',
              helpfulCount: 12,
              business: {
                name: 'DESTA CAFE',
                category: 'on-campus',
                location: '5K Campus, Building A',
              },
              food: {
                name: 'Special Coffee',
                price: 35,
                currency: 'ETB',
                image: foodImages['Special Coffee']
              }
            },
            {
              id: 'r2',
              rating: 4.8,
              body: 'Best traditional Ethiopian food on campus! Authentic flavors and great prices.',
              createdAt: '2024-12-14T14:20:00Z',
              helpfulCount: 8,
              business: {
                name: 'CHRISTINA CAFE',
                category: 'on-campus',
                location: '4K Student Center',
              },
              food: {
                name: 'BEYAYNETU',
                price: 120,
                currency: 'ETB',
                image: foodImages['BEYAYNETU']
              }
            },
            {
              id: 'r3',
              rating: 4.2,
              body: 'Good coffee but sometimes too crowded during lunch hours.',
              createdAt: '2024-12-11T11:20:00Z',
              helpfulCount: 3,
              business: {
                name: 'DESTA CAFE',
                category: 'on-campus',
                location: '5K Campus, Building A',
              },
              food: {
                name: 'Club Sandwich',
                price: 65,
                currency: 'ETB',
                image: foodImages['Club Sandwich']
              }
            },
            {
              id: 'r4',
              rating: 4.6,
              body: 'Amazing pizza with fresh toppings! Perfect for group hangouts.',
              createdAt: '2024-12-10T19:30:00Z',
              helpfulCount: 15,
              business: {
                name: 'RED SEA RESTAURANT',
                category: 'off-campus',
                location: 'Saris Area',
              },
              food: {
                name: 'PIZZA',
                price: 150,
                currency: 'ETB',
                image: foodImages['PIZZA']
              }
            },
          ]);
        } else {
          setRecentReviews(enrichedReviews);
        }
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback mock data
        const fallbackUser = {
          id: 'u1',
          name: 'Anna',
          avatar: 'https://i.pravatar.cc/150?img=1',
          location: '5K Dormitory, AAU',
          description: 'Food enthusiast & coffee lover. Always exploring new campus spots!',
          followers: 128,
          following: 56,
          email: 'student1@aau.edu.et',
          university: 'AAU',
          dormitory: '5K',
          yearOfStudy: '2nd Year'
        };
        
        setUser(fallbackUser);
        setEditedUser({
          name: fallbackUser.name,
          location: fallbackUser.location,
          description: fallbackUser.description,
          avatar: fallbackUser.avatar
        });
        setAvatarPreview(fallbackUser.avatar);
        
        setRecentReviews([
          {
            id: 'r1',
            rating: 4.5,
            body: 'I ORDERED FROM HERE LAST WEEK - GOT MY ORDER IN 10 MINUTES! SUPER FAST AND FRIENDLY SERVICE.',
            createdAt: '2024-12-15T10:30:00Z',
            helpfulCount: 12,
            business: {
              name: 'DESTA CAFE',
              category: 'on-campus',
              location: '5K Campus, Building A',
            },
            food: {
              name: 'Special Coffee',
              price: 35,
              currency: 'ETB',
              image: foodImages['Special Coffee']
            }
          },
          {
            id: 'r2',
            rating: 4.8,
            body: 'Best traditional Ethiopian food on campus! Authentic flavors and great prices.',
            createdAt: '2024-12-14T14:20:00Z',
            helpfulCount: 8,
            business: {
              name: 'CHRISTINA CAFE',
              category: 'on-campus',
              location: '4K Student Center',
            },
            food: {
              name: 'BEYAYNETU',
              price: 120,
              currency: 'ETB',
              image: foodImages['BEYAYNETU']
            }
          },
          {
            id: 'r3',
            rating: 4.2,
            body: 'Good coffee but sometimes too crowded during lunch hours.',
            createdAt: '2024-12-11T11:20:00Z',
            helpfulCount: 3,
            business: {
              name: 'DESTA CAFE',
              category: 'on-campus',
              location: '5K Campus, Building A',
            },
            food: {
              name: 'Club Sandwich',
              price: 65,
              currency: 'ETB',
              image: foodImages['Club Sandwich']
            }
          },
          {
            id: 'r4',
            rating: 4.6,
            body: 'Amazing pizza with fresh toppings! Perfect for group hangouts.',
            createdAt: '2024-12-10T19:30:00Z',
            helpfulCount: 15,
            business: {
              name: 'RED SEA RESTAURANT',
              category: 'off-campus',
              location: 'Saris Area',
            },
            food: {
              name: 'PIZZA',
              price: 150,
              currency: 'ETB',
              image: foodImages['PIZZA']
            }
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle edit profile
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // Handle save changes
  const handleSaveChanges = () => {
    const updatedUser = {
      ...user,
      name: editedUser.name,
      location: editedUser.location,
      description: editedUser.description,
      avatar: editedUser.avatar
    };
    
    setUser(updatedUser);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditedUser({
      name: user.name,
      location: user.location,
      description: user.description,
      avatar: user.avatar
    });
    setAvatarPreview(user.avatar);
    setIsEditing(false);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle avatar file upload from computer
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const avatarUrl = reader.result;
        setEditedUser(prev => ({
          ...prev,
          avatar: avatarUrl
        }));
        setAvatarPreview(avatarUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle load more reviews
  const handleLoadMore = () => {
    setVisibleReviews(prev => prev + 4);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-profile">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const displayedReviews = recentReviews.slice(0, visibleReviews);
  const hasMoreReviews = recentReviews.length > visibleReviews;

  return (
    <main className="profile-main-container">
      <div className="profile-container">
        {/* Left Column - 35% */}
        <div className="profile-left-column">
          <div className="profile-card">
            {/* Edit Mode or View Mode */}
            {isEditing ? (
              /* EDIT MODE */
              <div className="edit-profile-mode">
                <h3 className="edit-title">
                  <i className="fa-solid fa-pen-to-square"></i>
                  Edit Profile
                </h3>
                
                {/* Avatar Upload from Computer */}
                <div className="avatar-upload-section">
                  <p className="section-label">Upload Avatar:</p>
                  <div className="avatar-upload-container">
                    <div className="avatar-preview">
                      <img 
                        src={avatarPreview} 
                        alt="Avatar Preview" 
                        className="preview-image"
                      />
                    </div>
                    <div className="upload-controls">
                      <label className="file-upload-label">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="file-input"
                        />
                        <div className="upload-button">
                          <i className="fa-solid fa-camera"></i>
                          Choose from Computer
                        </div>
                      </label>
                      <p className="upload-note">
                        Supported: JPEG, PNG, GIF • Max 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name Input */}
                <div className="form-group">
                  <label className="form-label">
                    <i className="fa-solid fa-user"></i>
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Location Input */}
                <div className="form-group">
                  <label className="form-label">
                    <i className="fa-solid fa-location-dot"></i>
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editedUser.location}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your location"
                  />
                </div>

                {/* Description Input */}
                <div className="form-group">
                  <label className="form-label">
                    <i className="fa-solid fa-pencil"></i>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editedUser.description}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>

                {/* Edit Actions */}
                <div className="edit-actions">
                  <Button variant="primary" onClick={handleSaveChanges}>
                    <i className="fa-solid fa-check"></i>
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <i className="fa-solid fa-times"></i>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              /* VIEW MODE */
              <>
                {/* Avatar and Name/Location in Flex Row */}
                <div className="profile-header-flex">
                  <div className="profile-avatar-container">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="profile-avatar"
                    />
                  </div>
                  
                  <div className="profile-name-location">
                    <h1 className="profile-name">{user.name}</h1>
                    <div className="profile-location">
                      <i className="fa-solid fa-location-dot"></i>
                      <span>{user.location}</span>
                    </div>
                  </div>
                </div>
                
                {/* Small Description - On separate line */}
                <p className="profile-description">
                  {user.description}
                </p>
                
                {/* User Stats with Icons */}
                <div className="profile-stats-vertical">
                  <div className="stat-line">
                    <div className="stat-label">
                      <i className="fa-solid fa-user-group"></i>
                      FOLLOWERS:
                    </div>
                    <div className="stat-value">{user.followers || 0}</div>
                  </div>
                  
                  <div className="stat-line">
                    <div className="stat-label">
                      <i className="fa-solid fa-user-plus"></i>
                      FOLLOWING:
                    </div>
                    <div className="stat-value">{user.following || 0}</div>
                  </div>
                </div>
                
                {/* Edit Profile Button */}
                <Button variant="primary" onClick={handleEditProfile}>
                  <i className="fa-solid fa-pen-to-square"></i>
                  Edit Profile
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Right Column - 65% */}
        <div className="profile-right-column">
          <div className="recent-reviews-section">
            <h2 className="section-heading">
              <i className="fa-solid fa-star"></i>
              Recent Reviews
            </h2>
            
            {displayedReviews.length > 0 ? (
              <>
                {/* 2x2 Grid of Review Boxes */}
                <div className="reviews-grid">
                  {displayedReviews.map((review) => (
                    <div key={review.id} className="review-box">
                      {/* Image taking 60% height */}
                      <div className="review-image-container">
                        <img 
                          src={review.food.image} 
                          alt={review.food.name}
                          className="review-food-image"
                        />
                        {/* Rating badge on top-right of image */}
                        <div className="rating-badge">
                          <i className="fa-solid fa-star"></i>
                          {review.rating.toFixed(1)}
                        </div>
                      </div>
                      
                      {/* Review Content */}
                      <div className="review-content">
                        <h3 className="food-name">{review.food.name}</h3>
                        <p className="restaurant-name">{review.business.name}</p>
                        <p className="review-text">{review.body}</p>
                        <div className="review-meta">
                          <span className="review-date">{formatDate(review.createdAt)}</span>
                          <span className="review-helpful-count">
                            <i className="fa-solid fa-thumbs-up"></i>
                            {review.helpfulCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Load More Button */}
                {hasMoreReviews && (
                  <div className="load-more-container">
                    <Button variant="outline" onClick={handleLoadMore}>
                      Load More Reviews
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-reviews">
                <i className="fa-regular fa-star"></i>
                <h3>No Reviews Yet</h3>
                <p>You haven't written any reviews yet. Share your campus food experiences!</p>
                <Link to="/reviews" className="btn btn-primary">
                  Write Your First Review
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;