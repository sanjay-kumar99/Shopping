/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    Swal.fire({
      title: "Delete Product?",
      text: `Are you sure you want to delete "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Deleted!", `${name} has been deleted.`, "success");
          fetchProducts();
        } catch (err) {
          Swal.fire("Error!", "Failed to delete product.", "error");
        }
      }
    });
  };

  // Open Edit Modal
  const handleEditProduct = (product) => {
    setEditProduct({ ...product });
    setShowModal(true);
  };

  // Save Updated Product
  const handleSaveProduct = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/${editProduct._id}`,
        editProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire("Updated!", "Product updated successfully.", "success");
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      Swal.fire("Error!", "Failed to update product.", "error");
    }
  };

  // Update Order Status
  const handleUpdateOrder = async (id) => {
    const { value: status } = await Swal.fire({
      title: "Update Order Status",
      input: "select",
      inputOptions: {
        Pending: "Pending",
        Shipped: "Shipped",
        Delivered: "Delivered",
      },
      inputPlaceholder: "Select status",
      showCancelButton: true,
    });

    if (status) {
      try {
        await axios.put(
          `http://localhost:5000/api/orders/${id}`,
          { status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire("Updated!", "Order status updated.", "success");
        fetchOrders();
      } catch (err) {
        Swal.fire("Error!", "Failed to update order.", "error");
      }
    }
  };

  // Logout
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.href = "/login";
      }
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: "100vh", }}>
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h4 className="text-center mb-4">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <button
              className={`btn w-100 text-start ${
                activePage === "dashboard" ? "btn-primary" : "btn-dark"
              }`}
              onClick={() => setActivePage("dashboard")}
            >
              <FaTachometerAlt /> Dashboard
            </button>
          </li>
          <li className="nav-item mt-2">
            <button
              className={`btn w-100 text-start ${
                activePage === "products" ? "btn-primary" : "btn-dark"
              }`}
              onClick={() => navigate("/manageproducts")}
            >
              <FaBox /> Products
            </button>
          </li>
          <li className="nav-item mt-2">
            <button
              className={`btn w-100 text-start ${
                activePage === "orders" ? "btn-primary" : "btn-dark"
              }`}
              onClick={() => navigate("/manageorders")}
            >
              <FaShoppingCart /> Orders
            </button>
          </li>
          <li className="nav-item mt-2">
            <button
              className={`btn w-100 text-start ${
                activePage === "users" ? "btn-primary" : "btn-dark"
              }`}
              onClick={() => setActivePage("users")}
            >
              <FaUsers /> Users
            </button>
          </li>
        </ul>
        <div className="mt-auto pt-3">
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <nav className="navbar navbar-light bg-light shadow-sm px-4">
          <span className="navbar-brand">Welcome, Admin👋</span>
        </nav>

        <div className="p-4">
          {activePage === "dashboard" && (
            <>
              <h3>Dashboard</h3>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="card shadow-sm p-3 text-center">
                    <h5>Total Products</h5>
                    <p>{products.length}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card shadow-sm p-3 text-center">
                    <h5>Total Orders</h5>
                    <p>{orders.length}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card shadow-sm p-3 text-center">
                    <h5>Total Users</h5>
                    <p>{users.length}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activePage === "products" && (
            <>
              <h3>Products</h3>
              <table className="table table-bordered mt-3">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, index) => (
                    <tr key={p._id}>
                      <td>{index + 1}</td>
                      <td>{p.name}</td>
                      <td>₹{p.price}</td>
                      <td>{p.brand}</td>
                      <td>{p.category}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEditProduct(p)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteProduct(p._id, p.name)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activePage === "orders" && (
            <>
              <h3>Orders</h3>
              <table className="table table-bordered mt-3">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, index) => (
                    <tr key={o._id}>
                      <td>{index + 1}</td>
                      <td>{o.user?.name || "N/A"}</td>
                      <td>{o.status}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleUpdateOrder(o._id)}
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activePage === "users" && (
            <>
              <h3 className="mb-4">Users</h3>
              <div className="row g-3">
                {users.length === 0 ? (
                  <p className="text-muted">No users found.</p>
                ) : (
                  users.map((u) => (
                    <div className="col-12 col-md-6 col-lg-4" key={u._id}>
                      <div className="card shadow-sm h-100 user-card">
                        <div className="card-body d-flex flex-column justify-content-center">
                          <h5 className="card-title mb-2">{u.name}</h5>
                          <p className="card-text text-muted mb-0">{u.email}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Optional CSS inline for hover */}
              <style>{`
      .user-card {
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .user-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
      }
    `}</style>
            </>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Name"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Price"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Brand"
                  value={editProduct.brand}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, brand: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Category"
                  value={editProduct.category}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, category: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Image URL"
                  value={editProduct.image}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, image: e.target.value })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSaveProduct}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminDashboard;
