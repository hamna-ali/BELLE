import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateBlog from "./pages/CreateBlog";
import BlogDetail from "./components/BlogDetail";
import Blogs from "./pages/Blogs";
import Profile from "./pages/Profile";
import EditBlog from "./pages/EditBlog";
import About from "./pages/About";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();

  // Hide chrome (Navbar/Footer) on login/signup
  const hideChrome = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="app-shell">
      {!hideChrome && <Navbar />}

      <div className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/my-blogs" element={<Blogs mine />} />
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs"
            element={
              <ProtectedRoute>
                <Blogs />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/blogs/:id"
            element={
              <ProtectedRoute>
                <BlogDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs/:id/edit"
            element={
              <ProtectedRoute>
                <EditBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs/create"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {!hideChrome && <Footer />}
    </div>
  );
}

export default App;
