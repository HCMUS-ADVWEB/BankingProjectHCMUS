import React, { useEffect } from "react"
import { useBanking } from "../../contexts/BankingContext"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import Loading from "../../components/Loading"
import Footer from "../../components/Footer"

function AccountsPage() {
  const { state, fetchAccounts } = useBanking()

  useEffect(() => {
    fetchAccounts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state.loading) {
    return <Loading />
  }

  return (
    <div>
      <Navbar />
      <Sidebar />
      <Footer />  

      <main className="main-content">
        <div className="fade-in">
          <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "30px" }}>💳 My Accounts</h1>

          <div style={{ display: "grid", gap: "24px" }}>
            {state.accounts.map((account) => (
              <div
                key={account.id}
                className="card"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "20px",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Payment Account</h3>
                      <div style={{ fontSize: "14px", opacity: 0.9 }}>Account Number</div>
                      <div style={{ fontSize: "20px", fontWeight: "bold", letterSpacing: "2px" }}>{account.number}</div>
                    </div>
                    <div style={{ fontSize: "24px" }}>💳</div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "4px" }}>Current Balance</div>
                    <div style={{ fontSize: "32px", fontWeight: "bold" }}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(account.balance)}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "12px", opacity: 0.8 }}>Status</div>
                      <div
                        style={{
                          display: "inline-block",
                          background: account.isActive ? "#28a745" : "#dc3545",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {account.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        className="btn"
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.3)",
                          padding: "8px 16px",
                          fontSize: "14px",
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Decorative background */}
                <div
                  style={{
                    position: "absolute",
                    top: "-50%",
                    right: "-20%",
                    width: "200px",
                    height: "200px",
                    background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                    borderRadius: "50%",
                  }}
                />
              </div>
            ))}
          </div>

          {state.accounts.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>💳</div>
              <h3 style={{ fontSize: "24px", marginBottom: "16px", color: "#333" }}>No Accounts Found</h3>
              <p style={{ color: "#666", marginBottom: "30px" }}>Contact your bank to set up your first account</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AccountsPage;