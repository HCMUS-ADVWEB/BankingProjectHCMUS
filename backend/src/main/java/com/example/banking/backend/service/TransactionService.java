package com.example.banking.backend.service;

public interface TransactionService {


    void transferInternal() ;
    void transferExternal() ;
    void verifyOTP();
    // Nạp tiền từ ngân hàng khác
    void depositExternal() ;



    void transactionHistory (int customerID );





}
