const state = {
  analysis: null,
  plan: [],
  markdown: "",
};

const sceneMap = {
  daily: [
    ["Agent", "Could you tell me what your usual morning looks like?", "你能说说你平常的早晨是什么样的吗？"],
    ["User", "I usually check my messages, make coffee, and review my plan for the day.", "我通常会看消息、煮咖啡，然后复盘当天计划。"],
    ["Guide", "Try adding one detail about time or feeling: I usually... because it helps me...", "尝试补充时间或感受细节。"],
  ],
  interview: [
    ["Agent", "Why do you want to study or work in this country?", "你为什么想去这个国家学习或工作？"],
    ["User", "I want to improve my professional communication and experience a more international environment.", "我想提升职业沟通能力，并体验更国际化的环境。"],
    ["Guide", "Use the STAR pattern: situation, task, action, result. Keep the answer under 45 seconds.", "使用 STAR 结构，把回答控制在 45 秒内。"],
  ],
  abroad: [
    ["Agent", "You missed your train connection. How would you ask for help?", "你错过了换乘列车，会如何求助？"],
    ["User", "Excuse me, I missed my connection. Could you help me find the next available train?", "不好意思，我错过了换乘。你能帮我查下一班车吗？"],
    ["Guide", "Add a polite request and confirm the platform or ticket rule before leaving.", "补充礼貌请求，并确认站台或票务规则。"],
  ],
};

const levelStage = {
  A1: "入门建立期",
  A2: "基础巩固期",
  B1: "表达扩展期",
  B2: "场景迁移期",
  C1: "高级精进期",
};

function analyzeUser() {
  const level = document.querySelector("#level").value;
  const country = document.querySelector("#country").value;
  const cycle = Number(document.querySelector("#cycle").value);
  const minutes = Number(document.querySelector("#minutes").value);
  const weakness = document.querySelector("#weakness").value.trim();
  const focus = [];

  if (/口语|表达|停顿/.test(weakness)) focus.push("口语流利度");
  if (/听力|连读|快速/.test(weakness)) focus.push("听力反应速度");
  if (/词汇|单词/.test(weakness)) focus.push("场景词汇");
  if (/语法|句型/.test(weakness)) focus.push("语法输出准确度");

  return {
    profile: { level, country, cycleDays: cycle, dailyMinutes: minutes },
    stage: levelStage[level],
    weakPoints: focus.length ? focus : ["综合表达稳定性"],
    agentDecision: {
      planDepth: cycle === 7 ? "短周期高频反馈" : "30 天螺旋式强化",
      timeStrategy: minutes < 45 ? "轻量任务包" : minutes > 90 ? "深度训练包" : "标准训练包",
      countryContext: `${country}生活、学习与面试沟通场景`,
    },
  };
}

function generatePlan(analysis) {
  const days = analysis.profile.cycleDays === 7 ? 7 : 30;
  const visibleDays = analysis.profile.cycleDays === 7 ? 7 : 10;
  const modules = [
    ["口语", "影子跟读 + 30 秒场景回答"],
    ["听力", "精听短音频 + 连读标注"],
    ["词汇", `${analysis.profile.country}高频生活/面试词块复盘`],
    ["语法", "用目标句型完成 4 句输出"],
  ];

  const plan = Array.from({ length: visibleDays }, (_, index) => {
    const day = index + 1;
    const module = modules[index % modules.length];
    return {
      day,
      title: day <= 2 ? "诊断与启动" : day <= 5 ? "场景强化" : day <= 7 ? "反馈校准" : "循环进阶",
      module: module[0],
      tasks: [
        module[1],
        `完成 ${analysis.profile.dailyMinutes} 分钟学习打卡`,
        `围绕 ${analysis.weakPoints[index % analysis.weakPoints.length]} 做一次自评`,
      ],
    };
  });

  if (days === 30) {
    plan.push({
      day: "11-30",
      title: "螺旋强化",
      module: "综合",
      tasks: ["每 5 天进行一次阶段评估", "根据薄弱点动态调整口语、听力、词汇、语法比例", "输出 3 篇 Markdown 学习总结"],
    });
  }

  return plan;
}

