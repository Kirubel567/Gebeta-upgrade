import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import BusinessForm from '../../components/BusinessForm/BusinessForm';
import { businessService, applicationService } from '../../api/apiService';
import { useAuth } from '../../contexts/authContext';
import './About.css';

const About = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Store APPLICATIONS
  const [applications, setApplications] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Creating state
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Fetch only when auth is ready and user is present
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      fetchMyApplications();
    } else {
      setDataLoading(false);
    }
  }, [user, authLoading]);

  const fetchMyApplications = async () => {
    try {
      setDataLoading(true);
      console.log('Fetching applications for user:', user?._id);
      const response = await applicationService.getMyApplications();

      if (response.success && response.data) {
        console.log('Fetched applications:', response.data.length);
        setApplications(response.data);
      } else {
        console.log('No applications found or api error', response);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      // If error is 401, apiClient usually redirects.
    } finally {
      setDataLoading(false);
    }
  };

  const handleCreateClick = () => {
    // Button Guard
    if (!user) {
      navigate('/login');
      return;
    }
    setIsCreating(true);
  };

  const handleCreateSubmit = async (formData) => {
    if (!user) return;
    try {
      const payload = {
        ...formData,
        location: typeof formData.location === 'object' ? formData.location.address : formData.location
      };

      await applicationService.submit(payload);
      alert('Application submitted successfully! Your business is pending approval.');
      setIsCreating(false);
      fetchMyApplications();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(error.message || 'Failed to submit application');
    }
  };

  const handleUpdateSubmit = async (id, formData, type) => {
    try {
      if (type === 'business') {
        // Live business update
        await businessService.update(id, formData);
        alert('Live business updated successfully!');
      } else {
        // Application update (pending/rejected)
        const payload = {
          ...formData,
          location: typeof formData.location === 'object' ? formData.location.address : formData.location
        };
        await applicationService.update(id, payload);
        alert('Application updated successfully!');
      }

      setEditingItem(null);
      fetchMyApplications(); // Refresh list
    } catch (error) {
      console.error('Error updating:', error);
      alert(error.message || 'Failed to update');
    }
  };

  const handleDelete = async (id, name, type) => {
    if (type !== 'business') {
      alert('You can only delete approved businesses. Contact support to cancel applications.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone."`)) {
      return;
    }

    try {
      await businessService.delete(id);
      alert('Business deleted successfully.');
      fetchMyApplications();
    } catch (error) {
      console.error('Error deleting business:', error);
      alert('Failed to delete business. Please try again.');
    }
  };

  // Combined loading state for initial load
  if (authLoading || (user && dataLoading && applications.length === 0 && !isCreating)) {
    return (
      <div className="about-page">
        <main>
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="about-page">
      <main>
        {/* Intro Section */}
        <section className="about-section">
          <div className="about-text">
            <h1>ABOUT <span className="script-font text-green">Gebeta</span><br />REVIEW</h1>
            <p>
              <span className="script-font text-green">Gebeta</span> is a student-powered food discovery and review
              platform built to help university students find the best meals on and around campus.
            </p>
          </div>

          <div className="about-gallery">
            <div className="gallery-item large"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600')" }}>
              <span className="gallery-label">OFF-CAMPUS</span>
            </div>
            <div className="gallery-item"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=300')" }}>
              <span className="gallery-label">ON-CAMPUS</span>
            </div>
            <div className="gallery-item wide"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1695654390723-479197a8c4a3?q=80&w=1434&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
              <span className="gallery-label">DELIVERY</span>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* Dashboard Section - Only if user is defined */}
        {user && (
          <section className="dashboard-section" id="business-sec">
            <div className="dashboard-header">
              <h2 className="section-title">MY APPLICATIONS & BUSINESSES</h2>

              <div className="create-btn-container">
                {!isCreating && (
                  <Button variant="primary" onClick={handleCreateClick}>
                    <i className="fa-solid fa-plus" style={{ width: '16px' }}></i> Create New Business
                  </Button>
                )}
              </div>
            </div>

            {/* Create Form - Always creates new Application */}
            {isCreating && (
              <div className="create-form-section">
                <h3 style={{ marginBottom: '20px', color: 'var(--text-white)' }}>List Your Business</h3>
                <p style={{ color: '#aaa', marginBottom: '20px' }}>Submit your business details for admin approval.</p>
                <BusinessForm
                  onSubmit={handleCreateSubmit}
                  onCancel={() => setIsCreating(false)}
                  isEditing={false}
                />
              </div>
            )}

            {/* Grid */}
            <div className="business-grid">
              {applications.length === 0 && !isCreating ? (
                <div className="empty-state">
                  <i className="fa-solid fa-clipboard-list" style={{ width: '16px' }}></i>
                  <h3>No Applications Yet</h3>
                  <p>You haven't submitted any applications yet. Click the button above to start!</p>
                </div>
              ) : (
                <>
                  {applications.map(app => {
                    // Determine if we are showing the live business or the application
                    const isLive = app.status === 'approved';
                    // If live, use the populated businessId object if available, otherwise fallback to app details
                    // Note: backend 'getMyApplications' populates 'businessId'.
                    const businessData = isLive && app.businessId ? app.businessId : app;
                    const displayId = isLive && app.businessId ? app.businessId._id : app._id;
                    const cardType = isLive ? 'business' : 'application';

                    // For editing state check
                    const isEditingThis = editingItem && editingItem.id === displayId;

                    return (
                      <div key={app._id} className={`business-card ${!isLive ? 'application-card-style' : ''}`}>
                        {/* Image Section */}
                        <div className="card-image-container">
                          {businessData.image && businessData.image.length > 0 ? (
                            // Helper for image url extraction if it's object or string
                            <img
                              src={typeof businessData.image[0] === 'object' ? businessData.image[0].url : businessData.image[0]}
                              alt={businessData.name}
                              className="card-image"
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="fa-solid fa-image" style={{ fontSize: '2rem', color: '#666', width: '16px' }}></i>
                            </div>
                          )}

                          {/* Status Badge */}
                          <div className={`status-badge ${app.status}`}>
                            {app.status === 'approved' ? 'Approved' : (app.status === 'rejected' ? 'Rejected' : 'Pending Review')}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="card-content">
                          <h3 className="card-title">{businessData.name}</h3>

                          <div className="card-header-row">
                            <p className="card-category">
                              <i className="fa-solid fa-tag" style={{ width: '16px' }}></i>
                              {businessData.category || 'Uncategorized'}
                            </p>

                            {isLive && (
                              <div className="card-rating">
                                <i className="fa-solid fa-star" style={{ width: '16px' }}></i>
                                <span>{businessData.rating?.average?.toFixed(1) || '0.0'}</span>
                              </div>
                            )}
                          </div>

                          <p className="card-description">{businessData.description || 'No description provided.'}</p>

                          {/* Rejection Notes */}
                          {app.status === 'rejected' && app.reviewNotes && (
                            <div className="rejection-notice">
                              <strong>Admin Note:</strong> {app.reviewNotes}
                            </div>
                          )}

                          <div className="card-meta">
                            <div className="meta-item">
                              <i className="fa-solid fa-location-dot" style={{ width: '16px' }}></i>
                              <span>{typeof businessData.location === 'object' ? businessData.location.address || 'AAU Campus' : businessData.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="card-actions">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => setEditingItem(isEditingThis ? null : { id: displayId, type: cardType })}
                          >
                            <i className="fa-solid fa-pen-to-square" style={{ width: '16px' }}></i>
                            {isEditingThis ? 'Close' : (app.status === 'rejected' ? 'Fix & Resubmit' : 'Update')}
                          </button>

                          {/* Only show delete for live businesses (as per logic derivation) */}
                          {isLive && (
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDelete(displayId, businessData.name, cardType)}
                            >
                              <i className="fa-solid fa-trash" style={{ width: '16px' }}></i>
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Edit Forms - Rendered Outside Grid */}
            {applications.map(app => {
              const isLive = app.status === 'approved';
              const businessData = isLive && app.businessId ? app.businessId : app;
              const displayId = isLive && app.businessId ? app.businessId._id : app._id;
              const cardType = isLive ? 'business' : 'application';

              if (editingItem && editingItem.id === displayId && editingItem.type === cardType) {
                return (
                  <div key={`edit-${displayId}`} className="edit-form-wrapper">
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-white)' }}>
                      {isLive ? `Edit Business: ${businessData.name}` : `Update Application: ${businessData.name}`}
                    </h3>
                    <BusinessForm
                      initialData={businessData}
                      onSubmit={(data) => handleUpdateSubmit(displayId, data, cardType)}
                      onCancel={() => setEditingItem(null)}
                      isEditing={true}
                    />
                  </div>
                );
              }
              return null;
            })}
          </section>
        )}
      </main>
    </div>
  );
};

export default About;