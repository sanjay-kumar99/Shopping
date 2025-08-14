/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

function Footer() {
  return (
    <motion.footer
      className="footer mt-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="footer-content container text-center py-3">
        <p>
          &copy; {new Date().getFullYear()} <strong>SanC@rt</strong> | All Rights Reserved
        </p>
        <div className="social-icons mt-2">
          <a href="#" aria-label="Facebook">🌐</a>
          <a href="#" aria-label="Twitter">🐦</a>
          <a href="#" aria-label="Instagram">📸</a>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
