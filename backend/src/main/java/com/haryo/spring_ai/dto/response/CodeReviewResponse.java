package com.haryo.spring_ai.dto.response;

import lombok.Data;

import java.util.List;
@Data
public class CodeReviewResponse {
    String summary;
    List<ReviewFinding> findings;
    List<String> refactoringSuggestions;
    List<String> testSuggestions;
    String fixedCode;
}
