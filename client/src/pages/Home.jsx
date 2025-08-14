/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";

function Home() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get("/products");
        const allProducts = res.data.products || res.data;
        setProducts(allProducts);
        setFeatured(allProducts.slice(0, 3)); // top 3 featured
      } catch (err) {
        console.error(err);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="container my-5">
      {/* Hero Banner */}
      <motion.div
        className="hero-banner rounded-4 text-white text-center mb-5 p-5"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          background: "linear-gradient(135deg, #0d6efd, #6610f2)",
        }}
      >
        <h1 className="display-5 fw-bold mb-3">Welcome to SanC@rt</h1>
        <p className="lead mb-4">
          Discover the best products at unbeatable prices.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-light btn-lg"
          onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}
        >
          Shop Now
        </motion.button>
      </motion.div>

      {/* Featured Products */}
      {featured.length > 0 && (
        <div className="mb-5">
          <h2 className="fw-bold text-center mb-4">Featured Products</h2>
          <div className="row g-4">
            {featured.map((p) => (
              <motion.div
                key={p._id}
                className="col-12 col-md-6 col-lg-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ProductCard product={p} isFeatured />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Products */}
      <div>
        <h2 className="fw-bold text-center mb-4">All Products</h2>
        <div className="row g-4">
          {products.length === 0 && (
            <p className="text-center text-muted">No products available.</p>
          )}
          {products.map((p, index) => (
            <motion.div
              key={p._id}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Home;
