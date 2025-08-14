import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Map data to orderItems
      const mappedCart = data.map((item) => ({
        _id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
      }));

      setCartItems(mappedCart);

      const total = mappedCart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotalPrice(total);
    };

    fetchCart();
  }, []);

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!cartItems || cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          qty: item.quantity,
          price: item.price,
        })),
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice,
      };

      // 🔹 Debug logs
      console.log("Token:", token);
      console.log("Order Data:", orderData);

      await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Order placed successfully!");
      localStorage.removeItem("cart");
      setCartItems([]);
      setTotalPrice(0);
      navigate("/myorders");
    } catch (error) {
      console.error("Order Error:", error.response?.data || error.message);
      alert("Failed to place order");
    }
  };

  return (
    <div className="container my-5">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "550px", margin: "auto" }}
      >
        <h2 className="text-center mb-4">Checkout</h2>

        {/* Shipping Address */}
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Postal Code</label>
            <input
              type="text"
              className="form-control"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Country</label>
          <input
            type="text"
            className="form-control"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="form-label">Payment Method</label>
          <select
            className="form-select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        {/* Order Summary */}
        <div className="bg-dark p-3 rounded mb-4 text-white">
          <h6 className="mb-1">Order Summary</h6>
          <p className="mb-0">
            <strong>Total Items:</strong> {cartItems.length}
          </p>
          <p className="mb-0">
            <strong>Total Price:</strong> ₹{totalPrice.toFixed(2)}
          </p>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          className="btn btn-primary w-100 fw-bold"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
