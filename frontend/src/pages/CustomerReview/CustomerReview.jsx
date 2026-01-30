import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import {
  businessService,
  menuService,
  reviewService,
  authService,
} from "../../api/apiService"; // NEW: API Services
import MenuFormModal from "../../components/MenuFormModal/MenuFormModal"; // NEW: Menu Modal
import { handleApiError } from "../../utils/errorHandler"; // NEW: Error Handler
import "./CustomerReview.css";

const CustomerReview = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [error, setError] = useState(null); // NEW: Error state

  // Menu Management State
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    // Fetch current user for permission checks
    const fetchUser = async () => {
      try {
        const res = await authService.getProfile();
        if (res.data) setCurrentUser(res.data);
      } catch (err) {
        // User not logged in, ignore
      }
    };
    fetchUser();
  }, []);

  const isOwner = currentUser && business &&
    (currentUser.role === 'business_owner' || currentUser.role === 'admin') &&
    (business.owner === currentUser._id || business.owner?._id === currentUser._id);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item, e) => {
    e.stopPropagation(); // Prevent card click
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteMenu = async (itemId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await menuService.delete(itemId);
        // Refresh items (optimistic or re-fetch). Let's filter out.
        setMenuItems(prev => prev.filter(i => i._id !== itemId));
      } catch (err) {
        console.error("Failed to delete", err);
        alert("Failed to delete item");
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      // Format payload for backend (matching Schema: images array)
      const imagePayload = formData.image ? [{
        url: formData.image,
        isPrimary: true
      }] : [];

      const payload = {
        ...formData,
        business: business._id,
        images: imagePayload.length > 0 ? imagePayload : undefined
      };

      // Remove raw 'image' field if it exists (schema doesn't use it, but our form does)
      delete payload.image;

      if (editingItem) {
        // Update
        const res = await menuService.update(editingItem._id, payload);
        if (res.success) {
          // Update local state
          const updatedItem = {
            ...res.data,
            image: res.data.images?.find(i => i.isPrimary)?.url || res.data.images?.[0]?.url || ""
          };
          setMenuItems(prev => prev.map(i => i._id === updatedItem._id ? updatedItem : i));
        }
      } else {
        // Create
        const res = await menuService.create(payload);
        if (res.success) {
          const newItem = {
            ...res.data,
            image: res.data.images?.find(i => i.isPrimary)?.url || res.data.images?.[0]?.url || ""
          };
          setMenuItems(prev => [newItem, ...prev]);
        }
      }
    } catch (err) {
      console.error("Error saving menu item:", err);
      alert("Failed to save menu item");
    }
  };

  // ============================================================
  // ORIGINAL CODE - COMMENTED OUT FOR REFERENCE
  // ============================================================
  /*
  // JSON Server base URL
  const API_BASE = 'http://localhost:3001';

  // Original image mapping for different categories
  const originalImages = {
    'on-campus': {
      mainImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
      foodImage: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1000&auto=format&fit=crop'
    },
    'delivery': {
      mainImage: 'https://images.unsplash.com/photo-1587476351660-e9fa4bb8b26c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D',
      foodImage: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop'
    },
    'off-campus': {
      mainImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D',
      foodImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'
    }
  };

  // Mock menu items
  const mockMenuItems = [ ... ]; // (keeping your list of 8 items)

  useEffect(() => {
    const fetchBusinessData = async () => { ... };
    const fetchReviews = async () => { ... };
    const fetchMenuItems = async () => { ... };
    fetchBusinessData();
    fetchReviews();
    fetchMenuItems();
  }, [location, params.id]);

  const getFallbackBusiness = (id) => { ... };
  const mockReviews = [ ... ];
  */
  // ============================================================

  // NEW BACKEND FETCH LOGIC
  useEffect(() => {
    const fetchAllData = async () => {
      const businessId = params.id;

      if (!businessId) {
        setError("Invalid Business ID");
        setLoading(false);
        return;
      }
      try {
        // Inside fetchAllData try block:
        const [busRes, menuRes, reviewRes] = await Promise.all([
          businessService.getById(businessId),
          menuService.getByBusinessId(businessId),
          reviewService.getByBusinessId(businessId),
        ]);

        // FORMAT THE MENU ITEMS HERE
        const formattedMenu = menuRes.data.map((item) => ({
          ...item,
          id: item._id, // Ensure we have 'id' for the Detail page logic
          // Extract the primary image string for the thumbnail
          image:
            item.images?.find((img) => img.isPrimary)?.url ||
            item.images?.[0]?.url ||
            "",
        }));

        setBusiness({
          ...busRes.data,
          mainImage: busRes.data.image?.[0]?.url || "",
        });

        setMenuItems(formattedMenu); // Save the formatted version
        const businessOnlyReviews = reviewRes.data.filter(
          (review) => !review.menuItem,
        );
        setReviews(businessOnlyReviews);
      } catch (err) {
        handleApiError(err, setError);
        console.error("Backend fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [params.id]);

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
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handleLoadMoreReviews = async () => {
    // Current logic uses local state, you can extend this to fetch "page 2" from backend later
    setShowAllReviews(true);
  };

  const handleMenuItemClick = (menuItem) => {
    navigate("/menu-item", {
      state: {
        menuItem: menuItem,
        business: business,
      },
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading business details...</p>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="error-container">
        <p>{error || "No business data found."}</p>
        <Link to="/reviews">
          <button className="btn btn-primary">Back to Reviews</button>
        </Link>
      </div>
    );
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const businessRating = business.rating?.average || 0;
  const reviewCount = business.rating?.count || 0;

  return (
    <main>
      {/* Business Header Section */}
      <section className="container" style={{ padding: "40px 20px" }}>
        <h2 className="section-title">
          {business.category?.toUpperCase() || "BUSINESS"}
        </h2>

        <div className="hero-grid">
          <div className="main-card">
            <div
              className="main-card-image"
              style={{ backgroundImage: `url('${business.mainImage}')` }}
            ></div>
            <div className="main-card-content">
              <h3>{business.name}</h3>
              <div className="rating-stars">
                {renderStars(businessRating)}
                <span>
                  {Number(businessRating).toFixed(1)} ({reviewCount} REVIEWS)
                </span>
              </div>
              <div className="card-details">
                <div>
                  <i className="fa-solid fa-location-dot"></i>{" "}
                  {business.location?.address || "AAU Campus"}
                </div>
                <div>
                  {business.isFeatured && (
                    <>
                      <i className="fa-solid fa-star"></i> Featured Business
                      &nbsp; &nbsp; &nbsp;
                    </>
                  )}
                  <i className="fa-solid fa-calendar"></i> Open:{" "}
                  {business.hours?.openTime} - {business.hours?.closeTime}
                </div>
                {business.description && (
                  <div style={{ marginTop: "10px", fontStyle: "italic" }}>
                    {business.description}
                  </div>
                )}
              </div>
              <div style={{ marginTop: "20px" }}>
                <Link to="/submit-review" state={{ business: business }}>
                  <button className="btn btn-primary">Review</button>
                </Link>
              </div>
            </div>
          </div>

          <div className="peek-card">
            <div
              className="peek-image"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400&auto=format&fit=crop')`,
                height: "200px",
              }}
            ></div>
            <div
              className="peek-image"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=400&auto=format&fit=crop')`,
                marginTop: "10px",
                height: "200px",
              }}
            ></div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Menu Section */}
      <section className="container" style={{ padding: "40px 20px" }}>
        <div className="menu-header-row">
          <h2 className="section-title" style={{ marginBottom: 0 }}>MENU</h2>
          {isOwner && (
            <button className="add-menu-btn" onClick={handleOpenCreateModal}>
              <i className="fa-solid fa-plus"></i> Add Menu Item
            </button>
          )}
        </div>
        <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "20px" }}>
          TOP ITEMS
        </h3>

        <div className="menu-horizontal-scroll">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="menu-card clickable-menu-item"
              onClick={() => handleMenuItemClick(item)}
            >
              {isOwner && (
                <div className="menu-admin-actions">
                  <button className="action-btn edit-btn" onClick={(e) => handleOpenEditModal(item, e)} title="Edit">
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button className="action-btn delete-btn" onClick={(e) => handleDeleteMenu(item._id, e)} title="Delete">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              )}

              {!item.isAvailable && (
                <div className="sold-out-overlay">
                  Sold Out
                </div>
              )}

              {(item.rating?.average > 3 || item.isPopular) && (
                <div className="menu-badge popular-badge">Popular</div>
              )}

              <div className="menu-image-wrapper">
                <img src={item.image} alt={item.name} />
                <div className="menu-price-tag">
                  {item.price} {item.currency}
                </div>
              </div>
              <h4 style={{ margin: "10px 0" }}>{item.name.toUpperCase()}</h4>
              <div
                className="rating-stars"
                style={{ fontSize: "0.8rem", marginBottom: "10px" }}
              >
                {renderStars(item.rating?.average || 0)}
                <span>
                  {(item.rating?.average || 0).toFixed(1)} (
                  {item.rating?.count || 0})
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* Reviews Section */}
      <section className="container" style={{ padding: "40px 20px" }}>
        <h2 className="section-title">CUSTOMER REVIEWS</h2>

        <div className="reviews-list">
          {displayedReviews.length > 0 ? (
            displayedReviews.map((review) => {
              const isExpanded = expandedReviews[review._id];
              const reviewBody = review.comment || review.body || "";
              const displayText =
                isExpanded || reviewBody.length <= 200
                  ? reviewBody
                  : `${reviewBody.substring(0, 200)}...`;

              return (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <img
                      className="reviewer-img"
                      src={
                        review.user?.avatar || "https://via.placeholder.com/50"
                      }
                      alt="User"
                    />
                    <div className="reviewer-info">
                      <h4>{review.user?.name || "Anonymous"}</h4>
                      <p>{review.user?.dormitory || "Student"}</p>
                      <div
                        className="rating-stars"
                        style={{ fontSize: "0.8rem", margin: 0 }}
                      >
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="review-body">{displayText}</p>

                  {reviewBody.length > 200 && (
                    <button
                      className="btn btn-outline read-more-btn"
                      onClick={() => toggleReviewExpansion(review._id)}
                    >
                      {isExpanded ? "SHOW LESS" : "READ MORE"}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p>No reviews yet for this business.</p>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          {!showAllReviews && reviews.length > 3 && (
            <button className="btn btn-outline" onClick={handleLoadMoreReviews}>
              View More Reviews
            </button>
          )}
        </div>
      </section>
      <MenuFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingItem}
        isEditing={!!editingItem}
      />
    </main>
  );
};

export default CustomerReview;
// import React, { useState, useEffect } from 'react';
// import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';
// import './CustomerReview.css';

// const CustomerReview = () => {
//   const location = useLocation();
//   const params = useParams();
//   const navigate = useNavigate();
//   const [business, setBusiness] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [reviews, setReviews] = useState([]);
//   const [menuItems, setMenuItems] = useState([]);
//   const [expandedReviews, setExpandedReviews] = useState({});
//   const [showAllReviews, setShowAllReviews] = useState(false);

//   // JSON Server base URL
//   const API_BASE = 'http://localhost:3001';

//   // Original image mapping for different categories
//   const originalImages = {
//     'on-campus': {
//       mainImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
//       foodImage: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1000&auto=format&fit=crop'
//     },
//     'delivery': {
//       mainImage: 'https://images.unsplash.com/photo-1587476351660-e9fa4bb8b26c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D',
//       foodImage: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop'
//     },
//     'off-campus': {
//       mainImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D',
//       foodImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'
//     }
//   };

//   // Mock menu items (since your db.json only has 1 menu item)
//   const mockMenuItems = [
//     {
//       id: 'm1',
//       itemName: 'BEYAYNETU',
//       description: 'Traditional Ethiopian platter with assorted vegetables and injera',
//       price: 120,
//       currency: 'ETB',
//       category: 'main',
//       rating: 4.5,
//       isPopular: true,
//       isAvailable: true
//     },
//     {
//       id: 'm2',
//       itemName: 'DORO WOT',
//       description: 'Spicy chicken stew served with injera',
//       price: 150,
//       currency: 'ETB',
//       category: 'main',
//       rating: 4.8,
//       isPopular: true,
//       isAvailable: true
//     },
//     {
//       id: 'm3',
//       itemName: 'TIBES',
//       description: 'Fried meat cubes with spices and vegetables',
//       price: 180,
//       currency: 'ETB',
//       category: 'main',
//       rating: 4.3,
//       isPopular: false,
//       isAvailable: true
//     },
//     {
//       id: 'm4',
//       itemName: 'SHIRO',
//       description: 'Chickpea flour stew with spices',
//       price: 100,
//       currency: 'ETB',
//       category: 'main',
//       rating: 4.6,
//       isPopular: true,
//       isAvailable: true
//     },
//     {
//       id: 'm5',
//       itemName: 'KITFO',
//       description: 'Minced beef seasoned with spices',
//       price: 160,
//       currency: 'ETB',
//       category: 'main',
//       rating: 4.4,
//       isPopular: false,
//       isAvailable: true
//     },
//     {
//       id: 'm6',
//       itemName: 'SPAGHETTI',
//       description: 'Italian pasta with tomato sauce and cheese',
//       price: 120,
//       currency: 'ETB',
//       category: 'pasta',
//       rating: 4.2,
//       isPopular: true,
//       isAvailable: true
//     },
//     {
//       id: 'm7',
//       itemName: 'PIZZA',
//       description: 'Cheese pizza with fresh toppings',
//       price: 150,
//       currency: 'ETB',
//       category: 'fast-food',
//       rating: 4.7,
//       isPopular: true,
//       isAvailable: true
//     },
//     {
//       id: 'm8',
//       itemName: 'BURGER',
//       description: 'Beef burger with cheese and vegetables',
//       price: 110,
//       currency: 'ETB',
//       category: 'fast-food',
//       rating: 4.3,
//       isPopular: true,
//       isAvailable: true
//     }
//   ];

//   useEffect(() => {
//     const fetchBusinessData = async () => {
//       try {
//         setLoading(true);

//         // If business data is passed via state, use it
//         if (location.state?.business) {
//           const businessData = location.state.business;
//           // Add original image to the business data
//           const businessWithImage = {
//             ...businessData,
//             // Use original image based on category
//             mainImage: originalImages[businessData.category]?.mainImage || originalImages['on-campus'].mainImage
//           };
//           setBusiness(businessWithImage);
//         }
//         // Otherwise, try to fetch from JSON Server
//         else if (params.id) {
//           // JSON Server: GET /businesses/:id
//           const response = await fetch(`${API_BASE}/businesses/${params.id}`);

//           if (response.ok) {
//             const businessData = await response.json();
//             // Add original image
//             const businessWithImage = {
//               ...businessData,
//               mainImage: originalImages[businessData.category]?.mainImage || originalImages['on-campus'].mainImage
//             };
//             setBusiness(businessWithImage);
//           } else {
//             // JSON Server failed, use fallback
//             console.log('JSON Server failed, using fallback');
//             setBusiness(getFallbackBusiness(params.id));
//           }
//         } else {
//           // No ID or state, use default
//           setBusiness(getFallbackBusiness('b1'));
//         }
//       } catch (error) {
//         console.error('Error fetching business:', error);
//         setBusiness(getFallbackBusiness('b1'));
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchReviews = async () => {
//       try {
//         const businessId = location.state?.business?.id || params.id || 'b1';

//         // JSON Server: GET /reviews?businessId=b1
//         const response = await fetch(`${API_BASE}/reviews?businessId=${businessId}`);

//         if (response.ok) {
//           const reviewsData = await response.json();

//           // Get user data for each review
//           const reviewsWithUsers = await Promise.all(
//             reviewsData.map(async (review) => {
//               try {
//                 // JSON Server: GET /users/:id
//                 const userResponse = await fetch(`${API_BASE}/users/${review.userId}`);
//                 if (userResponse.ok) {
//                   const userData = await userResponse.json();
//                   return {
//                     ...review,
//                     user: {
//                       name: userData.name,
//                       avatar: userData.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
//                       university: `${userData.dormitory || ''}, ${userData.university || 'AAU'}`,
//                       yearOfStudy: userData.yearOfStudy || ''
//                     }
//                   };
//                 }
//               } catch (error) {
//                 console.error('Error fetching user:', error);
//               }

//               // Fallback user data
//               return {
//                 ...review,
//                 user: {
//                   name: 'Student',
//                   avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
//                   university: 'AAU',
//                   yearOfStudy: 'Student'
//                 }
//               };
//             })
//           );

//           setReviews(reviewsWithUsers);

//           // Initialize expanded state for reviews
//           const initialExpanded = {};
//           reviewsWithUsers.forEach(review => {
//             initialExpanded[review.id] = false;
//           });
//           setExpandedReviews(initialExpanded);
//         } else {
//           // JSON Server failed, use mock reviews
//           console.log('Reviews JSON Server failed, using mock reviews');
//           setReviews(mockReviews);
//           const initialExpanded = {};
//           mockReviews.forEach(review => {
//             initialExpanded[review.id] = false;
//           });
//           setExpandedReviews(initialExpanded);
//         }
//       } catch (error) {
//         console.error('Error fetching reviews:', error);
//         setReviews(mockReviews);
//         const initialExpanded = {};
//         mockReviews.forEach(review => {
//           initialExpanded[review.id] = false;
//         });
//         setExpandedReviews(initialExpanded);
//       }
//     };

//     const fetchMenuItems = async () => {
//       try {
//         const businessId = location.state?.business?.id || params.id || 'b1';

//         // JSON Server: GET /menu?businessId=b1
//         const response = await fetch(`${API_BASE}/menu?businessId=${businessId}`);

//         if (response.ok) {
//           const menuData = await response.json();
//           // Add original food images to menu items
//           const menuWithImages = menuData.map(item => ({
//             ...item,
//             image: originalImages['on-campus']?.foodImage || 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1000&auto=format&fit=crop'
//           }));
//           setMenuItems(menuWithImages);
//         } else {
//           // JSON Server failed, use mock menu items with images
//           console.log('Menu JSON Server failed, using mock menu');
//           const mockWithImages = mockMenuItems.map(item => ({
//             ...item,
//             image: originalImages['on-campus']?.foodImage || 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1000&auto=format&fit=crop'
//           }));
//           setMenuItems(mockWithImages);
//         }
//       } catch (error) {
//         console.error('Error fetching menu items:', error);
//         const mockWithImages = mockMenuItems.map(item => ({
//           ...item,
//           image: originalImages['on-campus']?.foodImage || 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1000&auto=format&fit=crop'
//         }));
//         setMenuItems(mockWithImages);
//       }
//     };

//     fetchBusinessData();
//     fetchReviews();
//     fetchMenuItems();
//   }, [location, params.id]);

//   // Fallback business data
//   const getFallbackBusiness = (id) => {
//     const businesses = {
//       'b1': {
//         id: 'b1',
//         name: 'DESTA CAFE',
//         slug: 'desta-cafe',
//         category: 'on-campus',
//         description: 'Great coffee and sandwiches! Student favorite spot.',
//         isFeatured: true,
//         rating: {
//           average: 4.5,
//           count: 42
//         },
//         location: {
//           address: '5K Campus, Building A'
//         },
//         hours: {
//           openTime: '07:00 AM',
//           closeTime: '09:00 PM'
//         },
//         mainImage: originalImages['on-campus'].mainImage,
//         features: {
//           isGroupFriendly: true,
//           priceRange: '$'
//         }
//       },
//       'b2': {
//         id: 'b2',
//         name: '123FASTFOOD',
//         slug: '123fastfood',
//         category: 'delivery',
//         description: 'Fast delivery and tasty burgers. Open late for students.',
//         isFeatured: true,
//         rating: {
//           average: 4.2,
//           count: 31
//         },
//         location: {
//           address: 'Near 6K Gate'
//         },
//         hours: {
//           openTime: '10:00 AM',
//           closeTime: '11:00 PM'
//         },
//         mainImage: originalImages['delivery'].mainImage,
//         features: {
//           isGroupFriendly: false,
//           priceRange: '$$'
//         }
//       },
//       'b3': {
//         id: 'b3',
//         name: 'CHRISTINA CAFE',
//         slug: 'christina-cafe',
//         category: 'on-campus',
//         description: 'Best traditional Ethiopian food on campus.',
//         isFeatured: true,
//         rating: {
//           average: 4.8,
//           count: 56
//         },
//         location: {
//           address: '4K Student Center'
//         },
//         hours: {
//           openTime: '08:00 AM',
//           closeTime: '08:00 PM'
//         },
//         mainImage: originalImages['on-campus'].mainImage,
//         features: {
//           isGroupFriendly: true,
//           priceRange: '$$'
//         }
//       }
//     };
//     return businesses[id] || businesses['b1'];
//   };

//   // Mock reviews fallback
//   const mockReviews = [
//     {
//       id: 1,
//       name: 'SELAM TADESSE',
//       year: '4th Year',
//       rating: 5,
//       image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
//       body: '"I HAD AN AMAZING EXPERIENCE AT THIS RESTAURANT! THE PLACE WAS CLEAN, BEAUTIFULLY DECORATED, AND THE STAFF WERE INCREDIBLY POLITE. I ORDERED THE BEEF TIBS WITH INJERA, AND IT WAS ABSOLUTELY PERFECT. THE FLAVORS WERE AUTHENTIC AND THE PORTION WAS VERY GENEROUS. I WILL DEFINITELY BE COMING BACK WITH MY FRIENDS NEXT WEEK!"'
//     },
//     {
//       id: 2,
//       name: 'MIHIRET ADMASU',
//       year: 'CC, AAU',
//       rating: 5,
//       image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
//       body: '"I HAD AN AMAZING EXPERIENCE AT THIS RESTAURANT! THE PLACE WAS CLEAN, BEAUTIFULLY DECORATED, AND THE STAFF WERE INCREDIBLY POLITE. TASTED FRESH AND NATURAL. NOT SUGARY LIKE OTHER PLACES. THE ATMOSPHERE WAS VERY WELCOMING AND THE PRICES ARE REASONABLE FOR STUDENTS."'
//     },
//     {
//       id: 3,
//       name: 'KENEAN ESHETU',
//       year: 'Freshman, AAU',
//       rating: 5,
//       image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
//       body: '"I HAD AN AMAZING EXPERIENCE AT THIS RESTAURANT! THE PLACE WAS CLEAN, BEAUTIFULLY DECORATED, AND THE STAFF WERE INCREDIBLY POLITE. I ORDERED THE BEEF TIBS WITH INJERA AND IT WAS SERVED HOT AND FRESH. THE SERVICE WAS QUICK AND EFFICIENT EVEN DURING PEAK HOURS."'
//     }
//   ];

//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;

//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<i key={`full-${i}`} className="fa-solid fa-star"></i>);
//     }

//     if (hasHalfStar) {
//       stars.push(<i key="half" className="fa-solid fa-star-half-stroke"></i>);
//     }

//     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
//     for (let i = 0; i < emptyStars; i++) {
//       stars.push(<i key={`empty-${i}`} className="fa-regular fa-star"></i>);
//     }

//     return stars;
//   };

//   const toggleReviewExpansion = (reviewId) => {
//     setExpandedReviews(prev => ({
//       ...prev,
//       [reviewId]: !prev[reviewId]
//     }));
//   };

//   const handleLoadMoreReviews = async () => {
//     try {
//       const businessId = business?.id || params.id || 'b1';

//       // For now, just add mock reviews
//       const additionalMockReviews = [
//         {
//           id: 4,
//           name: 'BEZA TADESSE',
//           year: '3rd Year',
//           rating: 4,
//           image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=200&auto=format&fit=crop',
//           body: '"GOOD FOOD OVERALL, BUT THE SERVICE CAN BE SLOW DURING PEAK HOURS. THE MANGO JUICE WAS EXCELLENT - FRESH AND NOT TOO SWEET. THE SEATING AREA IS COMFORTABLE AND CLEAN. I RECOMMEND COMING DURING OFF-PEAK HOURS FOR BETTER SERVICE."'
//         },
//         {
//           id: 5,
//           name: 'DAWIT ASSEFA',
//           year: '2nd Year',
//           rating: 5,
//           image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
//           body: '"BEST BEYAYNET IN CAMPUS! THE VARIETY OF VEGETABLES IS IMPRESSIVE AND EVERYTHING TASTES FRESH. THE INJERA IS SOFT AND PERFECTLY FERMENTED. VERY AFFORDABLE FOR STUDENTS. THE STAFF ARE FRIENDLY AND ALWAYS SMILING."'
//         }
//       ];

//       setReviews(prev => [...prev, ...additionalMockReviews]);
//       const newExpanded = {};
//       additionalMockReviews.forEach(review => {
//         newExpanded[review.id] = false;
//       });
//       setExpandedReviews(prev => ({ ...prev, ...newExpanded }));
//     } catch (error) {
//       console.error('Error loading more reviews:', error);
//     }
//   };

//   // Function to handle menu item click
//   const handleMenuItemClick = (menuItem) => {
//     navigate('/menu-item', {
//       state: {
//         menuItem: menuItem,
//         business: business
//       }
//     });
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading business details...</p>
//       </div>
//     );
//   }

//   if (!business) {
//     return (
//       <div className="error-container">
//         <p>No business data found.</p>
//         <Link to="/reviews">
//           <button className="btn btn-primary">Back to Reviews</button>
//         </Link>
//       </div>
//     );
//   }

//   const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
//   const businessRating = business.rating?.average || 4.5;
//   const reviewCount = business.rating?.count || 0;

//   return (
//     <main>
//       {/* Business Header Section */}
//       <section className="container" style={{ padding: '40px 20px' }}>
//         <h2 className="section-title">{business.category?.toUpperCase() || 'BUSINESS'}</h2>

//         <div className="hero-grid">
//           <div className="main-card">
//             <div
//               className="main-card-image"
//               style={{ backgroundImage: `url('${business.mainImage}')` }}
//             ></div>
//             <div className="main-card-content">
//               <h3>{business.name}</h3>
//               <div className="rating-stars">
//                 {renderStars(businessRating)}
//                 <span>{businessRating.toFixed(1)} ({reviewCount} REVIEWS)</span>
//               </div>
//               <div className="card-details">
//                 <div><i className="fa-solid fa-location-dot"></i> {business.location?.address || 'AAU Campus'}</div>
//                 <div>
//                   {business.features?.isGroupFriendly && (
//                     <><i className="fa-solid fa-users"></i> Large Group Friendly &nbsp; &nbsp; &nbsp;</>
//                   )}
//                   <i className="fa-solid fa-calendar"></i> Open Until {business.hours?.closeTime || '6pm'}
//                 </div>
//                 {business.phone && (
//                   <div><i className="fa-solid fa-phone"></i> {business.phone}</div>
//                 )}
//                 {business.website && (
//                   <div><i className="fa-solid fa-globe"></i> {business.website}</div>
//                 )}
//                 <div><i className="fa-solid fa-tag"></i> Price Range: {business.features?.priceRange || '$$'}</div>
//               </div>
//               <div style={{ marginTop: '20px' }}>
//                 <Link
//                   to="/submit-review"
//                   state={{ business: business }}
//                 >
//                   <button className="btn btn-primary">Review</button>
//                 </Link>
//               </div>
//             </div>
//           </div>

//           <div className="peek-card">
//             <div
//               className="peek-image"
//               style={{
//                 backgroundImage: `url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400&auto=format&fit=crop')`,
//                 height: '200px'
//               }}
//             ></div>
//             <div
//               className="peek-image"
//               style={{
//                 backgroundImage: `url('https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=400&auto=format&fit=crop')`,
//                 marginTop: '10px',
//                 height: '200px'
//               }}
//             ></div>
//           </div>
//         </div>
//       </section>

//       <hr className="divider" />

//       {/* Menu Section */}
//       <section className="container" style={{ padding: '40px 20px' }}>
//         <h2 className="section-title">MENU</h2>
//         <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '20px' }}>TOP</h3>

//         {/* Horizontal scrolling menu container */}
//         <div className="menu-horizontal-scroll">
//           {menuItems.map((item) => (
//             <div
//               key={item.id}
//               className="menu-card clickable-menu-item"
//               onClick={() => handleMenuItemClick(item)}
//             >
//               {/* Image with price tag */}
//               <div className="menu-image-wrapper">
//                 <img src={item.image} alt={item.itemName} />
//                 <div className="menu-price-tag">{item.price} {item.currency}</div>
//               </div>
//               <h4 style={{ margin: '10px 0' }}>{item.itemName}</h4>
//               <div className="rating-stars" style={{ fontSize: '0.8rem', marginBottom: '10px' }}>
//                 {renderStars(item.rating || 4.5)}
//                 <span>{(item.rating || 4.5).toFixed(1)} ({item.reviewCount || 0})</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div style={{ textAlign: 'center', marginTop: '30px' }}>
//           <button className="btn btn-outline">Full Menu</button>
//         </div>
//       </section>

//       <hr className="divider" />

//       {/* Reviews Section */}
//       <section className="container" style={{ padding: '40px 20px' }}>
//         <h2 className="section-title">CUSTOMER REVIEWS</h2>

//         <div className="reviews-list">
//           {displayedReviews.map((review) => {
//             const isExpanded = expandedReviews[review.id];
//             const reviewBody = review.body || review.review;
//             const displayText = isExpanded || reviewBody.length <= 200
//               ? reviewBody
//               : `${reviewBody.substring(0, 200)}...`;

//             return (
//               <div key={review.id} className="review-item">
//                 <div className="review-header">
//                   <img className="reviewer-img" src={review.image || review.user?.avatar} alt={review.name || review.user?.name} />
//                   <div className="reviewer-info">
//                     <h4>{review.name || review.user?.name}</h4>
//                     <p>{review.year || review.user?.university}</p>
//                     <div className="rating-stars" style={{ fontSize: '0.8rem', margin: 0 }}>
//                       {renderStars(review.rating)}
//                     </div>
//                   </div>
//                 </div>
//                 <p className="review-body">{displayText}</p>

//                 {reviewBody.length > 200 && (
//                   <button
//                     className="btn btn-outline read-more-btn"
//                     onClick={() => toggleReviewExpansion(review.id)}
//                   >
//                     {isExpanded ? 'SHOW LESS' : 'READ MORE'}
//                   </button>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         <div style={{ textAlign: 'center', marginTop: '40px' }}>
//           {!showAllReviews && reviews.length > 3 && (
//             <button
//               className="btn btn-outline"
//               onClick={() => setShowAllReviews(true)}
//               style={{ marginRight: '15px' }}
//             >
//               View More Reviews
//             </button>
//           )}

//           {showAllReviews && reviews.length < 8 && (
//             <button
//               className="btn btn-outline"
//               onClick={handleLoadMoreReviews}
//             >
//               Load More Reviews
//             </button>
//           )}
//         </div>
//       </section>
//     </main>
//   );
// };

// export default CustomerReview;
