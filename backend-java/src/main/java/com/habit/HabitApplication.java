package com.habit;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.habit.mapper")
public class HabitApplication {
    public static void main(String[] args) {
        SpringApplication.run(HabitApplication.class, args);
        System.out.println("========================================");
        System.out.println("  习惯自律养成系统后端启动成功!");
        System.out.println("  http://localhost:3900");
        System.out.println("========================================");
    }
}