function toMarkdown(analysis, plan) {
  const tasks = plan
    .map((item) => {
      const list = item.tasks.map((task) => `  - ${task}`).join("\n");
      return `## Day ${item.day}: ${item.title}\n- 模块：${item.module}\n${list}`;
    })
    .join("\n\n");

  return `# ${analysis.profile.cycleDays} 天英语学习计划

- 英语水平：${analysis.profile.level}
- 目标国家：${analysis.profile.country}
- 学习阶段：${analysis.stage}
- 每日时长：${analysis.profile.dailyMinutes} 分钟
- 核心薄弱点：${analysis.weakPoints.join("、")}
- Agent 策略：${analysis.agentDecision.planDepth} / ${analysis.agentDecision.timeStrategy}

${tasks}

## 自动化闭环
用户输入 -> 多 Agent 分析 -> JSON 数据 -> Markdown 页面 -> GitHub Actions 部署
`;
}

function renderJson() {
  document.querySelector("#jsonOutput").textContent = JSON.stringify(
    {
      analysis: state.analysis,
      learningPlan: state.plan,
      markdownTarget: "learning-plan.md",
    },
    null,
    2,
  );
}

function renderPlan() {
  document.querySelector("#planGrid").innerHTML = state.plan
    .map(
      (item) => `
        <article class="day-card">
          <h3>Day ${item.day} · ${item.title}</h3>
          <ul>
            <li><strong>${item.module}</strong></li>
            ${item.tasks.map((task) => `<li>${task}</li>`).join("")}
          </ul>
        </article>
      `,
    )
    .join("");

  document.querySelector("#markdownPreview").textContent = state.markdown;
}

function renderDialogue() {
  const scene = document.querySelector("#scene").value;
  document.querySelector("#dialogueBox").innerHTML = sceneMap[scene]
    .map(
      ([role, en, zh]) => `
        <div class="message ${role === "Guide" ? "guide" : ""}">
          <strong>${role}</strong>
          <div>${en}</div>
          <small>${zh}</small>
        </div>
      `,
    )
    .join("");
}

function evaluateProgress() {
  const checks = [...document.querySelectorAll(".checkin")];
  const done = checks.filter((item) => item.checked).length;
  const rate = Math.round((done / checks.length) * 100);
  const reflection = document.querySelector("#reflection").value.trim();
  const suggestion =
    rate >= 75
      ? "完成度稳定，下一阶段可增加即兴追问和 60 秒连续表达。"
      : "建议降低单次任务量，把口语与听力拆成更短回合，并优先补齐未完成模块。";

  document.querySelector("#assessment").innerHTML = `
    <strong>阶段完成度：${rate}%</strong><br />
    ${suggestion}<br />
    反馈摘要：${reflection || "暂无输入，建议补充今日卡点。"}
  `;
}

function refreshAll() {
  state.analysis = analyzeUser();
  state.plan = generatePlan(state.analysis);
  state.markdown = toMarkdown(state.analysis, state.plan);
  renderJson();
  renderPlan();
  renderDialogue();
  evaluateProgress();
}

document.querySelector("#profileForm").addEventListener("submit", (event) => {
  event.preventDefault();
  refreshAll();
});

document.querySelector("#scene").addEventListener("change", renderDialogue);
document.querySelector("#evaluate").addEventListener("click", evaluateProgress);

document.querySelectorAll(".segmented button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".segmented button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelector("#planGrid").classList.toggle("hidden", button.dataset.view !== "plan");
    document.querySelector("#markdownPreview").classList.toggle("hidden", button.dataset.view !== "markdown");
  });
});

document.querySelector("#copyMarkdown").addEventListener("click", async () => {
  await navigator.clipboard.writeText(state.markdown);
  const button = document.querySelector("#copyMarkdown");
  button.textContent = "已复制 Markdown";
  setTimeout(() => {
    button.textContent = "复制 Markdown";
  }, 1800);
});

refreshAll();
