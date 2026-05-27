package com.habit.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.util.Date;

@Data
@TableName("jihualishibiao")
public class Jihualishibiao {
    @TableId(type = IdType.AUTO)
    private Long id;
    @TableField(fill = FieldFill.INSERT)
    private Date addtime;
    private String jihuabiaoti;
    private String jihuatupian;
    private String kaishiriqi;
    private String jihuaneirong;
    private String jieshushijian;
    private Integer jihuatianshu;
    private String wanchengdu;
    private String wanchengriqi;
    private String zhanghao;
    private String xingming;
    private Long userid;
}
