import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import "./PlaceOrder.css";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, userId } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  // Handle input change
  const onChangehandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation function
  const validateFields = () => {
    const { firstName, lastName, email, street, city, state, zipcode, country, phone } = data;

    if (!firstName.trim()) return "First Name is required";
    if (!lastName.trim()) return "Last Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Enter a valid email";

    if (!street.trim()) return "Street is required";
    if (!city.trim()) return "City is required";
    if (!state.trim()) return "State is required";

    const zipRegex = /^[0-9]{5,6}$/; // 5-6 digit numeric zip code
    if (!zipRegex.test(zipcode)) return "Enter a valid numeric Zip/Pin code (5-6 digits)";

    if (!country.trim()) return "Country is required";

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) return "Enter a valid 10-digit phone number";

    return null; // all good
  };

  // Place order
  const placeOrder = async (e) => {
    e.preventDefault();

    // Validate form fields
    const validationError = validateFields();
    if (validationError) {
      alert(validationError);
      return;
    }

    if (getTotalCartAmount() === 0) {
      alert("Your cart is empty. Please add some items.");
      return;
    }

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({ ...item, quantity: cartItems[item._id] }));

    if (orderItems.length === 0) {
      alert("No items selected!");
      return;
    }

    const orderData = {
      userId,
      items: orderItems,
      amount: getTotalCartAmount(),
      address: data
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token }
      });

      console.log(response.data);

      if (response.data.success) {
        alert("Order placed successfully!");
        navigate("/"); 
      } else {
        alert(`Order failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  // Redirect if not logged in or cart empty
  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name="firstName" value={data.firstName} onChange={onChangehandler} placeholder="First Name" />
          <input required name="lastName" value={data.lastName} onChange={onChangehandler} placeholder="Last Name" />
        </div>
        <input required name="email" value={data.email} onChange={onChangehandler} type="email" placeholder="Email" />
        <input required name="street" value={data.street} onChange={onChangehandler} placeholder="Street" />
        <div className="multi-fields">
          <input required name="city" value={data.city} onChange={onChangehandler} placeholder="City" />
          <input required name="state" value={data.state} onChange={onChangehandler} placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required name="zipcode" value={data.zipcode} onChange={onChangehandler} placeholder="Zip Code" />
          <input required name="country" value={data.country} onChange={onChangehandler} placeholder="Country" />
        </div>
        <input required name="phone" value={data.phone} onChange={onChangehandler} placeholder="Phone" />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="card-total-details">
            <p>Total</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>
          <hr />
          <button type="submit" className="cart-btn">
            Place Order
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
