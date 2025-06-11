import React, { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import Loading from "../../components/Loading"

function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [success, setSuccess] = useState(false)

  const { state, changePassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match")
      return
    }

    if (formData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long")
      return
    }

    await changePassword(formData.currentPassword, formData.newPassword)

    if (!state.error) {
      setSuccess(true)
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }

  if (state.loading) {
    return <Loading />
  }

  return (
    <div>
      <Navbar />
      <Sidebar />

      <main className="main-content">
        <div className="fade-in">
          <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "30px" }}>🔒 Change Password</h1>

          <div className="card" style={{ maxWidth: "500px" }}>
            {success && (
              <div
                style={{
                  background: "#d4edda",
                  color: "#155724",
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                ✅ Password changed successfully!
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter your current password"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.newPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter your new password"
                  minLength={6}
                  required
                />
                <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                  Password must be at least 6 characters long
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm your new password"
                  required
                />
              </div>

              {state.error && (
                <div className="error" style={{ marginBottom: "20px" }}>
                  {state.error}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={state.loading}>
                Change Password
              </button>
            </form>

            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                background: "#f8f9fa",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              <h4 style={{ marginBottom: "12px", fontWeight: "bold" }}>Password Security Tips:</h4>
              <ul style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
                <li>Use a combination of letters, numbers, and special characters</li>
                <li>Avoid using personal information like birthdate or name</li>
                <li>Don't reuse passwords from other accounts</li>
                <li>Change your password regularly</li>
                <li>Never share your password with anyone</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChangePasswordPage;