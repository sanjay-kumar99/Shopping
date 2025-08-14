import React, { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:5000/api/orders/myorders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center my-5">Loading orders...</p>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center fs-5">You have no orders yet.</p>
      ) : (
        <div className="row g-4">
          {orders.map((order) => (
            <div key={order._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h6 className="card-title text-dark mb-3">
                    Order ID: {order._id}
                  </h6>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        order.status === "Delivered"
                          ? "text-success"
                          : order.status === "Shipped"
                          ? "text-info"
                          : "text-warning"
                      }
                    >
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <strong>Total Price:</strong>{" "}
                    <span className="fw-bold">₹{order.totalPrice.toFixed(2)}</span>
                  </p>
                  <p className="mb-1">
                    <strong>Items:</strong>
                  </p>
                  <ul className="list-group list-group-flush mb-2">
                    {order.orderItems.map((item) => (
                      <li
                        key={item.product._id}
                        className="list-group-item px-0 py-1 d-flex justify-content-between"
                      >
                        <span>{item.product.name}</span>
                        <span>
                          {item.qty} × ₹{item.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted mb-0">
                    <small>
                      Ordered on:{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
