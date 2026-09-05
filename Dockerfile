FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml and cache dependencies
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and build production jar
COPY backend/src src
RUN mvn clean package -DskipTests -B

# Production runtime stage
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 10000

ENTRYPOINT ["java", "-jar", "app.jar"]
