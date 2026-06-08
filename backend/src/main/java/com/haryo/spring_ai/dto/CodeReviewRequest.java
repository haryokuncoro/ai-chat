package com.haryo.spring_ai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class CodeReviewRequest {
    @NotNull
    @Schema(example = "UUID")
    private UUID sessionId;

    @NotBlank
    @Schema(example = "OPENAI/OLLAMA")
    private String provider;

    @NotBlank
    @Schema(example = "gpt-4.1-mini/qwen2.5-coder:3b")
    private String model;

    @Size(max = 200)
    private String title;

    @NotBlank
    private String code;

    @Schema(example = "Java")
    @Size(max = 80)
    private String language;

    @Schema(example = "Spring Boot")
    @Size(max = 120)
    private String framework;

    @Schema(example = "[\"security\", \"performance\", \"maintainability\"]")
    @Size(max = 10)
    private List<@Size(max = 60) String> focusAreas;

    @Schema(example = "MEDIUM")
    private String severityThreshold;

    @Schema(example = "true")
    private Boolean includeFixedCode;

    @Schema(example = "true")
    private Boolean includeTests;

    @Schema(example = "Check for API design issues and suggest cleaner Spring conventions.")
    @Size(max = 1000)
    private String instructions;
}
