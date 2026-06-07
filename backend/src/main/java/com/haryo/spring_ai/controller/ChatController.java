package com.haryo.spring_ai.controller;

import com.haryo.spring_ai.dto.ChatRequest;
import com.haryo.spring_ai.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public String chat(@RequestBody ChatRequest request) {
        return chatService.chat(request);
    }

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> stream(@RequestBody ChatRequest request) {
        return chatService.stream(request);
    }

    @PostMapping("/sessions")
    public String createSession() {
        return chatService.createSession();
    }
}
