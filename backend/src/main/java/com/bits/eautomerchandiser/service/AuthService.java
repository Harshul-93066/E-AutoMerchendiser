package com.bits.eautomerchandiser.service;

import com.bits.eautomerchandiser.dto.LoginRequest;
import com.bits.eautomerchandiser.dto.LoginResponse;
import com.bits.eautomerchandiser.dto.RegisterRequest;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    String register(RegisterRequest request);
}
