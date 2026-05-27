package com.habit.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.util.Date;

@Data
@TableName("liuyanban")
public class Liuyanban {
    @TableId(type = IdType.AUTO)
    private Long id;
    @TableField(fill = FieldFill.INSERT)
    private Date addtime;
    private Long userid;
    private String username;
    private String content;
    private String reply;
}
