/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "axios";

// Create context
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [food_list, setFoodList] = useState([]);
    const [token, setToken] = useState("");
    const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"; // backend URL

    // Fetch all food items
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data);
        } catch (err) {
            console.error("Error fetching food list:", err.message);
        }
    };

    // Load cart data from backend
    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
            setCartItems(response.data.cartData);
        } catch (err) {
            console.error("Error loading cart data:", err.message);
        }
    };

    // Add item to cart
    const addToCart = async (itemId) => {
        if (!token) {
            alert("Please log in to add items to the cart");
            return;
        }

        setCartItems(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));

        try {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        } catch (err) {
            console.error("Error adding to cart:", err.message);
        }
    };

    // Remove item from cart
    const removeFromCart = async (itemId) => {
        if (!token) {
            alert("Please log in to remove items from the cart");
            return;
        }

        setCartItems(prev => {
            const newCount = (prev[itemId] || 1) - 1;
            if (newCount <= 0) {
                const { [itemId]: removed, ...rest } = prev;
                return rest;
            }
            return { ...prev, [itemId]: newCount };
        });

        try {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        } catch (err) {
            console.error("Error removing from cart:", err.message);
        }
    };

    // Calculate total cart amount
    const getTotalCartAmount = () => {
        let total = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find(product => product._id === item);
                if (itemInfo) total += itemInfo.price * cartItems[item];
            }
        }
        return total;
    };

    // Add new food item to list (for admin)
    const addFoodToList = (newFood) => {
        setFoodList(prev => [newFood, ...prev]);
    };

    // Load food list and cart data on mount
    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken);
                await loadCartData(savedToken);
            }
        }
        loadData();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        url,
        addFoodToList
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
