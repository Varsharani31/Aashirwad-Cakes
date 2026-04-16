/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/frontend_assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price_half_kg, price_one_kg, image }) => {
    const { cartItems, addToCart, removeFromCart, url, token } = useContext(StoreContext);
    const [selectedWeight, setSelectedWeight] = useState('half'); // Default weight

    const cartItemId = `${id}_${selectedWeight}`;
    const itemCount = cartItems[cartItemId] || 0;

    // Handle weight change
    const handleWeightChange = (e) => {
        setSelectedWeight(e.target.value);
    };

    // Ensure user is logged in before adding
    const handleAddClick = () => {
        if (!token) {
            alert("Please log in to add items to your cart");
            return;
        }
        addToCart(cartItemId);
    };

    const handleRemoveClick = () => {
        if (!token) {
            alert("Please log in to remove items from your cart");
            return;
        }
        removeFromCart(cartItemId);
    };

    return (
        <div className='food-item'>
            <div className="food-item-image-container">
                <img
                    className='food-item-image'
                    src={url + "/images/" + image}
                    alt={`Image of ${name}`}
                />

                {itemCount === 0 ? (
                    <img
                        className='add'
                        onClick={handleAddClick}
                        src={assets.add_icon_white}
                        alt='Add to cart'
                    />
                ) : (
                    <div className='food-item-counter'>
                        <img
                            onClick={handleRemoveClick}
                            src={assets.remove_icon_red}
                            alt='Remove from cart'
                        />
                        <p>{itemCount}</p>
                        <img
                            onClick={handleAddClick}
                            src={assets.add_icon_green}
                            alt='Add more'
                        />
                    </div>
                )}
            </div>

            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p><strong>{name}</strong></p>
                </div>

                <div className="food-item-weight-selector" style={{ margin: "10px 0" }}>
                    <select value={selectedWeight} onChange={handleWeightChange} style={{ padding: "5px", borderRadius: "5px" }}>
                        <option value="half">1/2 Kg</option>
                        <option value="one">1 Kg</option>
                    </select>
                </div>

                <p className="food-item-price">Price: ₹{selectedWeight === 'half' ? price_half_kg : price_one_kg}</p>
            </div>
        </div>
    );
};

export default FoodItem;
