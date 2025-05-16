# EasyDB

[![Docker Pulls](https://img.shields.io/docker/pulls/shencangsheng/easydb.svg)](https://hub.docker.com/r/shencangsheng/easydb)

简体中文 | [English](./README.en-us.md)

“开箱即用”，使用 `SQL` 驱动 `CSV`、`JSON`、`Parquet` 文件，底层采用了由 Rust 编写的高性能可扩展查询引擎 `DataFusion`。

## 📖 功能

- SQL 访问 CSV、JSON 文件

## 🔮 路线

- [ ] 优化异常提示
- [ ] 根据路径自动识别表
- [ ] 自动生成 table schema
- [ ] 支持输出更多数据类型
- [x] 支持 `select * from '/path/example.csv'` 直接访问本地文件，不需要提前 `create table`
- [ ] 支持 s3 远程文件
- [ ] 支持多路径

## 尝试

```bash
git clone git@github.com:shencangsheng/easy_db.git
docker compose up -d
# http://127.0.0.1:8088
```

## 👍 依赖库

这些开源库用于创建本项目。

- [apache/datafusion](https://github.com/apache/datafusion)

## 📝 许可证

A short snippet describing the license (MIT)

MIT © Cangsheng Shen
