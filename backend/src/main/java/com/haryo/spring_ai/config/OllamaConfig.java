package com.haryo.spring_ai.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OllamaConfig {

    @Bean
    ChatClient ollamaClient(OllamaChatModel chatModel) {
        return ChatClient.builder(chatModel).build();
    }
}