package com.habit.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.habit.common.R;
import com.habit.entity.Jihuadaka;
import com.habit.mapper.JihuadakaMapper;
import com.habit.mapper.YonghuMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jihuadaka")
public class JihuadakaController {

    @Autowired
    private JihuadakaMapper jihuadakaMapper;
    @Autowired
    private YonghuMapper yonghuMapper;

    @GetMapping("/list")
    public R list(@RequestParam(defaultValue = "1") int page,
                  @RequestParam(defaultValue = "10") int limit,
                  @RequestParam(required = false) String jihuabiaoti,
                  @RequestParam(required = false) Long userid,
                  @RequestParam(required = false) String zhanghao,
                  @RequestParam(required = false) Long jihuaid) {
        QueryWrapper<Jihuadaka> qw = new QueryWrapper<>();
        if (StringUtils.hasText(jihuabiaoti)) qw.like("jihuabiaoti", jihuabiaoti);
        if (userid != null) qw.eq("userid", userid);
        if (StringUtils.hasText(zhanghao)) qw.eq("zhanghao", zhanghao);
        if (jihuaid != null) qw.eq("jihuaid", jihuaid);
        qw.orderByDesc("id");
        Page<Jihuadaka> p = jihuadakaMapper.selectPage(new Page<>(page, limit), qw);
        return R.page(p.getRecords(), p.getTotal());
    }

    @GetMapping("/info/{id}")
    public R info(@PathVariable Long id) {
        return R.ok(jihuadakaMapper.selectById(id));
    }

    @PostMapping("/add")
    public R add(@RequestBody Jihuadaka entity) {
        entity.setKaishiriqi(toDateOnly(entity.getKaishiriqi()));
        entity.setJieshushijian(toDateOnly(entity.getJieshushijian()));
        entity.setDakariqi(toDateOnly(entity.getDakariqi()));
        if (!StringUtils.hasText(entity.getWanchengdu())) {
            entity.setWanchengdu("未完成");
        }
        jihuadakaMapper.insert(entity);
        if (entity.getUserid() != null) {
            yonghuMapper.addJifen(entity.getUserid(), 10);
        }
        R r = R.ok(entity);
        r.setMsg("打卡成功，积分+10");
        return r;
    }

    @PutMapping("/update/{id}")
    public R update(@PathVariable Long id, @RequestBody Jihuadaka entity) {
        entity.setId(id);
        entity.setKaishiriqi(toDateOnly(entity.getKaishiriqi()));
        entity.setJieshushijian(toDateOnly(entity.getJieshushijian()));
        entity.setDakariqi(toDateOnly(entity.getDakariqi()));
        jihuadakaMapper.updateById(entity);
        return R.ok("修改成功");
    }

    @DeleteMapping("/delete/{id}")
    public R delete(@PathVariable Long id) {
        jihuadakaMapper.deleteById(id);
        return R.ok("删除成功");
    }

    private String toDateOnly(String dateStr) {
        if (dateStr != null && dateStr.length() > 10) {
            return dateStr.substring(0, 10);
        }
        return dateStr;
    }
}
