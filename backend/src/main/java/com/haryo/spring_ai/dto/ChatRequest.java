package com.haryo.spring_ai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.UUID;

@Data
public class ChatRequest {
    @Schema(example = "UUID")
    UUID sessionId;

    @Schema(example = "OPENAI")
    String provider;

    @Schema(example = "gpt-4.1-mini")
    String model;

    @Schema(example = "CHAT | CODE_REVIEWER")
    AssistantMode mode;

    @Schema(example = "Explain Java Stream API")
    String prompt;
}
