package com.habit.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.habit.common.R;
import com.habit.entity.Yonghu;
import com.habit.mapper.YonghuMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/yonghu")
public class YonghuController {

    @Autowired
    private YonghuMapper yonghuMapper;

    @GetMapping("/list")
    public R list(@RequestParam(defaultValue = "1") int page,
                  @RequestParam(defaultValue = "10") int limit,
                  @RequestParam(required = false) String zhanghao,
                  @RequestParam(required = false) String xingming) {
        QueryWrapper<Yonghu> qw = new QueryWrapper<>();
        if (StringUtils.hasText(zhanghao)) qw.like("zhanghao", zhanghao);
        if (StringUtils.hasText(xingming)) qw.like("xingming", xingming);
        qw.orderByDesc("id");
        Page<Yonghu> p = yonghuMapper.selectPage(new Page<>(page, limit), qw);
        return R.page(p.getRecords(), p.getTotal());
    }

    @GetMapping("/info/{id}")
    public R info(@PathVariable Long id) {
        return R.ok(yonghuMapper.selectById(id));
    }

    @PostMapping("/add")
    public R add(@RequestBody Yonghu yonghu) {
        QueryWrapper<Yonghu> qw = new QueryWrapper<>();
        qw.eq("zhanghao", yonghu.getZhanghao());
        if (yonghuMapper.selectCount(qw) > 0) {
            return R.error("账号已存在");
        }
        if (yonghu.getJifen() == null) yonghu.setJifen(0);
        yonghuMapper.insert(yonghu);
        return R.ok(yonghu);
    }

    @PutMapping("/update/{id}")
    public R update(@PathVariable Long id, @RequestBody Yonghu yonghu) {
        yonghu.setId(id);
        yonghuMapper.updateById(yonghu);
        return R.ok("修改成功");
    }

    @DeleteMapping("/delete/{id}")
    public R delete(@PathVariable Long id) {
        yonghuMapper.deleteById(id);
        return R.ok("删除成功");
    }

    @PutMapping("/updateJifen/{id}")
    public R updateJifen(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Integer jifen = body.get("jifen");
        yonghuMapper.addJifen(id, jifen);
        return R.ok("积分更新成功");
    }
}
