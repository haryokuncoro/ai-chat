package com.haryo.spring_ai.controller;

import com.haryo.spring_ai.dto.CodeReviewRequest;
import com.haryo.spring_ai.dto.response.CodeReviewResponse;
import com.haryo.spring_ai.service.CodeReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

    private final CodeReviewService codeReviewService;

    @PostMapping
    public CodeReviewResponse chat(@RequestBody CodeReviewRequest request) {
        return codeReviewService.review(request);
    }
}
