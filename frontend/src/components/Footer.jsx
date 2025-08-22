// components/Footer.jsx
import "./Footer.css";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h4>About</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="#">Our Mission</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/blogs">Blogs</a></li>
            <li><a href="/blogs?category__slug=skincare">Skincare</a></li>
          </ul>
        </div>

            <div className="footer-col">
            <h4>Follow Us</h4>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="icon">
                <FaInstagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="icon">
                <FaFacebookF size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="icon">
                <FaTwitter size={18} />
              </a>
            </div>
          </div>
        </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Blog Management Platform. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
