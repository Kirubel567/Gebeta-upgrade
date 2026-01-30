import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import './BusinessForm.css';

const BusinessForm = ({ initialData = null, onSubmit, onCancel, isEditing = false }) => {
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        businessName: '',
        category: 'on-campus',
        location: '',
        description: '',
        phone: '',
        priceRange: '$$'
    });

    // Pre-fill form when editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                businessName: initialData.name || '',
                category: initialData.category || 'on-campus',
                location: initialData.location?.address || '',
                description: initialData.description || '',
                phone: initialData.contact?.phone || '',
                priceRange: initialData.features?.priceRange || '$$'
            });

            // Set image preview if exists
            if (initialData.image && initialData.image.length > 0) {
                setImagePreview(initialData.image[0].url);
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file (JPEG, PNG, etc.)');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            // Create Base64 preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create JSON payload with nested objects
        const submitData = {
            name: formData.businessName,
            category: formData.category,
            description: formData.description,
            location: {
                address: formData.location
            },
            contact: {
                phone: formData.phone
            },
            features: {
                priceRange: formData.priceRange
            }
        };

        // Add Base64 image if selected
        if (imagePreview && imagePreview.startsWith('data:image')) {
            submitData.image = imagePreview;
        }

        // Call parent's onSubmit handler
        await onSubmit(submitData);
    };

    return (
        <div className="business-form-container">
            <form onSubmit={handleSubmit} className="business-form">
                {/* Image Upload Section */}
                <div className="business-image-upload-section">
                    <p className="section-label">Business Image:</p>
                    <div className="business-image-upload-container">
                        <div className="business-image-preview">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Business Preview"
                                    className="preview-image"
                                />
                            ) : (
                                <div className="no-image-placeholder">
                                    <i className="fa-solid fa-image"></i>
                                    <p>No image selected</p>
                                </div>
                            )}
                        </div>
                        <div className="upload-controls">
                            <label className="file-upload-label">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
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

                <div className="form-group">
                    <label>BUSINESS NAME *</label>
                    <input
                        type="text"
                        name="businessName"
                        placeholder="Enter your business name"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>CATEGORY *</label>
                    <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="on-campus">On-Campus</option>
                        <option value="off-campus">Off-Campus</option>
                        <option value="delivery">Delivery</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>LOCATION (ADDRESS) *</label>
                    <input
                        type="text"
                        name="location"
                        placeholder="e.g., Library Building, 5K Campus"
                        required
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>DESCRIPTION</label>
                    <textarea
                        rows="5"
                        name="description"
                        placeholder="Describe your business..."
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>PHONE NUMBER</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="0911223344"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>PRICE RANGE</label>
                    <select
                        name="priceRange"
                        value={formData.priceRange}
                        onChange={handleChange}
                    >
                        <option value="$">$ - Budget Friendly</option>
                        <option value="$$">$$ - Moderate</option>
                        <option value="$$$">$$$ - Premium</option>
                    </select>
                </div>

                <div className="form-actions">
                    <Button variant="primary" type="submit">
                        {isEditing ? 'Update Business' : 'Create Business'}
                    </Button>
                    <Button variant="outline" type="button" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BusinessForm;
