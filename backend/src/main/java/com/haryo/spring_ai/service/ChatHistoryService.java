package com.haryo.spring_ai.service;

import org.springframework.ai.chat.messages.Message;

import java.util.List;
import java.util.UUID;

public interface ChatHistoryService {

    void saveUserMessage(UUID sessionId, String content);

    void saveAssistantMessage(UUID sessionId, String content);

    List<Message> getHistory(UUID sessionId);
}