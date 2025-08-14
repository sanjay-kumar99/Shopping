/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

function ManageProducts() {
  const { user } = useContext(AuthContext); 
  const userRole = user?.role;

  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [preview, setPreview] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    brand: "",
    countInStock: "",
    imageFile: null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/products");
      setProducts(data.products || data);
    } catch (error) {
      Swal.fire("Error", "Failed to load products", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      const file = files[0];
      setForm((prev) => ({ ...prev, imageFile: file }));
      setPreview(file ? URL.createObjectURL(file) : preview);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleShow = () => {
    setIsEdit(false);
    setForm({
      name: "",
      price: "",
      description: "",
      category: "",
      brand: "",
      countInStock: "",
      imageFile: null,
    });
    setPreview("");
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setForm({
      name: "",
      price: "",
      description: "",
      category: "",
      brand: "",
      countInStock: "",
      imageFile: null,
    });
    setPreview("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.description.trim()) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("brand", form.brand);
      formData.append("countInStock", form.countInStock);
      if (form.imageFile) formData.append("image", form.imageFile);

      if (isEdit && editId) {
        await axios.put(`/products/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success", "Product updated successfully", "success");
      } else {
        await axios.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success", "Product added successfully", "success");
      }

      handleClose();
      fetchProducts();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Operation failed",
        "error"
      );
    }
  };

  const handleEdit = (product) => {
    setIsEdit(true);
    setEditId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      brand: product.brand,
      countInStock: product.countInStock,
      imageFile: null,
    });
    setPreview(product.image ? `http://localhost:5000${product.image}` : "");
    setShow(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`/products/${id}`);
      Swal.fire("Deleted!", "Product has been deleted.", "success");
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      Swal.fire("Error", "Failed to delete product", "error");
    }
  };

  return (
    <div className="container my-5 p-3">
      <h2 className="mb-4 text-center fw-bold">Manage Products</h2>

      {/* Only admin can add product */}
      {userRole === "admin" && (
        <div className="text-center mb-4">
          <Button variant="primary" onClick={handleShow}>
            Add Product
          </Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Modal.Header closeButton>
            <Modal.Title>{isEdit ? "Edit Product" : "Add Product"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                name="countInStock"
                value={form.countInStock}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleChange}
                required={!isEdit}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="img-preview mt-2"
                />
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEdit ? "Update" : "Add"} Product
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <hr />

      {/* Product List */}
      <div className="row">
        {products.length === 0 ? (
          <p className="text-center text-muted">No products found</p>
        ) : (
          products.map((product, index) => (
            <motion.div
              key={product._id}
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="card h-100 shadow-sm border-0 product-card">
                <img
                  src={`http://localhost:5000${product.image}`}
                  className="card-img-top"
                  alt={product.name}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "12px 12px 0 0",
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text mb-1">
                    <strong>Price:</strong> ₹{product.price}
                  </p>
                  <p className="card-text text-truncate" title={product.description}>
                    {product.description}
                  </p>

                  {/* Admin actions */}
                  {userRole === "admin" && (
                    <div className="d-flex justify-content-between mt-auto">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product._id)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManageProducts;
