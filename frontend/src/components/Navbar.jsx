import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile } from "../api/profile";   // ✅ fetch profile API
import fallbackAvatar from "../assets/images/profile.jpg"; // ✅ add default avatar
import "./Navbar.css";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);   // ✅ store user profile

  const navigate = useNavigate();
  const profileRef = useRef(null);

  // ✅ Fetch profile data once on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res?.data || null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = search.trim();
    if (!term) return;
    navigate(`/blogs?q=${encodeURIComponent(term)}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuLinks = [
    { name: "Home", to: "/" },
    { name: "Post", to: "/blogs/create" },
    { name: "My Blogs", to: "/my-blogs" },
    { name: "About Us", to: "/about" },
  ];

  const categories = [
    { name: "Hair", slug: "hair" },
    { name: "Makeup", slug: "makeup" },
    { name: "Skincare", slug: "skincare" },
    { name: "Dressing", slug: "dressing" },
  ];

  // ✅ avatar logic
  const avatarSrc = profile?.avatar_url || fallbackAvatar;
  const avatarAlt = profile?.username || "User";

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <Link to="/" className="brand-name">
            BELLE
          </Link>
        </div>

        {/* Navbar center menu */}
        <ul className="navbar-menu">
          {menuLinks.map((link) => (
            <li key={link.name}>
              <Link to={link.to}>{link.name}</Link>
            </li>
          ))}

          <li
            className="nav-dropdown"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button type="button" className="nav-dropbtn">
              Category ▾
            </button>
            {catOpen && (
              <ul className="nav-dropdown-menu">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link to={`/blogs?category__slug=${cat.slug}`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        {/* Navbar right - search + profile */}
        <div className="navbar-right">
          <form className="nav-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div
            className="nav-profile"
            ref={profileRef}
            onClick={() => setProfileOpen(!profileOpen)}
          >
            {/* ✅ Avatar image instead of letter */}
            <img
              src={avatarSrc}
              alt={avatarAlt}
              className="nav-avatar"
              onError={(e) => (e.currentTarget.src = fallbackAvatar)}
            />

            {profileOpen && (
              <ul className="nav-profile-menu">
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <button type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar & Backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          ×
        </button>
        <ul>
          {menuLinks.map((link) => (
            <li key={link.name}>
              <Link to={link.to} onClick={() => setSidebarOpen(false)}>
                {link.name}
              </Link>
            </li>
          ))}
          <li>Category</li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                to={`/blogs?category__slug=${cat.slug}`}
                onClick={() => setSidebarOpen(false)}
              >
                {cat.name}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/profile" onClick={() => setSidebarOpen(false)}>
              Profile
            </Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
