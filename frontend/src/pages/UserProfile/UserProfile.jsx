import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './UserProfile.css';
import { businessService, reviewService, authService } from '../../api/apiService';
import { formatRole } from '../../utils/roleUtils';

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

  // Fetch user data from API - SAFE FETCH WITH DEBUG LOGGING
  useEffect(() => {
    const fetchUserData = async () => {
      console.log('🚀 [UserProfile] Starting data fetch...');

      try {
        setLoading(true);

        // ============================================
        // STAGE 1: Fetch User Profile
        // ============================================
        console.log('📡 [Stage 1] Fetching user profile...');

        // ❌ OLD (WRONG): const profileResponse = await authService.getProfile();
        // ❌ OLD (WRONG): const profileData = await profileResponse.json();

        // ✅ NEW (CORRECT): apiClient already returns parsed JSON
        const profileData = await authService.getProfile();

        console.log('✅ [Stage 1] Raw profile response:', profileData);
        console.log('   - success:', profileData.success);
        console.log('   - statusCode:', profileData.statusCode);
        console.log('   - data type:', typeof profileData.data);

        if (!profileData.success) {
          throw new Error(profileData.message || 'Failed to fetch profile');
        }

        const currentUser = profileData.data;
        console.log('👤 [Stage 1] Current user extracted:', {
          _id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email,
          dormitory: currentUser.dormitory,
          description: currentUser.description,
          followers: currentUser.followers,
          following: currentUser.following
        });

        // Set user with location from dormitory
        const userWithLocation = {
          ...currentUser,
          location: `${currentUser.dormitory || 'Main'} Dormitory, ${currentUser.university || 'AAU'}`,
          role: currentUser.role || 'user',
          isVerified: currentUser.isVerified || false,
          description: currentUser.description || 'Food enthusiast & coffee lover. Always exploring new campus spots!',
          followers: currentUser.followers || 0,
          following: currentUser.following || 0,
        };

        console.log('🏠 [Stage 1] User with location:', userWithLocation);

        setUser(userWithLocation);
        setEditedUser({
          name: userWithLocation.name,
          location: userWithLocation.location,
          description: userWithLocation.description,
          avatar: userWithLocation.avatar || 'https://i.pravatar.cc/150?img=1'
        });
        setAvatarPreview(userWithLocation.avatar || 'https://i.pravatar.cc/150?img=1');

        console.log('✅ [Stage 1] User state updated successfully');

        // ============================================
        // STAGE 2: Fetch User's Reviews
        // ============================================
        console.log('📡 [Stage 2] Fetching reviews for user ID:', currentUser._id);

        // ✅ CORRECT: apiClient already returns parsed JSON
        const reviewsData = await reviewService.getByUserId(currentUser._id);

        console.log('✅ [Stage 2] Raw reviews response:', reviewsData);
        console.log('   - success:', reviewsData.success);
        console.log('   - statusCode:', reviewsData.statusCode);
        console.log('   - data type:', typeof reviewsData.data);
        console.log('   - data is array:', Array.isArray(reviewsData.data));
        console.log('   - review count:', reviewsData.data?.length || 0);

        if (!reviewsData.success) {
          throw new Error(reviewsData.message || 'Failed to fetch reviews');
        }

        const userReviews = reviewsData.data || [];
        console.log('📝 [Stage 2] User reviews array:', userReviews);

        if (userReviews.length > 0) {
          console.log('📝 [Stage 2] First review sample:', {
            _id: userReviews[0]._id,
            rating: userReviews[0].rating,
            body: userReviews[0].body?.substring(0, 50) + '...',
            business: userReviews[0].business,
            user: userReviews[0].user,
            createdAt: userReviews[0].createdAt
          });
        } else {
          console.log('⚠️ [Stage 2] No reviews found for this user');
        }

        // ============================================
        // STAGE 3: Enrich Reviews with Business Info
        // ============================================
        console.log('🔄 [Stage 3] Enriching reviews with business data...');

        // The backend already populates the business field, so we don't need to fetch all businesses
        // unless the population failed
        const enrichedReviews = userReviews.map((review, index) => {
          console.log(`   [Review ${index + 1}/${userReviews.length}] Processing:`, {
            reviewId: review._id,
            businessPopulated: !!review.business,
            businessData: review.business
          });

          // The backend populates 'business' field with { _id, name, category, location }
          const businessInfo = review.business || {};

          // Get food name from business name or use default
          const foodName = businessInfo.name || 'Special Dish';

          const enriched = {
            id: review._id,
            rating: review.rating,
            body: review.body,
            createdAt: review.createdAt,
            helpfulCount: review.helpfulCount || 0,
            business: {
              name: businessInfo.name || 'Unknown Restaurant',
              category: businessInfo.category,
              location: businessInfo.location?.address || businessInfo.location || 'Unknown Location',
            },
            food: {
              name: foodName,
              price: null, // Menu items are separate
              currency: 'ETB',
              image: foodImages[foodName] || foodImages[foodName.toUpperCase()] || foodImages.default
            }
          };

          console.log(`   ✅ [Review ${index + 1}] Enriched:`, {
            id: enriched.id,
            businessName: enriched.business.name,
            foodName: enriched.food.name,
            imageFound: !!enriched.food.image
          });

          return enriched;
        });

        console.log('✅ [Stage 3] All reviews enriched. Total:', enrichedReviews.length);

        // ============================================
        // STAGE 4: Set Reviews State
        // ============================================
        if (enrichedReviews.length === 0) {
          console.log('⚠️ [Stage 4] No reviews found.');
          setRecentReviews([]);
        } else {
          console.log('✅ [Stage 4] Setting enriched reviews to state');
          setRecentReviews(enrichedReviews);
        }

        console.log('🎉 [UserProfile] Data fetch completed successfully!');

      } catch (error) {
        console.error('❌ [UserProfile] ERROR during data fetch:', error);
        console.error('   - Error name:', error.name);
        console.error('   - Error message:', error.message);
        console.error('   - Error stack:', error.stack);

        // Fallback mock data
        console.log('🔄 [UserProfile] Loading fallback data...');

        const fallbackUser = {
          id: 'fallback-u1',
          name: 'Guest User',
          avatar: 'https://i.pravatar.cc/150?img=1',
          location: '5K Dormitory, AAU',
          description: 'Food enthusiast & coffee lover. Always exploring new campus spots!',
          followers: 0,
          following: 0,
          email: 'guest@aau.edu.et',
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

        setRecentReviews([]);

        console.log('✅ [UserProfile] Fallback data loaded');
      } finally {
        setLoading(false);
        console.log('🏁 [UserProfile] Loading state set to false');
      }
    };

    fetchUserData();
  }, []);


  // Handle edit profile
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      console.log('💾 [UserProfile] Saving profile changes...');

      // Prepare update data - only send fields that can be updated
      const updateData = {
        name: editedUser.name,
        description: editedUser.description,
        avatar: editedUser.avatar,
      };

      console.log('📤 [UserProfile] Update data:', updateData);

      // Call the API to update profile
      // ✅ CORRECT: apiClient already returns parsed JSON
      const data = await authService.updateProfile(updateData);

      console.log('✅ [UserProfile] Profile update response:', data);

      if (!data.success) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local state with the response data
      const updatedUser = {
        ...user,
        ...data.data,
        location: editedUser.location, // Keep the formatted location
      };

      console.log('✅ [UserProfile] Updated user state:', updatedUser);

      setUser(updatedUser);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('❌ [UserProfile] Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
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
                      ROLE:
                    </div>
                    <div className="stat-value">{formatRole(user.role || 'user')}</div>
                  </div>
                  {/* Followers/Following removed by request */}

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