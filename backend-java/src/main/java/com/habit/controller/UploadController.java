package com.habit.controller;

import com.habit.common.R;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @PostMapping("")
    public R upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return R.error("请选择文件");
        }
        String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String originalName = file.getOriginalFilename();
        String ext = originalName != null && originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf("."))
                : "";
        String filename = System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6) + ext;

        try {
            file.transferTo(new File(uploadDir + File.separator + filename));
            Map<String, String> data = new HashMap<>();
            data.put("url", "/uploads/" + filename);
            data.put("filename", filename);
            return R.ok(data);
        } catch (IOException e) {
            return R.error("文件上传失败: " + e.getMessage());
        }
    }
}
