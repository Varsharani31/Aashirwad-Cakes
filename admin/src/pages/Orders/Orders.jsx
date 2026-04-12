import React, { useState, useEffect } from 'react';
import "./Orders.css";
import axios from 'axios';
import { toast } from "react-toastify";
import { assets } from '../../assets/admin_assets/assets';

const Orders = () => {
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"; // backend URL
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error(error);
    }
  };

  // Handle Accept/Reject button click
  const handleOrderAction = async (orderId, status, email) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, { orderId, status, email });
      if (response.data.success) {
        toast.success(`Order ${status}`);
        fetchAllOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='Order'>
      <h3>Orders</h3>
      <div className="orderlist">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className='order-items'>
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <div className="order-info">
                <p>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "Date not available"}</p>
                <p className="order-item-food">
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.name} x {item.quantity}{idx !== order.items.length - 1 && ", "}
                    </span>
                  ))}
                </p>
                <p className="order-item-name">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>₹{order.amount}</p>

              {/* Accept/Reject buttons */}
              <div className="order-actions">
                <button
                  className='accept-btn'
                  onClick={() => handleOrderAction(order._id, "Accepted", order.address.email)}
                  disabled={order.status === "Accepted"}
                >
                  Accept
                </button>
                <button
                  className='reject-btn'
                  onClick={() => handleOrderAction(order._id, "Rejected", order.address.email)}
                  disabled={order.status === "Rejected"}
                >
                  Reject
                </button>
              </div>

              {/* Status Badge */}
              <p className={`status-badge ${order.status.toLowerCase().replace(" ", "-")}`}>
                {order.status}
              </p>
            </div>
          ))
        ) : (
          <p>No orders available</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
