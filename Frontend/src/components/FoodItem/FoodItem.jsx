/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/frontend_assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, image }) => {
    const { cartItems, addToCart, removeFromCart, url, token } = useContext(StoreContext);
    const [selectedWeight, setSelectedWeight] = useState('1/2 kg'); // Default weight

    const itemCount = cartItems[id] || 0;

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
        addToCart(id);
    };

    const handleRemoveClick = () => {
        if (!token) {
            alert("Please log in to remove items from your cart");
            return;
        }
        removeFromCart(id);
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

               

                <p className="food-item-price">1/2 Kg Price : ₹{price}</p>
            </div>
        </div>
    );
};

export default FoodItem;
