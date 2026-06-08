package com.haryo.spring_ai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.UUID;

@Data
public class CodeReviewRequest {
    UUID sessionId;
    @Schema(example = "OPENAI/OLLAMA")
    String provider;

    @Schema(example = "gpt-4.1-mini/qwen2.5-coder:3b")
    String model;
    String title;
    String code;
}
