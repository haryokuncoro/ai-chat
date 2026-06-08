package com.haryo.spring_ai.service;

import com.haryo.spring_ai.dto.AssistantMode;
import com.haryo.spring_ai.dto.CodeReviewRequest;
import com.haryo.spring_ai.dto.response.CodeReviewResponse;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class CodeReviewService {
    private final SystemPromptProvider systemPromptProvider;
    private final AiProviderFactory factory;
    private final ChatService chatService;
    private final ChatHistoryService chatHistoryService;

    @Transactional
    public CodeReviewResponse review(CodeReviewRequest request) {
        UUID sessionId = request.getSessionId();
        chatService.updateSession(sessionId, request.getTitle());
        chatHistoryService.saveUserMessage(sessionId, request.getCode());

        List<Message> messages = new ArrayList<>();
        String systemPrompt = systemPromptProvider.getPrompt(AssistantMode.CODE_REVIEW);
        messages.add(new SystemMessage(systemPrompt));
        messages.add(new UserMessage(buildReviewPrompt(request)));
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

    private String buildReviewPrompt(CodeReviewRequest request) {
        StringBuilder builder = new StringBuilder();
        builder.append("Review configuration:\n");
        appendLine(builder, "Language", request.getLanguage());
        appendLine(builder, "Framework", request.getFramework());
        appendLine(builder, "Severity threshold", request.getSeverityThreshold());
        appendLine(builder, "Include fixed code", request.getIncludeFixedCode());
        appendLine(builder, "Include test suggestions", request.getIncludeTests());

        if (request.getFocusAreas() != null && !request.getFocusAreas().isEmpty()) {
            String focusAreas = request.getFocusAreas()
                    .stream()
                    .filter(StringUtils::isNotBlank)
                    .collect(Collectors.joining(", "));
            appendLine(builder, "Focus areas", focusAreas);
        }

        if (StringUtils.isNotBlank(request.getInstructions())) {
            appendLine(builder, "Additional instructions", request.getInstructions());
        }

        builder.append("""
                
                Instructions:
                - Return findings at or above the requested severity threshold when provided.
                - If includeFixedCode is false, set fixedCode to null.
                - If includeTests is true, include concrete testSuggestions.
                - Keep findings specific and actionable.
                
                Code:
                """);
        builder.append(request.getCode());
        return builder.toString();
    }

    private void appendLine(StringBuilder builder, String label, Object value) {
        if (value == null) {
            return;
        }
        String text = value.toString();
        if (StringUtils.isBlank(text)) {
            return;
        }
        builder.append("- ").append(label).append(": ").append(text).append("\n");
    }
}
