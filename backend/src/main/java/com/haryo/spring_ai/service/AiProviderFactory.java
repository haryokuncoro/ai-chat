package com.haryo.spring_ai.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AiProviderFactory {

    private final Map<String, AiProviderStrategy> strategies;

    public AiProviderFactory(List<AiProviderStrategy> strategyList) {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(
                        s -> s.provider().toUpperCase(),
                        Function.identity()
                ));
    }

    public AiProviderStrategy getStrategy(String provider) {
        AiProviderStrategy strategy = strategies.get(provider.toUpperCase());
        if (strategy == null) {
            throw new IllegalArgumentException(
                    "Unsupported provider: " + provider
            );
        }
        return strategy;
    }
}