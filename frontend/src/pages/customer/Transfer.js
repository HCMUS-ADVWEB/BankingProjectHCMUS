import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useBanking } from "../../contexts/BankingContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Loading from "../../components/Loading";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

function TransferPage() {
  const { state, fetchAccounts, fetchRecipients, transfer } = useBanking();
  const [transferType, setTransferType] = useState("internal");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      fromAccount: "",
      toAccount: "",
      recipientName: "",
      amount: "",
      message: "",
      feeType: "SENDER",
      bankId: "",
      bankName: "",
    },
  });

  useEffect(() => {
    fetchAccounts();
    fetchRecipients();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRecipientSelect = (recipient) => {
    setValue("toAccount", recipient.recipientAccountNumber);
    setValue("recipientName", recipient.recipientName);
    setValue("bankId", recipient.bankId || "");
    setValue("bankName", recipient.bankName || "");
    setTransferType(recipient.bankId === "same-bank" ? "internal" : "external");
  };

  const onSubmit = async (data) => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!otp) {
        alert("Please enter OTP");
        return;
      }
      await transfer({ ...data, otp });
      setStep(3);
    }
  };

  const resetForm = () => {
    reset();
    setOtp("");
    setStep(1);
    setTransferType("internal");
  };

  if (state.loading) {
    return <Loading />;
  }

  return (
    <div>
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <div className="fade-in">
          <Typography variant="h4" fontWeight="bold" mb={4}>
            💸 Money Transfer
          </Typography>

          {step === 3 ? (
            <Card sx={{ textAlign: "center", p: 6 }}>
              <Typography variant="h1" mb={2}>
                ✅
              </Typography>
              <Typography variant="h5" color="success.main" mb={2}>
                Transfer Successful!
              </Typography>
              <Typography color="text.secondary" mb={4}>
                Your money has been transferred successfully.
              </Typography>
              <Card sx={{ bgcolor: "#f8f9fa", p: 2, mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Transfer Details:
                  </Typography>
                  <Box display="grid" gap={1}>
                    <Typography>
                      <strong>To:</strong> {state.formData?.recipientName} ({state.formData?.toAccount})
                    </Typography>
                    <Typography>
                      <strong>Amount:</strong> {new Intl.NumberFormat("vi-VN").format(Number(state.formData?.amount))} VND
                    </Typography>
                    <Typography>
                      <strong>Message:</strong> {state.formData?.message}
                    </Typography>
                    <Typography>
                      <strong>Type:</strong> {transferType === "internal" ? "Internal Transfer" : "External Transfer"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              <Box display="flex" gap={2} justifyContent="center">
                <Button variant="contained" color="primary" onClick={resetForm}>
                  Make Another Transfer
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  component={Link}
                  to="/customer/transactions"
                >
                  View Transactions
                </Button>
              </Box>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Transfer Type
                </Typography>
                <Box display="flex" gap={2} mb={4}>
                  <Button
                    variant={transferType === "internal" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setTransferType("internal")}
                  >
                    🏦 Internal Transfer
                  </Button>
                  <Button
                    variant={transferType === "external" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setTransferType("external")}
                  >
                    🌐 External Transfer
                  </Button>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {step === 1 && (
                    <>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>From Account</InputLabel>
                        <Select
                          {...register("fromAccount", { required: "Source account is required" })}
                          error={!!errors.fromAccount}
                          onChange={(e) => setValue("fromAccount", e.target.value)}
                        >
                          <MenuItem value="">Select source account</MenuItem>
                          {state.accounts.map((account) => (
                            <MenuItem key={account.id} value={account.number}>
                              {account.number} - {new Intl.NumberFormat("vi-VN").format(account.balance)} VND
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.fromAccount && (
                          <Typography color="error">{errors.fromAccount.message}</Typography>
                        )}
                      </FormControl>

                      {state.recipients.length > 0 && (
                        <Box mb={4}>
                          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                            Quick Select Recipient
                          </Typography>
                          <Box display="grid" gap={1}>
                            {state.recipients
                              .filter((r) =>
                                transferType === "internal" ? r.bankId === "same-bank" : r.bankId !== "same-bank"
                              )
                              .map((recipient) => (
                                <Button
                                  key={recipient.id}
                                  variant="outlined"
                                  onClick={() => handleRecipientSelect(recipient)}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    p: 1.5,
                                    border: "2px solid #e9ecef",
                                    borderRadius: 2,
                                    bgcolor: "white",
                                    textAlign: "left",
                                  }}
                                >
                                  <Typography fontSize={20} mr={1.5}>
                                    👤
                                  </Typography>
                                  <Box>
                                    <Typography fontWeight="bold">{recipient.recipientName}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {recipient.recipientAccountNumber} - {recipient.bankName}
                                    </Typography>
                                  </Box>
                                </Button>
                              ))}
                          </Box>
                        </Box>
                      )}

                      <TextField
                        fullWidth
                        label="To Account Number"
                        margin="normal"
                        {...register("toAccount", { required: "Recipient account number is required" })}
                        error={!!errors.toAccount}
                        helperText={errors.toAccount?.message}
                        onChange={(e) => setValue("toAccount", e.target.value)}
                      />

                      <TextField
                        fullWidth
                        label="Recipient Name"
                        margin="normal"
                        {...register("recipientName", { required: "Recipient name is required" })}
                        error={!!errors.recipientName}
                        helperText={errors.recipientName?.message}
                        onChange={(e) => setValue("recipientName", e.target.value)}
                      />

                      {transferType === "external" && (
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Bank</InputLabel>
                          <Select
                            {...register("bankId", { required: "Bank selection is required" })}
                            error={!!errors.bankId}
                            onChange={(e) => {
                              const bankId = e.target.value;
                              const bankName = bankId === "other-bank" ? "Other Bank" : "";
                              setValue("bankId", bankId);
                              setValue("bankName", bankName);
                            }}
                          >
                            <MenuItem value="">Select bank</MenuItem>
                            <MenuItem value="other-bank">Other Bank</MenuItem>
                          </Select>
                          {errors.bankId && (
                            <Typography color="error">{errors.bankId.message}</Typography>
                          )}
                        </FormControl>
                      )}

                      <TextField
                        fullWidth
                        label="Amount (VND)"
                        type="number"
                        margin="normal"
                        {...register("amount", {
                          required: "Amount is required",
                          min: { value: 1000, message: "Minimum amount is 1000 VND" },
                        })}
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                        onChange={(e) => setValue("amount", e.target.value)}
                      />

                      <TextField
                        fullWidth
                        label="Transfer Message"
                        multiline
                        rows={3}
                        margin="normal"
                        {...register("message", { required: "Message is required" })}
                        error={!!errors.message}
                        helperText={errors.message?.message}
                        onChange={(e) => setValue("message", e.target.value)}
                      />

                      <FormControl component="fieldset" margin="normal">
                        <FormLabel component="legend">Fee Payment</FormLabel>
                        <RadioGroup
                          row
                          {...register("feeType")}
                          onChange={(e) => setValue("feeType", e.target.value)}
                        >
                          <FormControlLabel value="SENDER" control={<Radio />} label="Sender pays fee" />
                          <FormControlLabel value="RECEIVER" control={<Radio />} label="Receiver pays fee" />
                        </RadioGroup>
                      </FormControl>

                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Continue to OTP Verification
                      </Button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <Typography variant="h6" fontWeight="bold" mb={2} textAlign="center">
                        🔐 OTP Verification
                      </Typography>
                      <Typography color="text.secondary" mb={4} textAlign="center">
                        We've sent a 6-digit OTP to your registered email address.
                      </Typography>

                      <Card sx={{ bgcolor: "#f8f9fa", p: 2, mb: 4 }}>
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold" mb={2}>
                            Transfer Summary:
                          </Typography>
                          <Box display="grid" gap={1}>
                            <Typography>
                              <strong>From:</strong> {state.formData?.fromAccount}
                            </Typography>
                            <Typography>
                              <strong>To:</strong> {state.formData?.recipientName} ({state.formData?.toAccount})
                            </Typography>
                            <Typography>
                              <strong>Amount:</strong> {new Intl.NumberFormat("vi-VN").format(Number(state.formData?.amount))} VND
                            </Typography>
                            <Typography>
                              <strong>Message:</strong> {state.formData?.message}
                            </Typography>
                            <Typography>
                              <strong>Fee paid by:</strong> {state.formData?.feeType === "SENDER" ? "Sender" : "Receiver"}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>

                      <TextField
                        fullWidth
                        label="Enter OTP Code"
                        margin="normal"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        inputProps={{ maxLength: 6, style: { textAlign: "center", fontSize: 24, letterSpacing: 8 } }}
                        required
                      />

                      <Box display="flex" gap={2} mt={2}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => setStep(1)}
                          sx={{ flex: 1 }}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          sx={{ flex: 1 }}
                        >
                          Confirm Transfer
                        </Button>
                      </Box>
                    </>
                  )}
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default TransferPage;