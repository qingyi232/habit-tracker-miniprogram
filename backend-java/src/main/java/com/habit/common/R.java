package com.habit.common;

import lombok.Data;
import java.util.HashMap;
import java.util.Map;

@Data
public class R {
    private int code;
    private String msg;
    private Object data;

    public static R ok() {
        R r = new R();
        r.setCode(0);
        r.setMsg("success");
        return r;
    }

    public static R ok(Object data) {
        R r = ok();
        r.setData(data);
        return r;
    }

    public static R ok(String msg) {
        R r = ok();
        r.setMsg(msg);
        return r;
    }

    public static R error(String msg) {
        R r = new R();
        r.setCode(-1);
        r.setMsg(msg);
        return r;
    }

    public static R page(java.util.List<?> list, long total) {
        Map<String, Object> map = new HashMap<>();
        map.put("list", list);
        map.put("total", total);
        R r = ok();
        r.setData(map);
        return r;
    }
}
