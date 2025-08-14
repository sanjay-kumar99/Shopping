/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "../api/axios"; // your axios instance
import Swal from "sweetalert2";
import { motion } from "framer-motion";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email is invalid";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const { data } = await axios.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: `Welcome, ${data.name}!`,
      });

      setForm({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div className="register-container">
      <motion.div
        className="register-card"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit} noValidate>
          {["name", "email", "password", "confirmPassword"].map((field) => (
            <motion.div
              key={field}
              className="form-group mb-3"
              whileFocus={{ scale: 1.02 }}
            >
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field.includes("password") ? "password" : "text"}
                className={`form-control ${errors[field] ? "is-invalid" : ""}`}
                name={field}
                value={form[field]}
                onChange={handleChange}
              />
              {errors[field] && (
                <div className="invalid-feedback">{errors[field]}</div>
              )}
            </motion.div>
          ))}

          <motion.button
            type="submit"
            className="btn btn-primary w-100 mt-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
        </form>
        <p className="text-center mt-3">
          Already have an account?{" "}
          <a href="/login" style={{ color: "#667eea" }}>
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
