import { useState, useEffect, useRef } from "react";
import { getProfile, updateProfile, changePassword, deleteAccount } from "../api/profile";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import defaultAvatar from "../assets/images/profile.jpg";

export default function Profile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    public_name: "",
    bio: "",
    instagram: "",
    facebook: "",
    twitter: "",
    avatar_url: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);

  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [pwdLoading, setPwdLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/login");
      return;
    }
    setLoading(true);
    getProfile()
      .then((res) => setProfile((p) => ({ ...p, ...res.data })))
      .catch(() => {
        setMessage("Error loading profile");
        setMessageType("error");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      ["username", "email", "public_name", "bio", "instagram", "facebook", "twitter"].forEach((f) => {
        if (profile[f] !== undefined && profile[f] !== null) {
          formData.append(f, profile[f]);
        }
      });
      if (avatarFile) formData.append("avatar", avatarFile);
      const res = await updateProfile(formData);
      setProfile((p) => ({ ...p, ...res.data }));
      setAvatarFile(null);
      setMessage("Profile updated");
      setMessageType("success");
    } catch {
      setMessage("Update failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const openPwdModal = () => {
    setPwdForm({ current_password: "", new_password: "", confirm_password: "" });
    setShowPwdModal(true);
  };

  const submitPassword = async () => {
    if (!pwdForm.new_password || pwdForm.new_password !== pwdForm.confirm_password) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }
    try {
      setPwdLoading(true);
      await changePassword({
        current_password: pwdForm.current_password,
        new_password: pwdForm.new_password,
      });
      setShowPwdModal(false);
      setMessage("Password changed");
      setMessageType("success");
    } catch {
      setMessage("Password change failed");
      setMessageType("error");
    } finally {
      setPwdLoading(false);
    }
  };

  const submitDelete = async () => {
    if (confirmText !== "DELETE") return;
    try {
      setDeleteLoading(true);
      await deleteAccount();
      setShowDeleteModal(false);
      setMessage("Account deleted");
      setMessageType("success");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/goodbye");
    } catch {
      setMessage("Delete failed");
      setMessageType("error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const triggerFilePicker = () => fileInputRef.current?.click();

  return (
    <div className="pf-page">
      <div className="pf-container">
        <aside className="pf-section">
          <div className="pf-header">
            <div className="pf-title">Profile</div>
          </div>

          {message && (
            <div role="status" aria-live="polite" className={`pf-notice pf-${messageType}`}>
              {message}
            </div>
          )}

          <div className="pf-avatar-wrap">
            <img
                src={profile.avatar_url || defaultAvatar}
                alt="Profile avatar"
                className="pf-avatar"
                onError={(e) => {
                  e.currentTarget.src = defaultAvatar;
                }}
              />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="pf-file-input"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            />

            <div className="pf-row">
              <button className="pf-btn pf-btn-wine" onClick={triggerFilePicker}>
                Choose file
              </button>
              <button className="pf-btn pf-btn-outline" onClick={openPwdModal}>
                Change password
              </button>
            </div>

            <div className="pf-helper">PNG/JPG up to 5MB</div>

            <button className="pf-btn pf-btn-wine pf-btn-block" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </aside>

        <main className="pf-main">
          <section className="pf-section">
            <div className="pf-header">
              <div className="pf-title">Account details</div>
            </div>

            <div className="pf-grid">
              <div className="pf-field">
                <label className="pf-label">Username</label>
                <input
                  name="username"
                  value={profile.username || ""}
                  onChange={handleChange}
                  className="pf-input"
                  placeholder="Username"
                  autoComplete="username"
                />
              </div>

              <div className="pf-field">
                <label className="pf-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email || ""}
                  onChange={handleChange}
                  className="pf-input"
                  placeholder="Email"
                  autoComplete="email"
                />
              </div>

              <div className="pf-field pf-span-2">
                <label className="pf-label">Public name</label>
                <input
                  name="public_name"
                  value={profile.public_name || ""}
                  onChange={handleChange}
                  className="pf-input"
                  placeholder="Display name shown to others"
                />
              </div>

              <div className="pf-field pf-span-2">
                <label className="pf-label">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio || ""}
                  onChange={handleChange}
                  className="pf-textarea"
                  placeholder="Tell people a little about yourself"
                  rows={5}
                />
              </div>
            </div>
          </section>

          <section className="pf-section">
            <div className="pf-header">
              <div className="pf-title">Socials</div>
            </div>

            <div className="pf-grid">
              <div className="pf-field">
                <label className="pf-label">Instagram</label>
                <input
                  name="instagram"
                  value={profile.instagram || ""}
                  onChange={handleChange}
                  className="pf-input"
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div className="pf-field">
                <label className="pf-label">Twitter</label>
                <input
                  name="twitter"
                  value={profile.twitter || ""}
                  onChange={handleChange}
                  className="pf-input"
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div className="pf-field pf-span-2">
                <label className="pf-label">Facebook</label>
                <input
                  name="facebook"
                  value={profile.facebook || ""}
                  onChange={handleChange}
                  className="pf-input"
                  placeholder="https://facebook.com/username"
                />
              </div>
            </div>
          </section>

          <section className="pf-section">
            <div className="pf-header">
              <div className="pf-title">Danger zone</div>
            </div>
            <p className="pf-subtext">
              Deleting the account removes all user data from the database. This action is irreversible.
            </p>
            <button className="pf-btn pf-btn-danger" onClick={() => setShowDeleteModal(true)}>
              Delete account
            </button>
          </section>
        </main>
      </div>
      {showPwdModal && (
        <div className="pf-modal-overlay" role="dialog" aria-modal="true" aria-label="Change password">
          <div className="pf-modal change-password-panel">
            <div className="pf-modal-head">
              <div className="pf-title">Change password</div>
              <button
                className="pf-btn pf-btn-outline pf-btn-sm"
                onClick={() => setShowPwdModal(false)}
              >
                Close
              </button>
            </div>

            <div className="pf-modal-body">
              <div className="pf-field">
                <label className="pf-label">Current password</label>
                <input
                  type="password"
                  value={pwdForm.current_password}
                  onChange={(e) => setPwdForm({ ...pwdForm, current_password: e.target.value })}
                  className="pf-input"
                  autoComplete="current-password"
                />
              </div>
              <div className="pf-field">
                <label className="pf-label">New password</label>
                <input
                  type="password"
                  value={pwdForm.new_password}
                  onChange={(e) => setPwdForm({ ...pwdForm, new_password: e.target.value })}
                  className="pf-input"
                  autoComplete="new-password"
                />
              </div>
              <div className="pf-field">
                <label className="pf-label">Confirm new password</label>
                <input
                  type="password"
                  value={pwdForm.confirm_password}
                  onChange={(e) => setPwdForm({ ...pwdForm, confirm_password: e.target.value })}
                  className="pf-input"
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="pf-modal-overlay" role="dialog" aria-modal="true" aria-label="Delete account">
          <div className="pf-modal">
            <div className="pf-modal-head">
              <div className="pf-title">Confirm delete</div>
              <button className="pf-btn pf-btn-outline pf-btn-sm" onClick={() => setShowDeleteModal(false)}>
                Close
              </button>
            </div>

            <div className="pf-modal-body">
              <p className="pf-subtext">This will permanently delete the account and all associated data. Type DELETE to confirm.</p>
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder='Type "DELETE" to confirm'
                className="pf-input"
              />
            </div>

            <div className="pf-modal-actions">
              <button
                className="pf-btn pf-btn-danger"
                onClick={submitDelete}
                disabled={confirmText !== "DELETE" || deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete account"}
              </button>
              <button className="pf-btn pf-btn-outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
