# Используем официальный образ JDK 23
FROM openjdk:23-jdk-slim

# Устанавливаем Maven
RUN apt-get update && apt-get install -y maven

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем все файлы проекта в контейнер
COPY . .

# Собираем проект
RUN mvn clean package -DskipTests

# Открываем порт
EXPOSE 8080

# Запускаем приложение
CMD ["java", "-jar", "target/MIRA-0.0.1-SNAPSHOT.jar"]
