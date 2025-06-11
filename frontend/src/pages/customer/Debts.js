import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useBanking } from "../../contexts/BankingContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Loading from "../../components/Loading";
import { 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  Box 
} from "@mui/material";

function DebtsPage() {
  const { state, fetchDebts, createDebt, payDebt, cancelDebt } = useBanking();
  const [activeTab, setActiveTab] = useState("received");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPayModal, setShowPayModal] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(null);
  const [otp, setOtp] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchDebts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitCreateDebt = async (data) => {
    await createDebt(data);
    reset();
    setShowCreateForm(false);
  };

  const handlePayDebt = async (debtId) => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }
    await payDebt(debtId, otp);
    setShowPayModal(null);
    setOtp("");
  };

  const handleCancelDebt = async (debtId) => {
    if (!cancelReason.trim()) {
      alert("Please enter cancellation reason");
      return;
    }
    await cancelDebt(debtId, cancelReason);
    setShowCancelModal(null);
    setCancelReason("");
  };

  const receivedDebts = state.debts.filter((debt) => debt.debtorId === "1");
  const sentDebts = state.debts.filter((debt) => debt.creditorId === "1");

  if (state.loading) {
    return <Loading />;
  }

  return (
    <div>
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <div className="fade-in">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" fontWeight="bold">
              📝 Debt Management
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setShowCreateForm(true)}
            >
              ➕ Create Debt Reminder
            </Button>
          </Box>

          {/* Tabs */}
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)} 
            sx={{ mb: 4 }}
          >
            <Tab 
              label={`📥 Received Debts (${receivedDebts.length})`} 
              value="received" 
            />
            <Tab 
              label={`📤 Sent Debts (${sentDebts.length})`} 
              value="sent" 
            />
          </Tabs>

          {/* Create Debt Modal */}
          <Dialog open={showCreateForm} onClose={() => setShowCreateForm(false)}>
            <DialogTitle>Create Debt Reminder</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit(onSubmitCreateDebt)}>
                <Box mb={2}>
                  <TextField
                    fullWidth
                    label="Debtor Account Number"
                    {...register("debtorAccountNumber", { 
                      required: "Debtor account number is required" 
                    })}
                    error={!!errors.debtorAccountNumber}
                    helperText={errors.debtorAccountNumber?.message}
                  />
                </Box>
                <Box mb={2}>
                  <TextField
                    fullWidth
                    label="Debtor Name"
                    {...register("debtorName", { 
                      required: "Debtor name is required" 
                    })}
                    error={!!errors.debtorName}
                    helperText={errors.debtorName?.message}
                  />
                </Box>
                <Box mb={2}>
                  <TextField
                    fullWidth
                    label="Amount (VND)"
                    type="number"
                    {...register("amount", { 
                      required: "Amount is required",
                      min: { value: 1000, message: "Minimum amount is 1000 VND" }
                    })}
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                  />
                </Box>
                <Box mb={2}>
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={3}
                    {...register("message", { 
                      required: "Message is required" 
                    })}
                    error={!!errors.message}
                    helperText={errors.message?.message}
                  />
                </Box>
                <DialogActions>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                  >
                    Send Reminder
                  </Button>
                  <Button 
                    onClick={() => setShowCreateForm(false)} 
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>

          {/* Pay Debt Modal */}
          <Dialog open={!!showPayModal} onClose={() => setShowPayModal(null)}>
            <DialogTitle>Pay Debt</DialogTitle>
            <DialogContent>
              {(() => {
                const debt = state.debts.find((d) => d.id === showPayModal);
                return debt ? (
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography><strong>To:</strong> {debt.creditorName}</Typography>
                      <Typography>
                        <strong>Amount:</strong> {new Intl.NumberFormat("vi-VN").format(debt.amount)} VND
                      </Typography>
                      <Typography><strong>Message:</strong> {debt.message}</Typography>
                    </CardContent>
                  </Card>
                ) : null;
              })()}
              <TextField
                fullWidth
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                inputProps={{ maxLength: 6, style: { textAlign: "center", fontSize: 24, letterSpacing: 8 } }}
              />
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => handlePayDebt(showPayModal)} 
                variant="contained" 
                color="primary"
              >
                Confirm Payment
              </Button>
              <Button 
                onClick={() => {
                  setShowPayModal(null);
                  setOtp("");
                }} 
                variant="outlined"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          {/* Cancel Debt Modal */}
          <Dialog open={!!showCancelModal} onClose={() => setShowCancelModal(null)}>
            <DialogTitle>Cancel Debt Reminder</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Cancellation Reason"
                multiline
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter cancellation reason"
              />
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => handleCancelDebt(showCancelModal)} 
                variant="contained" 
                color="primary"
              >
                Confirm Cancellation
              </Button>
              <Button 
                onClick={() => {
                  setShowCancelModal(null);
                  setCancelReason("");
                }} 
                variant="outlined"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          {/* Debt Lists */}
          {activeTab === "received" && (
            <div>
              {receivedDebts.length === 0 ? (
                <Typography>No received debts.</Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Debtor</TableCell>
                      <TableCell>Amount (VND)</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {receivedDebts.map((debt) => (
                      <TableRow key={debt.id}>
                        <TableCell>{debt.debtorName}</TableCell>
                        <TableCell>{new Intl.NumberFormat("vi-VN").format(debt.amount)}</TableCell>
                        <TableCell>{debt.message}</TableCell>
                        <TableCell>{debt.status}</TableCell>
                        <TableCell>
                          {debt.status === "Pending" ? (
                            <>
                              <Button 
                                onClick={() => setShowPayModal(debt.id)} 
                                variant="contained" 
                                color="success" 
                                size="small" 
                                sx={{ mr: 1 }}
                              >
                                Pay
                              </Button>
                              <Button 
                                onClick={() => setShowCancelModal(debt.id)} 
                                variant="contained" 
                                color="error" 
                                size="small"
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <span>—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {activeTab === "sent" && (
            <div>
              {sentDebts.length === 0 ? (
                <Typography>No sent debts.</Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Creditor</TableCell>
                      <TableCell>Amount (VND)</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sentDebts.map((debt) => (
                      <TableRow key={debt.id}>
                        <TableCell>{debt.creditorName}</TableCell>
                        <TableCell>{new Intl.NumberFormat("vi-VN").format(debt.amount)}</TableCell>
                        <TableCell>{debt.message}</TableCell>
                        <TableCell>{debt.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default DebtsPage;