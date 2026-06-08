package com.haryo.spring_ai.service;

import com.haryo.spring_ai.dto.AssistantMode;
import com.haryo.spring_ai.dto.CodeReviewRequest;
import com.haryo.spring_ai.dto.response.CodeReviewResponse;
import com.haryo.spring_ai.repository.ChatSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class CodeReviewService {
    private final SystemPromptProvider systemPromptProvider;
    private final AiProviderFactory factory;
    private final ChatService chatService;
    private final ChatHistoryService chatHistoryService;
    private final ChatSessionRepository chatSessionRepository;

    @Transactional
    public CodeReviewResponse review(CodeReviewRequest request) {
        UUID sessionId = request.getSessionId();
        chatService.updateSession(sessionId, request.getTitle());
        chatHistoryService.saveUserMessage(sessionId, request.getCode());

        List<Message> messages = new ArrayList<>();
        String systemPrompt = systemPromptProvider.getPrompt(AssistantMode.CODE_REVIEW);
        messages.add(new SystemMessage(systemPrompt));
        messages.add(new SystemMessage(request.getCode()));
        Prompt prompt = new Prompt(messages);

        Object response = factory.getStrategy(request.getProvider())
                .chat(
                        request.getModel(),
                        prompt,
                        CodeReviewResponse.class
                );
        chatHistoryService.saveAssistantMessage(sessionId, response.toString());
        return (CodeReviewResponse) response;
    }
}
