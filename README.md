# AI 英语学习多 Agent 系统

这是一个可部署到 GitHub Pages 的静态网页项目，用于展示英语学习多 Agent 协同流程。

## 核心能力

- 用户分析 Agent：解析英语水平、目标国家、学习周期、每日时长和薄弱点。
- 学习规划 Agent：生成 7 天或 30 天动态学习计划，覆盖口语、听力、词汇、语法。
- 口语对话 Agent：生成日常交流、面试问答、出国场景，并提供中英文对照和引导式回复。
- 反馈评估 Agent：根据打卡和输入内容生成阶段评估，并调整后续学习建议。

## 技术流程

用户输入 -> 多 Agent 分析 -> AI 生成结构化 JSON -> 转换为 Markdown 页面 -> 自动提交至 GitHub -> GitHub Actions 持续部署。

## 本地预览

直接用浏览器打开 `index.html` 即可。

## GitHub Pages 部署

1. 创建 GitHub 仓库并上传本项目全部文件。
2. 进入仓库 Settings -> Pages。
3. Source 选择 GitHub Actions。
4. 推送到 `main` 分支后，等待 workflow 完成。

部署成功后，访问：

```text
https://你的用户名.github.io/仓库名/
```

## 后续扩展

- 接入真实 AI API。
- 增加语音输入和口语评分。
- 增加打卡记录和学习历史。
- 增加登录与云端数据保存。
- 使用 Codex 持续提交功能更新和 PR。
