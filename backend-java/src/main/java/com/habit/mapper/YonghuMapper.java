package com.habit.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.habit.entity.Yonghu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface YonghuMapper extends BaseMapper<Yonghu> {
    @Update("UPDATE yonghu SET jifen = jifen + #{jifen} WHERE id = #{id}")
    int addJifen(Long id, Integer jifen);
}
