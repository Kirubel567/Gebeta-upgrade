import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { businessService, reviewService } from "../../api/apiService";
import Button from "../../components/Button/Button";
import "./SubmitReview.css";

const SubmitReview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Destructure state from navigation (Safe Destructuring)
  const {
    business: businessFromState,
    menuItem: menuItemFromState,
    isMenuReview
  } = location.state || {}; // Handle null state case

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [displayData, setDisplayData] = useState(null);

  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        setLoading(true);
        // Handle both _id and id (just in case)
        const businessId = businessFromState?._id || businessFromState?.id;

        if (!businessId) {
          // If no business ID, we can't do anything
          setLoading(false);
          return;
        }

        const [busRes, reviewRes] = await Promise.all([
          businessService.getById(businessId),
          reviewService.getByBusinessId(businessId),
        ]);

        const bData = busRes.data?.data || busRes.data;
        const allReviews = reviewRes.data?.data || reviewRes.data;

        // 2. Set UI Display Context (Menu vs Business)
        if (isMenuReview && menuItemFromState) {
          const mId = menuItemFromState.id || menuItemFromState._id;
          setDisplayData({
            name: menuItemFromState.itemName || menuItemFromState.name,
            image: menuItemFromState.image,
            // SAFE ACCESS: Ensure we access address string, update fallback
            subtext: `at ${bData.name}`,
            businessId: bData._id,
            menuItemId: mId
          });

          // Filter sidebar for this specific food item
          const filtered = Array.isArray(allReviews) ? allReviews
            .filter(rev => rev.menuItem === mId)
            .slice(0, 3) : [];
          setRecentReviews(filtered);
        } else {
          // SAFE ACCESS: Check if location is object or string
          const addressString = typeof bData.location === 'object'
            ? bData.location?.address
            : bData.location;

          setDisplayData({
            name: bData.name,
            // Ensure first image url or fallback string
            image: bData.image?.[0]?.url || (typeof bData.image === 'string' ? bData.image : "") || "",
            subtext: addressString || "AAU Campus",
            businessId: bData._id,
            menuItemId: null
          });
          setRecentReviews(Array.isArray(allReviews) ? allReviews.slice(0, 3) : []);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
        setMessage({ type: "error", text: "Could not load details." });
      } finally {
        setLoading(false);
      }
    };

    fetchBackendData();
  }, [businessFromState, menuItemFromState, isMenuReview, navigate]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      // 3. Match the payload exactly to your Backend Controller
      const reviewPayload = {
        rating: rating,
        body: reviewText,
        businessId: displayData.businessId,
        menuItem: displayData.menuItemId // Will be null if it's a business review
      };

      await reviewService.create(reviewPayload);

      setMessage({
        type: "success",
        text: `Successfully reviewed ${displayData?.name}!`,
      });

      // Clear form and redirect
      setRating(0);
      setReviewText("");
      setTimeout(() => {
        navigate(`/customer-review/${displayData.businessId}`);
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to submit review.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  // Star Helper
  const renderStars = (count, interactive = false) => {
    return Array(5).fill(0).map((_, index) => {
      const starValue = index + 1;
      const displayRating = interactive ? (hoverRating || rating) : count;
      const isFull = starValue <= displayRating;

      return (
        <i
          key={index}
          className={isFull ? "fa-solid fa-star active" : "fa-regular fa-star"}
          onClick={interactive ? () => setRating(starValue) : null}
          onMouseEnter={interactive ? () => setHoverRating(starValue) : null}
          onMouseLeave={interactive ? () => setHoverRating(0) : null}
          style={{ cursor: interactive ? "pointer" : "default" }}
        ></i>
      );
    });
  };

  // 3. Fix Blank Screen: Guard Clauses
  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>;
  if (!displayData) return <div className="error-container"><p>Business not found.</p><Button variant="outline" onClick={() => navigate('/reviews')}>Back</Button></div>;

  return (
    <main>
      <div className="submit-review-container">
        <div className="submit-form-area">
          <div className="place-info">
            <img
              src={displayData.image}
              alt={displayData.name}
              onError={(e) => e.target.src = "https://via.placeholder.com/150"}
            />
            <div className="cafeteriaDescription">
              {/* SAFE RENDERING: Ensure these are strings */}
              <h3 style={{ margin: 0, fontFamily: "var(--font-heading)" }}>{displayData.name}</h3>
              <p style={{ color: "var(--accent-green)", fontWeight: "bold", margin: 0 }}>
                {displayData.subtext}
              </p>
            </div>
          </div>

          <hr className="divider" />

          <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "15px" }}>
            How was the {isMenuReview ? 'food' : 'service'}?
          </h3>

          <div className="rating-select">
            {renderStars(0, true)}
            <span style={{ fontSize: "1rem", marginLeft: "15px" }}>
              {rating ? `${rating} out of 5` : "SELECT RATING"}
            </span>
          </div>

          <div className="form-group">
            <textarea
              placeholder="What did you like or dislike? Help other students!"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="6"
            ></textarea>
          </div>

          {message.text && (
            <div className={`message ${message.type}`} style={{
              padding: "10px", margin: "10px 0", borderRadius: "8px",
              backgroundColor: message.type === "success" ? "rgba(57, 255, 20, 0.1)" : "rgba(255, 107, 107, 0.1)",
              color: message.type === "success" ? "var(--accent-green)" : "#ff6b6b",
              border: `1px solid ${message.type === "success" ? "var(--accent-green)" : "#ff6b6b"}`,
              textAlign: "center"
            }}>
              {message.text}
            </div>
          )}

          <Button variant="primary" size="large" disabled={submitting || !rating || !reviewText.trim()} onClick={handleSubmitReview}>
            {submitting ? "Submitting..." : "Post Review"}
          </Button>
        </div>

        <div className="recent-reviews-area">
          <h2 className="section-title">Recent Reviews</h2>
          <hr className="divider" />
          {recentReviews.length > 0 ? (
            recentReviews.map((review) => (
              <div className="review-item" key={review._id}>
                <div className="review-header">
                  <img className="reviewer-img" src={review.user?.avatar || "https://via.placeholder.com/40"} alt="User" />
                  <div className="reviewer-info">
                    {/* Safe Access for User Name */}
                    <h4>{review.user?.name || "Student"}</h4>
                    <div className="rating-stars">{renderStars(review.rating)}</div>
                  </div>
                </div>
                {/* Safe Access for Review Body */}
                <p className="review-body">{review.body || review.comment}</p>
              </div>
            ))
          ) : (
            <p>Be the first to review this {isMenuReview ? 'item' : 'place'}!</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default SubmitReview;