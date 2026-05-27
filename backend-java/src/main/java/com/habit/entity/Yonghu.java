package com.habit.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.util.Date;

@Data
@TableName("yonghu")
public class Yonghu {
    @TableId(type = IdType.AUTO)
    private Long id;
    @TableField(fill = FieldFill.INSERT)
    private Date addtime;
    private String zhanghao;
    private String mima;
    private String xingming;
    private String xingbie;
    private Integer nianling;
    private String shouji;
    private String youxiang;
    private String zhaopian;
    private Integer jifen;
}
