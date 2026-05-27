package com.habit.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.habit.common.R;
import com.habit.entity.Jihualishibiao;
import com.habit.mapper.JihualishibiaoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jihualishibiao")
public class JihualishibiaoController {

    @Autowired
    private JihualishibiaoMapper jihualishibiaoMapper;

    @GetMapping("/list")
    public R list(@RequestParam(defaultValue = "1") int page,
                  @RequestParam(defaultValue = "10") int limit,
                  @RequestParam(required = false) String jihuabiaoti,
                  @RequestParam(required = false) Long userid,
                  @RequestParam(required = false) String zhanghao) {
        QueryWrapper<Jihualishibiao> qw = new QueryWrapper<>();
        if (StringUtils.hasText(jihuabiaoti)) qw.like("jihuabiaoti", jihuabiaoti);
        if (userid != null) qw.eq("userid", userid);
        if (StringUtils.hasText(zhanghao)) qw.eq("zhanghao", zhanghao);
        qw.orderByDesc("id");
        Page<Jihualishibiao> p = jihualishibiaoMapper.selectPage(new Page<>(page, limit), qw);
        return R.page(p.getRecords(), p.getTotal());
    }

    @GetMapping("/info/{id}")
    public R info(@PathVariable Long id) {
        return R.ok(jihualishibiaoMapper.selectById(id));
    }

    @PostMapping("/add")
    public R add(@RequestBody Jihualishibiao entity) {
        entity.setKaishiriqi(toDateOnly(entity.getKaishiriqi()));
        entity.setJieshushijian(toDateOnly(entity.getJieshushijian()));
        entity.setWanchengriqi(toDateOnly(entity.getWanchengriqi()));
        jihualishibiaoMapper.insert(entity);
        return R.ok(entity);
    }

    @DeleteMapping("/delete/{id}")
    public R delete(@PathVariable Long id) {
        jihualishibiaoMapper.deleteById(id);
        return R.ok("删除成功");
    }

    private String toDateOnly(String dateStr) {
        if (dateStr != null && dateStr.length() > 10) {
            return dateStr.substring(0, 10);
        }
        return dateStr;
    }
}
