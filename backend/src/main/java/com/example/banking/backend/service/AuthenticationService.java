package com.example.banking.backend.service;

public interface AuthenticationService {

    void login() ;
    void refreshToken() ;
    void forgotPassword() ;
    void resetPassword() ;
    void changePassword() ;
    void verifyOtp() ;
    void getUserInfo();


    void getEmployees() ;
    void addEmployees() ;
    void updateEmployees() ;
    void deleteEmployees() ;
    void createCustomerAccount();






}
