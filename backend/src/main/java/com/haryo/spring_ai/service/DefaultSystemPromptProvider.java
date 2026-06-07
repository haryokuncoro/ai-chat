package com.haryo.spring_ai.service;

import com.haryo.spring_ai.dto.AssistantMode;
import org.springframework.stereotype.Service;

@Service
public class DefaultSystemPromptProvider implements SystemPromptProvider{
    private static final String CHAT_PROMPT = """
        You are a helpful AI assistant.
        Answer clearly and concisely.
        """;

    private static final String CODE_REVIEWER_PROMPT = """
            You are a senior software engineer.
            
            Review the provided code.
            
            Return ONLY valid JSON.
            
            Schema:
            
            {
              "summary": "string",
              "findings": [
                {
                  "severity": "LOW|MEDIUM|HIGH",
                  "message": "string"
                }
              ]
            }
        """;


    @Override
    public String getPrompt(AssistantMode mode) {

        return switch (mode) {
            case CHAT -> CHAT_PROMPT;
            case CODE_REVIEW -> CODE_REVIEWER_PROMPT;
        };
    }
}
