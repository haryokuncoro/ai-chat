package com.haryo.spring_ai.service;

import com.haryo.spring_ai.dto.StreamRequest;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OpenAiStrategy implements AiProviderStrategy {
    @Value("${spring.ai.openai.chat.options.model}")
    private String defaultModel;

    private final ChatClient openAiClient;
    private final ChatHistoryService historyService;

    @Override
    public String provider() {
        return "OPENAI";
    }

    @Override
    public String chat(String model, Prompt prompt) {
        model = StringUtils.isBlank(model) ? defaultModel : model;
        return openAiClient.prompt(prompt)
                .options(
                        OpenAiChatOptions.builder()
                                .model(model)
                                .build()
                )
                .call()
                .content();
    }

    @Override
    public Object chat(String model, Prompt prompt, Class entity) {
        model = StringUtils.isBlank(model) ? defaultModel : model;
        return openAiClient.prompt(prompt)
                .options(
                        OpenAiChatOptions.builder()
                                .model(model)
                                .build()
                )
                .call()
                .entity(entity);
    }

    @Override
    public Flux<String> stream(StreamRequest request) {
        UUID sessionId = request.getSessionId();
        String model = StringUtils.isBlank(request.getModel()) ? defaultModel : request.getModel();
        StringBuilder builder =
                new StringBuilder();
        return openAiClient.prompt(request.getPrompt())
                .options(
                        OpenAiChatOptions.builder()
                                .model(model)
                                .build()
                )
                .stream()
                .content()
                .doOnNext(builder::append)
                .doOnComplete(() -> {
                    historyService.saveAssistantMessage(
                            sessionId,
                            builder.toString()
                    );
                });
    }
}