/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { motion } from "framer-motion";

const ProductCard = ({ product, isFeatured }) => {
  const navigate = useNavigate();
  const { fetchCartCount } = useContext(CartContext);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first!");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchCartCount();
      toast.success(`${product.name} added to cart`);
      navigate("/cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`card h-100 shadow-sm border-0 product-card ${
        isFeatured ? "featured-card" : ""
      }`}
    >
      <div className="position-relative overflow-hidden">
        {/* Image link to ProductDetails */}
        <Link to={`/product/${product._id}`}>
          <img
            src={`http://localhost:5000${product.image}`}
            className="card-img-top"
            alt={product.name}
            style={{
              height: isFeatured ? "250px" : "200px",
              objectFit: "cover",
            }}
          />
        </Link>

        <span className="badge bg-success position-absolute top-0 end-0 m-2">
          ₹{product.price}
        </span>

        {product.isNew && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-2">
            New
          </span>
        )}
        {product.onSale && (
          <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-2">
            Sale
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        {/* Name link to ProductDetails */}
        <Link
          to={`/product/${product._id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h5 className="card-title text-truncate" title={product.name}>
            {product.name}
          </h5>
        </Link>

        <p className="card-text text-muted" style={{ flexGrow: 1 }}>
          {product.description
            ? product.description.substring(0, 60) + "..."
            : ""}
        </p>

        {/* <button className="btn btn-primary mt-auto" onClick={handleAddToCart}>
          Add to Cart
        </button> */}
      </div>
    </motion.div>
  );
};

export default ProductCard;
