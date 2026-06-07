FROM gradle:8.5-jdk17 AS build

WORKDIR /app
COPY . .
RUN gradle clean build -x test --no-daemon

# Run stage
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app
COPY --from=build /app/build/libs/*-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]