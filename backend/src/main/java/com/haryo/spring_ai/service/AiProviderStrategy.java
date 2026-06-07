package com.haryo.spring_ai.service;

import com.haryo.spring_ai.dto.StreamRequest;
import org.springframework.ai.chat.prompt.Prompt;
import reactor.core.publisher.Flux;

public interface AiProviderStrategy {
    String provider();
    String chat(String model, Prompt prompt);
    Object chat(String model, Prompt prompt, Class entity);
    Flux<String> stream(StreamRequest request);

}
