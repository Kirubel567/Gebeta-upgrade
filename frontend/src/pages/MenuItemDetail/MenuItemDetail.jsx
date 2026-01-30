import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { menuService, reviewService } from "../../api/apiService"; // Added backend services
import "./MenuItemDetail.css";

const MenuItemDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { menuItem, business } = location.state || {};

  const [allMenuItems, setAllMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [foodReviews, setFoodReviews] = useState([]);
  const [allData, setAllData] = useState(null);

  const handleGoToReview = () => {
    navigate("/submit-review", {
      state: {
        business: business,
        menuItem: menuItem,
        isMenuReview: true,
      },
    });
  };
  // Fetch all data from Backend (Replaced db.json)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        /* const response = await fetch('/db.json');
        const data = await response.json();
        setAllData(data);
        */

        // BACKEND LOGIC: Fetch menu items for this business
        if (business && (business.id || business._id)) {
          const busId = business._id || business.id;
          const response = await menuService.getByBusinessId(busId);

          if (response.success) {
            // Mapping backend structure to match your component's expected keys
            const formattedMenuItems = response.data.map((item) => ({
              id: item._id,
              itemName: item.name,
              description: item.description,
              price: item.price,
              currency: item.currency,
              category: item.category,
              // Use the primary image from the array, or the first one
              image:
                item.images?.find((img) => img.isPrimary)?.url ||
                item.images?.[0]?.url,
              allImages: item.images?.map((img) => img.url) || [], // Store full array for thumbnails
              rating: parseFloat(item.rating?.average) || 4.5,
              reviewCount: item.rating?.count || 0,
              isPopular: item.isPopular,
              isAvailable: item.isAvailable,
            }));

            setAllMenuItems(formattedMenuItems);

            // Find index of the item we clicked on
            if (menuItem) {
              const foundIndex = formattedMenuItems.findIndex(
                (item) => item.id === (menuItem._id || menuItem.id),
              );
              if (foundIndex !== -1) setCurrentItemIndex(foundIndex);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data from backend:", error);
        setAllMenuItems(mockMenuItems);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [business, menuItem]);

  /* const getMenuItemImage = (itemId) => { ... };
   */

  // Fetch reviews from Backend for current menu item
  useEffect(() => {
    const fetchItemReviews = async () => {
      if (!allMenuItems.length) return;
      const currentItem = allMenuItems[currentItemIndex];

      try {
        // BACKEND LOGIC: Fetching reviews specific to this MenuItem
        const response = await reviewService.getByBusinessId(
          business._id || business.id,
        );

        if (response.success) {
          // Filter reviews that belong to this specific menu item (if your backend supports it)
          // or show business reviews as a fallback
          const filteredReviews = response.data.filter(
            (rev) => rev.menuItem === currentItem.id,
          );

          const formattedReviews = (
            filteredReviews.length > 0 ? filteredReviews : response.data
          ).map((review) => ({
            id: review._id,
            user: {
              name: review.user?.name || "User",
              avatar: review.user?.avatar,
              university: review.user?.university || "AAU",
            },
            rating: review.rating,
            body: review.body,
            createdAt: review.createdAt,
          }));

          setFoodReviews(formattedReviews.slice(0, 5)); // Limit to 5 for UI
        }
      } catch (error) {
        console.error("Error fetching backend reviews:", error);
      }
    };

    fetchItemReviews();
  }, [currentItemIndex, allMenuItems, business]);

  /*
  const generateItemSpecificReview = (itemName, originalReview) => { ... };
  */

  // Mock data (Keep for safety)
  const mockMenuItems = [
    {
      id: "m1",
      itemName: "BEYAYNETU",
      description:
        "Traditional Ethiopian platter with assorted vegetables and injera",
      price: 120,
      currency: "ETB",
      category: "main",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800",
      rating: 4.5,
      isPopular: true,
      isAvailable: true,
    },
  ];

  const itemReviewsData = {
    /* ... */
  };

  const currentItem = allMenuItems[currentItemIndex] || mockMenuItems[0];

  // Logic for the 4 Small Photos - using the dynamic images array from backend
  const smallImages =
    currentItem.allImages && currentItem.allImages.length > 0
      ? currentItem.allImages.slice(0, 4)
      : Array(4).fill(currentItem.image);

  const handleNextItem = () =>
    setCurrentItemIndex((prev) => (prev + 1) % allMenuItems.length);
  const handlePrevItem = () =>
    setCurrentItemIndex(
      (prev) => (prev - 1 + allMenuItems.length) % allMenuItems.length,
    );
  const handleBack = () => navigate(-1);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++)
      stars.push(<i key={`full-${i}`} className="fa-solid fa-star"></i>);
    if (hasHalfStar)
      stars.push(<i key="half" className="fa-solid fa-star-half-stroke"></i>);
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++)
      stars.push(<i key={`empty-${i}`} className="fa-regular fa-star"></i>);
    return stars;
  };

  if (loading) {
    return (
      <div className="menu-item-modal-overlay">
        <div className="modal-loading-wrapper">
          {" "}
          {/* Targeted wrapper */}
          <div className="spinner"></div>
          <p>Loading menu item details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-item-modal-overlay">
      <div className="menu-item-modal-container">
        <button className="modal-back-btn" onClick={handleBack}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>

        <div className="menu-item-modal-content">
          <div className="modal-left-section">
            <div className="modal-large-image-container">
              <img
                src={currentItem.image}
                alt={currentItem.itemName}
                className="modal-large-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800";
                }}
              />

              <div className="modal-food-overlay">
                <div className="modal-food-basic">
                  <h1>{currentItem.itemName}</h1>
                  <div className="modal-food-price">
                    {currentItem.price} {currentItem.currency}
                  </div>
                </div>

                <div className="modal-food-rating">
                  {renderStars(currentItem.rating || 4.5)}
                  <span>
                    {(currentItem.rating || 4.5).toFixed(1)} (
                    {currentItem.reviewCount || 0} reviews)
                  </span>
                </div>

                <p className="modal-food-desc">{currentItem.description}</p>
              </div>
            </div>
          </div>

          <div className="modal-right-section">
            <div className="modal-food-navigation">
              <button className="modal-nav-arrow" onClick={handlePrevItem}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <h2 className="modal-food-title">{currentItem.itemName}</h2>
              <button className="modal-nav-arrow" onClick={handleNextItem}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            <div className="modal-small-photos">
              <h3>More Photos</h3>
              <div className="modal-photos-grid">
                {smallImages.map((img, index) => (
                  <div key={index} className="modal-small-photo">
                    <img src={img} alt={`${currentItem.itemName} ${index}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-review-section">
              <h3 className="modal-review-heading">Customer Reviews</h3>
              <div className="modal-reviews-container">
                {foodReviews.map((review) => (
                  <div key={review.id} className="modal-review-card">
                    <div className="modal-reviewer-info">
                      <img
                        src={review.user?.avatar}
                        alt={review.user?.name}
                        className="modal-reviewer-avatar"
                      />
                      <div className="modal-reviewer-details">
                        <h4>{review.user?.name}</h4>
                        <p>{review.user?.university}</p>
                        <div className="modal-review-stars">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="modal-review-text">{review.body}</p>
                    <div className="modal-review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="review-prompt-box">
              <button className="btn btn-primary" onClick={handleGoToReview}>
                Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetail;
