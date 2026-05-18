package com.projectcart.dto.auth;

import com.projectcart.dto.user.UserSummaryDto;

public record AuthResponse(String token, UserSummaryDto user) {}
