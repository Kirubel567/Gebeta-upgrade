
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './MenuFormModal.css';

const MenuFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditing }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        currency: 'ETB',
        category: '',
        description: '',
        image: '', // Base64 or URL
        isAvailable: true,
    });

    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                price: initialData.price || '',
                currency: initialData.currency || 'ETB',
                category: initialData.category || '',
                description: initialData.description || '',
                image: initialData.image || '', // Expecting single image URL from parent format
                isAvailable: initialData.isAvailable !== undefined ? initialData.isAvailable : true,
            });
            setImagePreview(initialData.image || '');
        } else {
            // Reset for create mode
            setFormData({
                name: '',
                price: '',
                currency: 'ETB',
                category: '',
                description: '',
                image: '',
                isAvailable: true,
            });
            setImagePreview('');
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, image: reader.result })); // Base64 string
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error("Error submitting form:", error);
            // Parent handles error display usually, or we can add local error state
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{isEditing ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Item Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Currency</label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                            >
                                <option value="ETB">ETB</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g., Breakfast, Lunch, Drink"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            id="menu-image-upload"
                        // required={!isEditing} // Optional on edit to keep existing
                        />
                        {imagePreview && (
                            <div className="image-preview-container">
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                            </div>
                        )}
                        <small className="hint-text">Supported: JPG, PNG (Max 5MB)</small>
                    </div>

                    {isEditing && (
                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isAvailable"
                                    checked={formData.isAvailable}
                                    onChange={handleChange}
                                />
                                Available
                            </label>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : (isEditing ? 'Update Item' : 'Create Item')}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default MenuFormModal;
