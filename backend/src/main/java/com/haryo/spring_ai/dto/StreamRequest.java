package com.haryo.spring_ai.dto;

import lombok.Builder;
import lombok.Data;
import org.springframework.ai.chat.prompt.Prompt;

import java.util.UUID;

@Data @Builder
public class StreamRequest {
    UUID sessionId;
    String model;
    Prompt prompt;
}
