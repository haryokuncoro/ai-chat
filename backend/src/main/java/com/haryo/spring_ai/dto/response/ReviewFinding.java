package com.haryo.spring_ai.dto.response;

import lombok.Data;

@Data
public class ReviewFinding {
    String severity;
    String category;
    String message;
    String suggestion;
    String codeSnippet;
}
