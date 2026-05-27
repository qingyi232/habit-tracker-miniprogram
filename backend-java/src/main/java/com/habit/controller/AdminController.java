package com.habit.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.habit.common.R;
import com.habit.entity.Admin;
import com.habit.mapper.AdminMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminMapper adminMapper;

    @GetMapping("/list")
    public R list(@RequestParam(defaultValue = "1") int page,
                  @RequestParam(defaultValue = "10") int limit,
                  @RequestParam(required = false) String username) {
        QueryWrapper<Admin> qw = new QueryWrapper<>();
        if (StringUtils.hasText(username)) {
            qw.like("username", username);
        }
        qw.orderByDesc("id");
        Page<Admin> p = adminMapper.selectPage(new Page<>(page, limit), qw);
        return R.page(p.getRecords(), p.getTotal());
    }

    @GetMapping("/info/{id}")
    public R info(@PathVariable Long id) {
        return R.ok(adminMapper.selectById(id));
    }

    @PostMapping("/add")
    public R add(@RequestBody Admin admin) {
        adminMapper.insert(admin);
        return R.ok(admin);
    }

    @PutMapping("/update/{id}")
    public R update(@PathVariable Long id, @RequestBody Admin admin) {
        admin.setId(id);
        adminMapper.updateById(admin);
        return R.ok("修改成功");
    }

    @DeleteMapping("/delete/{id}")
    public R delete(@PathVariable Long id) {
        adminMapper.deleteById(id);
        return R.ok("删除成功");
    }
}
