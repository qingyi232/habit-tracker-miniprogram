package com.habit.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.habit.common.R;
import com.habit.entity.Liuyanban;
import com.habit.mapper.LiuyanbanMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/liuyanban")
public class LiuyanbanController {

    @Autowired
    private LiuyanbanMapper liuyanbanMapper;

    @GetMapping("/list")
    public R list(@RequestParam(defaultValue = "1") int page,
                  @RequestParam(defaultValue = "10") int limit,
                  @RequestParam(required = false) Long userid) {
        QueryWrapper<Liuyanban> qw = new QueryWrapper<>();
        if (userid != null) qw.eq("userid", userid);
        qw.orderByDesc("id");
        Page<Liuyanban> p = liuyanbanMapper.selectPage(new Page<>(page, limit), qw);
        return R.page(p.getRecords(), p.getTotal());
    }

    @GetMapping("/info/{id}")
    public R info(@PathVariable Long id) {
        return R.ok(liuyanbanMapper.selectById(id));
    }

    @PostMapping("/add")
    public R add(@RequestBody Liuyanban entity) {
        liuyanbanMapper.insert(entity);
        return R.ok(entity);
    }

    @PutMapping("/reply/{id}")
    public R reply(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Liuyanban entity = new Liuyanban();
        entity.setId(id);
        entity.setReply(body.get("reply"));
        liuyanbanMapper.updateById(entity);
        return R.ok("回复成功");
    }

    @DeleteMapping("/delete/{id}")
    public R delete(@PathVariable Long id) {
        liuyanbanMapper.deleteById(id);
        return R.ok("删除成功");
    }
}
