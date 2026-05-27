package com.habit.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.habit.common.R;
import com.habit.entity.Admin;
import com.habit.entity.Yonghu;
import com.habit.mapper.AdminMapper;
import com.habit.mapper.YonghuMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/common")
public class CommonController {

    @Autowired
    private AdminMapper adminMapper;
    @Autowired
    private YonghuMapper yonghuMapper;

    @PostMapping("/login")
    public R login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String role = body.get("role");

        if ("管理员".equals(role)) {
            QueryWrapper<Admin> qw = new QueryWrapper<>();
            qw.eq("username", username).eq("password", password);
            Admin admin = adminMapper.selectOne(qw);
            if (admin != null) {
                Map<String, Object> data = new HashMap<>();
                data.put("id", admin.getId());
                data.put("username", admin.getUsername());
                data.put("role", admin.getRole());
                data.put("token", "admin-token-" + admin.getId());
                return R.ok(data);
            }
        } else {
            QueryWrapper<Yonghu> qw = new QueryWrapper<>();
            qw.eq("zhanghao", username).eq("mima", password);
            Yonghu user = yonghuMapper.selectOne(qw);
            if (user != null) {
                Map<String, Object> data = new HashMap<>();
                data.put("id", user.getId());
                data.put("zhanghao", user.getZhanghao());
                data.put("xingming", user.getXingming());
                data.put("role", "用户");
                data.put("token", "user-token-" + user.getId());
                return R.ok(data);
            }
        }
        return R.error("账号或密码错误");
    }

    @PostMapping("/register")
    public R register(@RequestBody Map<String, String> body) {
        String zhanghao = body.get("zhanghao");
        String mima = body.get("mima");
        String xingming = body.get("xingming");

        QueryWrapper<Yonghu> qw = new QueryWrapper<>();
        qw.eq("zhanghao", zhanghao);
        if (yonghuMapper.selectCount(qw) > 0) {
            return R.error("账号已存在");
        }
        Yonghu user = new Yonghu();
        user.setZhanghao(zhanghao);
        user.setMima(mima);
        user.setXingming(xingming);
        user.setJifen(0);
        yonghuMapper.insert(user);

        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        R r = R.ok(data);
        r.setMsg("注册成功");
        return r;
    }

    @GetMapping("/leaderboard")
    public R leaderboard() {
        QueryWrapper<Yonghu> qw = new QueryWrapper<>();
        qw.select("id", "xingming", "zhaopian", "jifen")
           .orderByDesc("jifen")
           .last("LIMIT 20");
        List<Yonghu> list = yonghuMapper.selectList(qw);
        return R.ok(list);
    }
}
