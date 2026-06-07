package com.haryo.spring_ai.service;

import com.haryo.spring_ai.dto.ChatRequest;
import com.haryo.spring_ai.dto.StreamRequest;
import com.haryo.spring_ai.entity.ChatSession;
import com.haryo.spring_ai.repository.ChatSessionRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final SystemPromptProvider systemPromptProvider;
    private final AiProviderFactory factory;
    private final ChatHistoryService chatHistoryService;
    private final ChatSessionRepository chatSessionRepository;

    @Transactional
    public String chat(ChatRequest request) {
        UUID sessionId = request.getSessionId();
        updateSession(sessionId, request.getPrompt());
        chatHistoryService.saveUserMessage(sessionId, request.getPrompt());
        List<Message> history = chatHistoryService.getHistory(sessionId);
        List<Message> messages = new ArrayList<>();
        String systemPrompt = systemPromptProvider.getPrompt(request.getMode());
        messages.add(new SystemMessage(systemPrompt));

        messages.addAll(history);
        Prompt prompt =
                new Prompt(messages);
        String response =  factory.getStrategy(request.getProvider())
                .chat(
                        request.getModel(),
                        prompt
                );
        chatHistoryService.saveAssistantMessage(sessionId, response);
        return response;
    }

    @Transactional
    public Flux<String> stream(ChatRequest request) {
        UUID sessionId = request.getSessionId();
        updateSession(sessionId, request.getPrompt());
        chatHistoryService.saveUserMessage(sessionId, request.getPrompt());
        List<Message> history = chatHistoryService.getHistory(sessionId);
        List<Message> messages = new ArrayList<>();
        String systemPrompt = systemPromptProvider.getPrompt(request.getMode());
        messages.add(new SystemMessage(systemPrompt));

        messages.addAll(history);
        Prompt prompt =
                new Prompt(messages);
        StreamRequest streamRequest = StreamRequest.builder()
                .sessionId(sessionId)
                .model(request.getModel())
                .prompt(prompt)
                .build();
        return factory.getStrategy(request.getProvider())
                .stream(streamRequest);
    }

    public String createSession() {
        UUID sessionId = UUID.randomUUID();
        ChatSession session =
                ChatSession.builder()
                        .id(sessionId)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();

        chatSessionRepository.save(session);
        return sessionId.toString();
    }

    public void updateSession(UUID sessionId, String title){
        ChatSession session = chatSessionRepository.findById(sessionId).orElseThrow();
        if(StringUtils.isNotBlank(session.getTitle())){
            return;
        }
        session.setTitle(title);
        chatSessionRepository.save(session);
    }
}