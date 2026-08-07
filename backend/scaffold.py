import os

base_pkg = "src/main/java/com/jobportal"
dirs = [
    f"{base_pkg}/config",
    f"{base_pkg}/controller",
    f"{base_pkg}/dto",
    f"{base_pkg}/entity",
    f"{base_pkg}/exception",
    f"{base_pkg}/repository",
    f"{base_pkg}/security",
    f"{base_pkg}/service",
    f"{base_pkg}/util",
    "src/main/resources"
]

for d in dirs:
    os.makedirs(d, exist_ok=True)

with open(f"{base_pkg}/JobPortalApplication.java", "w") as f:
    f.write("""package com.jobportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JobPortalApplication {
    public static void main(String[] args) {
        SpringApplication.run(JobPortalApplication.class, args);
    }
}
""")

with open("src/main/resources/application.properties", "w") as f:
    f.write("""spring.application.name=ai-job-portal
spring.datasource.url=jdbc:mysql://localhost:3306/job_portal?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

jwt.secret=94a08da1fecbb6e8b46990538c7b50b2b80a1532057d4722514c3e803fb527a4
jwt.expiration=86400000
jwt.refresh-token.expiration=604800000
""")

print("Scaffolded backend structure.")
