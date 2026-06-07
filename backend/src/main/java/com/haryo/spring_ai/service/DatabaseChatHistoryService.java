package com.haryo.spring_ai.service;

import com.haryo.spring_ai.entity.ChatMessage;
import com.haryo.spring_ai.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DatabaseChatHistoryService implements ChatHistoryService {
    private static final Integer PAGE_LIMIT = 20;
    private final ChatMessageRepository repository;

    @Override
    public List<Message> getHistory(UUID sessionId) {
        List<ChatMessage> history = new ArrayList<>(
                repository.findBySessionId(
                        sessionId,
                        PageRequest.of(
                                0,
                                PAGE_LIMIT,
                                Sort.by("createdAt").descending()
                        )
                ).getContent()
        );

        Collections.reverse(history);
        return history.stream()
                .map(this::toMessage)
                .toList();
    }

    private Message toMessage(ChatMessage entity) {

        return switch (entity.getRole()) {

            case "USER" ->
                    new UserMessage(entity.getContent());

            case "ASSISTANT" ->
                    new AssistantMessage(entity.getContent());

            default ->
                    new SystemMessage(entity.getContent());
        };
    }

    @Override
    public void saveUserMessage(
            UUID sessionId,
            String content
    ) {

        repository.save(
                ChatMessage.builder()
                        .id(UUID.randomUUID())
                        .sessionId(sessionId)
                        .role("USER")
                        .content(content)
                        .createdAt(LocalDateTime.now())
                        .build()
        );
    }

    @Override
    public void saveAssistantMessage(
            UUID sessionId,
            String content
    ) {

        repository.save(
                ChatMessage.builder()
                        .id(UUID.randomUUID())
                        .sessionId(sessionId)
                        .role("ASSISTANT")
                        .content(content)
                        .createdAt(LocalDateTime.now())
                        .build()
        );
    }
}