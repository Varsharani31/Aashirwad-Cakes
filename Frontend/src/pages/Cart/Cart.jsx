// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount ,url} = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        
        {Object.keys(cartItems).map((cartKey) => {
          if (cartItems[cartKey] > 0) {
            const [id, weight] = cartKey.split('_');
            const actualWeight = weight || 'half';
            const item = food_list.find((i) => i._id === id);
            
            if (!item) return null;

            const price = actualWeight === 'half' ? item.price_half_kg : item.price_one_kg;
            const weightLabel = actualWeight === 'half' ? '1/2 Kg' : '1 Kg';

            return (
              <div key={cartKey}>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name} ({weightLabel})</p>
                  <p>₹{price}</p>
                  <p>{cartItems[cartKey]}</p>
                  <p>₹{price * cartItems[cartKey]}</p>
                  <p onClick={() => { removeFromCart(cartKey) }} className='cross'>x</p>
                </div>
              </div>
            );
          }
          return null; // Return null if the item is not in the cart
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="card-total-details">
              <p>Total</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            
          </div>
          <button className='cart-btn' onClick={() => navigate('/order')}>Proceed to checkout</button>
        </div>

       
      </div>
    </div>
  );
}

export default Cart;
