import React, { useEffect, useState } from "react"

import { useBanking } from "../../contexts/BankingContext"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import Loading from "../../components/Loading"

function RecipientsPage() {
  const { state, fetchRecipients, addRecipient, updateRecipient, deleteRecipient } = useBanking()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRecipient, setEditingRecipient] = useState(null)
  const [formData, setFormData] = useState({
    recipientAccountNumber: "",
    recipientName: "",
    bankName: "",
    bankId: "",
  })

  useEffect(() => {
    fetchRecipients()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (editingRecipient) {
      await updateRecipient({ ...editingRecipient, ...formData })
      setEditingRecipient(null)
    } else {
      await addRecipient({
        userId: "1",
        ...formData,
      })
    }

    setFormData({
      recipientAccountNumber: "",
      recipientName: "",
      bankName: "",
      bankId: "",
    })
    setShowAddForm(false)
  }

  const handleEdit = (recipient) => {
    setEditingRecipient(recipient)
    setFormData({
      recipientAccountNumber: recipient.recipientAccountNumber,
      recipientName: recipient.recipientName,
      bankName: recipient.bankName || "",
      bankId: recipient.bankId || "",
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recipient?")) {
      await deleteRecipient(id)
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>👥 Recipients Management</h1>
            <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
              ➕ Add New Recipient
            </button>
          </div>

          {/* Add/Edit Form Modal */}
          {showAddForm && (
            <div className="modal-overlay">
              <div className="modal">
                <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
                  {editingRecipient ? "Edit Recipient" : "Add New Recipient"}
                </h3>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Account Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.recipientAccountNumber}
                      onChange={(e) => setFormData((prev) => ({ ...prev, recipientAccountNumber: e.target.value }))}
                      placeholder="Enter account number"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Recipient Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.recipientName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, recipientName: e.target.value }))}
                      placeholder="Enter recipient name (optional)"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bank</label>
                    <select
                      className="form-input"
                      value={formData.bankId}
                      onChange={(e) => {
                        const bankId = e.target.value
                        const bankName = bankId === "same-bank" ? "Same Bank" : "Other Bank"
                        setFormData((prev) => ({ ...prev, bankId, bankName }))
                      }}
                      required
                    >
                      <option value="">Select Bank</option>
                      <option value="same-bank">Same Bank (Internal)</option>
                      <option value="other-bank">Other Bank (External)</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: "12px", marginTop: "30px" }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                      {editingRecipient ? "Update" : "Add"} Recipient
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false)
                        setEditingRecipient(null)
                        setFormData({
                          recipientAccountNumber: "",
                          recipientName: "",
                          bankName: "",
                          bankId: "",
                        })
                      }}
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Recipients List */}
          <div className="card">
            <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>Saved Recipients</h3>

            {state.recipients.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: "64px", marginBottom: "20px" }}>👥</div>
                <h3 style={{ fontSize: "24px", marginBottom: "16px", color: "#333" }}>No Recipients Yet</h3>
                <p style={{ color: "#666", marginBottom: "30px" }}>
                  Add recipients to make transfers easier and faster
                </p>
                <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
                  Add Your First Recipient
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "16px" }}>
                {state.recipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "20px",
                      border: "2px solid #f0f0f0",
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "24px",
                        marginRight: "20px",
                      }}
                    >
                      👤
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>
                        {recipient.recipientName || "Unknown Name"}
                      </h4>
                      <div style={{ color: "#666", marginBottom: "4px" }}>
                        Account: {recipient.recipientAccountNumber}
                      </div>
                      <div
                        style={{
                          display: "inline-block",
                          background: recipient.bankId === "same-bank" ? "#e3f2fd" : "#fff3e0",
                          color: recipient.bankId === "same-bank" ? "#1976d2" : "#f57c00",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {recipient.bankName}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleEdit(recipient)}
                        className="btn btn-secondary"
                        style={{ padding: "8px 16px", fontSize: "14px" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(recipient.id)}
                        className="btn btn-danger"
                        style={{ padding: "8px 16px", fontSize: "14px" }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default RecipientsPage;