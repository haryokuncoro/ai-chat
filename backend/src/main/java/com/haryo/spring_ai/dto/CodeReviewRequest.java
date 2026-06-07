package com.haryo.spring_ai.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CodeReviewRequest {
    UUID sessionId;
    String provider;
    String title;
    String code;
}
