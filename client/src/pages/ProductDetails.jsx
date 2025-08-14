import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { Spinner, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCartCount } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItemId, setCartItemId] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: productData } = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(productData);

        if (token) {
          const { data: cartData } = await axios.get(
            "http://localhost:5000/api/cart",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const existingItem = cartData.find(
            (item) => item.productId._id === productData._id
          );

          if (existingItem) {
            setQuantity(existingItem.quantity);
            setCartItemId(existingItem._id);
          }
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to load product", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleAddToCart = async () => {
    if (!token) {
      Swal.fire(
        "Login Required",
        "Please login to add items to cart",
        "warning"
      );
      navigate("/login");
      return;
    }

    try {
      if (cartItemId) {
        await axios.put(
          `http://localhost:5000/api/cart/${cartItemId}`,
          { quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire("Updated", "Cart updated successfully", "success");
      } else {
        const { data } = await axios.post(
          "http://localhost:5000/api/cart",
          { productId: product._id, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItemId(data._id);
        Swal.fire("Added", "Product added to cart", "success");
      }

      fetchCartCount();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to add/update cart", "error");
    }
  };

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (!product) return <p className="text-center my-5">Product not found</p>;

  return (
    <div className="container my-5 py-5">
      <div className="row g-4">
        {/* Left: Product Image */}
        <div className="col-md-6 text-center">
          <div className="position-relative overflow-hidden product-image-container">
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              className="img-fluid rounded shadow-sm product-image"
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="col-md-6 ">
          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-muted">{product.description}</p>
          <h4 className="text-primary fw-bold mb-3">₹{product.price}</h4>

          <Form.Group className="mb-3" style={{ maxWidth: "120px" }}>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </Form.Group>

          <Button
            variant="success"
            className="px-4 py-2"
            onClick={handleAddToCart}
          >
            {cartItemId ? "Update Cart" : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* CSS for hover zoom */}
      <style>
        {`
          .product-image-container {
            cursor: zoom-in;
            overflow: hidden;
          }

          .product-image {
            transition: transform 0.3s ease;
            max-height: 400px;
            object-fit: contain;
          }

          .product-image-container:hover .product-image {
            transform: scale(1.1);
          }
        `}
      </style>
    </div>
  );
};

export default ProductDetails;
