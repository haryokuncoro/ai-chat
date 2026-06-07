package com.haryo.spring_ai.service;

import com.haryo.spring_ai.dto.AssistantMode;

public interface SystemPromptProvider {
    String getPrompt(AssistantMode mode);
}