import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './SubmitReview.css';

const SubmitReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { business: businessFromState, onReviewSubmit } = location.state || {};
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState({ reviews: true });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [businessData, setBusinessData] = useState(null);
  const [allData, setAllData] = useState(null);

  // Fetch all data from db.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/db.json');
        const data = await response.json();
        setAllData(data);
        
        // Get business data
        let businessInfo;
        if (businessFromState) {
          businessInfo = businessFromState;
        } else {
          // Get first business from db.json as default
          const defaultBusiness = data.businesses[0];
          businessInfo = {
            id: defaultBusiness.id,
            name: defaultBusiness.name,
            image: defaultBusiness.image?.[0]?.url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
            location: defaultBusiness.location?.address || 'Unknown Location',
            category: defaultBusiness.category,
            rating: defaultBusiness.rating?.average || 0,
            reviews: defaultBusiness.rating?.count || 0
          };
        }
        setBusinessData(businessInfo);

        // Get recent reviews for this business
        const businessReviews = data.reviews
          .filter(review => review.businessId === businessInfo.id && review.isApproved)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        // Add user info to reviews
        const reviewsWithUsers = businessReviews.map(review => {
          const user = data.users.find(u => u.id === review.userId) || {
            name: 'Anonymous',
            avatar: 'https://i.pravatar.cc/150?img=0',
            university: 'AAU',
            dormitory: 'Unknown'
          };
          
          return {
            id: review.id,
            user: {
              name: user.name,
              avatar: user.avatar,
              university: `${user.dormitory}, ${user.university}`
            },
            rating: review.rating,
            body: review.body,
            createdAt: review.createdAt
          };
        });

        setRecentReviews(reviewsWithUsers);

      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback data
        setBusinessData({
          id: 'b1',
          name: 'STUDENT CENTER CAFETERIA',
          image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
          location: '5K DORMITORY',
          category: 'on-campus',
          rating: 4.5,
          reviews: 234
        });
        
        setRecentReviews([
          {
            id: 'r1',
            user: {
              name: 'SELAM TADESSE',
              university: '6K, AAU',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D'
            },
            rating: 5,
            body: 'I had an amazing experience at this restaurant! The place was clean, beautifully decorated, and the staff were incredibly polite. I ordered the beef tibs with injera, and it...',
            createdAt: '2026-01-18T10:30:00Z'
          },
          {
            id: 'r2',
            user: {
              name: 'MIHIRET ADMASU',
              university: '5K, AAU',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
            },
            rating: 4,
            body: 'Great food quality and reasonable prices. The service could be faster during peak hours though.',
            createdAt: '2026-01-17T14:20:00Z'
          }
        ]);
      } finally {
        setLoading(prev => ({ ...prev, reviews: false }));
      }
    };

    fetchData();
  }, [businessFromState]);

  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  const handleStarHover = (starIndex) => {
    setHoverRating(starIndex + 1);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      setMessage({ type: 'error', text: 'Please select a rating' });
      return;
    }

    if (!reviewText.trim()) {
      setMessage({ type: 'error', text: 'Please write your review' });
      return;
    }

    if (!businessData) {
      setMessage({ type: 'error', text: 'Error loading business data' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Create new review
      const newReviewId = `r${Date.now()}`;
      const currentUser = allData?.users?.[0] || {
        id: 'u1',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        university: 'AAU',
        dormitory: '5K',
        yearOfStudy: 'Student'
      };

      const newReview = {
        id: newReviewId,
        user: {
          name: currentUser.name,
          avatar: currentUser.avatar,
          university: `${currentUser.dormitory || ''}, ${currentUser.university || 'AAU'}`
        },
        rating: rating,
        body: reviewText,
        createdAt: new Date().toISOString()
      };

      // Call the callback function if provided
      if (onReviewSubmit) {
        onReviewSubmit(newReview);
      }

      setMessage({ 
        type: 'success', 
        text: 'Review submitted successfully! Thank you for your feedback.' 
      });

      // Reset form
      setRating(0);
      setReviewText('');
      setHoverRating(0);

      // Add the new review to recent reviews
      setRecentReviews(prev => [newReview, ...prev.slice(0, 2)]);

      // Redirect back to business page after 2 seconds
      setTimeout(() => {
        navigate(`/customer-review`, { 
          state: { 
            business: businessData,
            scrollToReviews: true 
          } 
        });
      }, 2000);

    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to submit review. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count, interactive = false) => {
    return Array(5).fill(0).map((_, index) => {
      const starValue = index + 1;
      let starClass = 'fa-regular fa-star';
      
      if (interactive) {
        const displayRating = hoverRating || rating;
        starClass = starValue <= displayRating ? 'fa-solid fa-star active' : 'fa-regular fa-star';
      } else {
        starClass = starValue <= count ? 'fa-solid fa-star' : 'fa-regular fa-star';
      }
      
      return interactive ? (
        <i 
          key={index} 
          className={starClass}
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => handleStarHover(index)}
          onMouseLeave={handleStarLeave}
          style={{ 
            cursor: 'pointer', 
            transition: 'all 0.2s ease',
            transform: hoverRating >= starValue ? 'scale(1.2)' : 'scale(1)'
          }}
        ></i>
      ) : (
        <i key={index} className={starClass}></i>
      );
    });
  };

  if (!businessData) {
    return (
      <main>
        <div className="submit-review-container">
          <div className="loading">
            <p>Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="submit-review-container">
        {/* Submit Form Area */}
        <div className="submit-form-area">
          <div className="place-info">
            <img 
              src={businessData.image} 
              alt={businessData.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop';
              }}
            />
            <div className="cafeteriaDescription">
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>
                {businessData.name}
              </h3>
              <p style={{ color: 'var(--text-grey)', margin: 0 }}>
                {businessData.location}
              </p>
            </div>
          </div>
          
          <hr className="divider" />
          
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '15px' }}>
            How would you rate your experience?
          </h3>
          
          <div className="rating-select">
            {renderStars(0, true)}
            <span style={{ fontSize: '1rem', marginLeft: '15px' }}>
              {rating ? `${rating} out of 5` : 'SELECT YOUR RATING'}
            </span>
          </div>
          
          <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
            TELL US ABOUT YOUR EXPERIENCE
          </p>
          
          <div className="form-group">
            <textarea 
              name="experience" 
              id="experience" 
              placeholder="Share details about your experience, food quality, service, atmosphere..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="8"
              maxLength="500"
            ></textarea>
            <div style={{ 
              textAlign: 'right', 
              fontSize: '0.8rem', 
              color: 'var(--text-grey)',
              marginTop: '5px'
            }}>
              {reviewText.length}/500 characters
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`message ${message.type}`} style={{
              padding: '15px',
              margin: '20px 0',
              borderRadius: '10px',
              backgroundColor: message.type === 'success' 
                ? 'rgba(57, 255, 20, 0.1)' 
                : 'rgba(255, 107, 107, 0.1)',
              color: message.type === 'success' 
                ? 'var(--accent-green)' 
                : '#ff6b6b',
              border: `1px solid ${message.type === 'success' 
                ? 'var(--accent-green)' 
                : '#ff6b6b'}`,
              textAlign: 'center'
            }}>
              {message.text}
              {message.type === 'success' && (
                <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                  Redirecting back to {businessData.name}...
                </div>
              )}
            </div>
          )}

          <Button 
            variant="primary" 
            size="large"
            disabled={submitting || !rating || !reviewText.trim()}
            onClick={handleSubmitReview}
          >
            {submitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                Submitting...
              </>
            ) : (
              'Post'
            )}
          </Button>

        </div>

        {/* Recent Reviews Area */}
        <div className="recent-reviews-area">
          <h2 className="section-title" style={{ fontSize: '1.8rem' }}>
            Recent Reviews
          </h2>
          <hr className="divider" />

          {loading.reviews ? (
            <div className="loading-small">
              <p>Loading recent reviews...</p>
            </div>
          ) : recentReviews.length > 0 ? (
            recentReviews.map((review) => (
              <div className="review-item" key={review.id} style={{ marginBottom: '20px' }}>
                <div className="review-header">
                  <img 
                    className="reviewer-img" 
                    src={review.user?.avatar} 
                    alt={review.user?.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://i.pravatar.cc/150?img=0';
                    }}
                  />
                  <div className="reviewer-info">
                    <h4>{review.user?.name}</h4>
                    <p>{review.user?.university || ''}</p>
                    <div className="rating-stars" style={{ fontSize: '0.8rem', margin: 0 }}>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <p className="review-body">
                  {review.body.length > 150 
                    ? `${review.body.substring(0, 150)}...` 
                    : review.body}
                </p>
                {review.body.length > 150 && (
                  <Link to={`/customer-review`} state={{ business: businessData }}>
                    <Button variant="outline" size="small">
                      READ MORE
                    </Button>
                  </Link>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-grey)', textAlign: 'center', padding: '20px' }}>
              No reviews yet. Be the first to review!
            </p>
          )}

          {/* View All Reviews Button */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to={`/customer-review`} state={{ business: businessData }}>
              <Button variant="outline">
                View All Reviews
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SubmitReview;