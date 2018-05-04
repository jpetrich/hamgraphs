FROM openjdk:8-jre-alpine
COPY target/hamgraphs-spring-0.0.1-SNAPSHOT.war /app.war

CMD ["/usr/bin/java", "-jar", "-Dspring.profiles.active=test", "/app.war"]


