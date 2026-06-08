package com.haryo.spring_ai.controller;

import com.haryo.spring_ai.dto.CodeReviewRequest;
import com.haryo.spring_ai.dto.response.CodeReviewResponse;
import com.haryo.spring_ai.service.CodeReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
@Tag(name = "Code Review")
public class ReviewController {

    private final CodeReviewService codeReviewService;

    @Operation(summary = "Review source code and return structured findings")
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<CodeReviewResponse> review(@Valid @RequestBody CodeReviewRequest request) {
        return ResponseEntity.ok(codeReviewService.review(request));
    }
}
