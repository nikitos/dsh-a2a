#!/usr/bin/env python3
"""Translate @hanphone/dsh-a2a GUI strings zh->EN in place (with .orig backup).
Usage: python3 patch-en.py <dir-with-lib>   # e.g. ~/.dsh/profiles/web/node_modules/@hanphone/dsh-a2a
Re-run after every plugin update. Originals are kept as *.orig."""
import os, sys, shutil

PAIRS = [
    # ---- client.js (browser panel) ----
    ('" 允许 trace 扩展（工具名/脱敏摘要，默认关闭）"', '"  Allow trace extension (tool names/redacted summaries, off by default)"'),
    ('"A2A 连接"', '"A2A Connections"'),
    ('"Bearer Token（可选）"', '"Bearer Token (optional)"'),
    ('"Bearer Token（留空不改，填写则更新）"', '"Bearer Token (leave empty to keep, type to update)"'),
    ('"contextId（可选）"', '"contextId (optional)"'),
    (r'"per-skill 覆盖 JSON，如 {\"chat\":{\"description\":\"...\"}}"', r'"per-skill override JSON, e.g. {\"chat\":{\"description\":\"...\"}}"'),
    ('"· 匿名"', '"· anonymous"'),
    ('"· 已配置鉴权"', '"· auth configured"'),
    ('"事件"', '"Events"'),
    ('"任务"', '"Tasks"'),
    ('"会话"', '"Sessions"'),
    ('"保存修改"', '"Save changes"'),
    ('"保存将应用名称/Preset/超时与 Token 修改，并重建连接。"', '"Saving applies name/preset/timeout and token changes and rebuilds the connection."'),
    ('"停用"', '"Disable"'),
    ('"入站 Servers"', '"Inbound Servers"'),
    ('"入站会话（按 contextId）"', '"Inbound sessions (by contextId)"'),
    ('"入站连接（谁在调用本服务）"', '"Inbound connections (who calls this service)"'),
    ('"全部状态"', '"All states"'),
    ('"关闭"', '"Close"'),
    ('"内置测试控制台"', '"Built-in test console"'),
    ('"出站 Servers"', '"Outbound Servers"'),
    ('"创建 Server"', '"Create Server"'),
    ('"删除"', '"Delete"'),
    ('"刷新"', '"Refresh"'),
    ('"加载更多"', '"Load more"'),
    ('"发送"', '"Send"'),
    ('"发送一条测试消息"', '"Send a test message"'),
    ('"取消"', '"Cancel"'),
    ('"取消活跃"', '"Cancel active"'),
    ('"名称"', '"Name"'),
    ('"启用"', '"Enable"'),
    ('"复制不了，请手动选中命令"', '"Copy failed — select the command manually"'),
    ('"复制命令"', '"Copy command"'),
    ('"实例 / 任务"', '"Instances / tasks"'),
    ('"实例"', '"Instances"'),
    ('"对话"', '"Conversation"'),
    ('"导入"', '"Import"'),
    ('"已配置鉴权。"', '"Auth configured."'),
    ('"打开仓库"', '"Open repository"'),
    ('"技能"', '"Skills"'),
    ('"技能由所绑 preset 自动派生（一切皆插件）；Bearer Token 可留空（匿名）。"', '"Skills are derived automatically from the bound preset (everything is a plugin); the Bearer Token may stay empty (anonymous)."'),
    ('"技能（勾选启用）"', '"Skills (check to enable)"'),
    ('"指标"', '"Metrics"'),
    ('"描述"', '"Description"'),
    ('"操作"', '"Actions"'),
    ('"新建入站 Server"', '"New inbound Server"'),
    ('"时间"', '"Time"'),
    ('"暂无任务。"', '"No tasks yet."'),
    ('"暂无会话。其他 A2A 客户端带 contextId 调用本服务后，这里会出现一条会话记录。"', '"No sessions yet. Other A2A clients calling this service with a contextId will appear here."'),
    ('"暂无入站连接。其他 A2A 客户端调用本 DSH 的端点后会显示在这里。"', '"No inbound connections yet. Calls from other A2A clients to this DSH endpoint will appear here."'),
    ('"暂无指标。"', '"No metrics."'),
    ('"更新命令已复制"', '"Update command copied"'),
    ('"来源"', '"Source"'),
    ('"检查中…"', '"Checking…"'),
    ('"检查更新"', '"Check for update"'),
    ('"正在检查更新…"', '"Checking for updates…"'),
    ('"每 3 秒自动刷新。"', '"Auto-refreshes every 3 seconds."'),
    ('"流式"', '"Streaming"'),
    ('"测试"', '"Test"'),
    ('"添加出站 Server"', '"Add outbound Server"'),
    ('"清除鉴权"', '"Clear auth"'),
    ('"版本"', '"Version"'),
    ('"状态"', '"State"'),
    ('"管理本 DSH 的 A2A 连接：入站 server 把 DSH 作为 Agent 发布（每个绑定一个 agent preset，技能自动派生）；出站 server 连接并调用远程 A2A Agent。"', '"Manage this DSH\'s A2A connections: inbound servers publish DSH as an Agent (each bound to one agent preset, skills derived automatically); outbound servers connect to and call remote A2A Agents."'),
    ('"编辑"', '"Edit"'),
    ('"编辑入站 Server"', '"Edit inbound Server"'),
    ('"编辑出站 Server"', '"Edit outbound Server"'),
    ('"详情"', '"Details"'),
    ('"读取中…"', '"Reading…"'),
    ('"超时 ms"', '"Timeout ms"'),
    ('"输入远端 AgentCard URL 并点击「导入」，将读取其名称、描述、技能与端点；确认后建立连接。"', '"Enter a remote AgentCard URL and click Import to read its name, description, skills and endpoints; the connection is created after you confirm."'),
    ('"还没有入站 server。创建一个即可对外发布 A2A 端点。"', '"No inbound server yet. Create one to publish an A2A endpoint."'),
    ('"还没有出站 server。添加一个远端 A2A 连接即可把其技能注册为模型工具。"', '"No outbound server yet. Add a remote A2A connection to register its skills as model tools."'),
    ('"远端 AgentCard URL"', '"Remote AgentCard URL"'),
    ('"连接"', '"Connect"'),
    ('"首次 / 最近"', '"first / last"'),
    ('` ${s.status === "running" ? "运行中" : "空闲"}`', '` ${s.status === "running" ? "running" : "idle"}`'),
    ('`${p.taskCount}（活跃 ${p.activeTaskIds.length}）`', '`${p.taskCount} (active ${p.activeTaskIds.length})`'),
    ('`${s.taskCount}（活跃 ${s.activeCount}）`', '`${s.taskCount} (active ${s.activeCount})`'),
    ('`Skills（${discovered.skills.length}）`', '`Skills (${discovered.skills.length})`'),
    ('`· ${v.state} · 工具 ${v.toolCount}/${v.skillCount}`', '`· ${v.state} · tools ${v.toolCount}/${v.skillCount}`'),
    ('`任务 ${metrics.tasks.created}（完成 ${metrics.tasks.completed} / 失败 ${metrics.tasks.failed} / 取消 ${metrics.tasks.canceled} / 中断 ${metrics.tasks.interrupted}）`', '`Tasks ${metrics.tasks.created} (done ${metrics.tasks.completed} / failed ${metrics.tasks.failed} / canceled ${metrics.tasks.canceled} / interrupted ${metrics.tasks.interrupted})`'),
    ('`会话对话（${conversationKey}）`', '`Session conversation (${conversationKey})`'),
    ('`入站 Servers（${inbounds.length}）`', '`Inbound Servers (${inbounds.length})`'),
    ('`共 ${snap?.taskTotal ?? tasks.length} 条，显示 ${tasks.length}`', '`${snap?.taskTotal ?? tasks.length} total, showing ${tasks.length}`'),
    ('`出站 ${metrics.outbound.calls}（错误 ${metrics.outbound.errors}，平均 ${metrics.outbound.avgDurationMs}ms）`', '`Outbound ${metrics.outbound.calls} (errors ${metrics.outbound.errors}, avg ${metrics.outbound.avgDurationMs}ms)`'),
    ('`出站 Servers（${outbounds.length}）`', '`Outbound Servers (${outbounds.length})`'),
    ('`加载失败：${error}`', '`Load failed: ${error}`'),
    ('`发现新版本 v${update.latest ?? ""}（当前 v${update.current}，来源 ${update.source ?? "未知"}）。先卸旧版再装新版；直接安装可能拿到缓存里的旧副本。命令使用当前 profile（${profile}），装完重启一次 DSH。`', '`New version v${update.latest ?? ""} found (current v${update.current}, source ${update.source ?? "unknown"}). Remove the old version before installing the new one; installing directly may pick up a cached copy. The command uses the current profile (${profile}); restart DSH once after install.`'),
    ('`已是最新版（v${update.latest ?? ""}）`', '`Up to date (v${update.latest ?? ""})`'),
    ('`平均 ${metrics.tasks.avgDurationMs}ms · 最长 ${metrics.tasks.maxDurationMs}ms`', '`avg ${metrics.tasks.avgDurationMs}ms · max ${metrics.tasks.maxDurationMs}ms`'),
    ('`暂时查不到最新版本（${update.error ?? "网络"}）—— 这不代表没有问题`', '`Could not check the latest version (${update.error ?? "network"}) — this does not mean there is no issue`'),
    ('`有新版本 v${update.latest ?? ""}`', '`New version v${update.latest ?? ""} available`'),
    ('`本地版本比已发布版本新（${update.latest ?? ""}）`', '`Local version is newer than published (${update.latest ?? ""})`'),
    ('`检查更新失败：${error}`', '`Update check failed: ${error}`'),
    ('`端点 ${discovered.endpoint}`', '`Endpoint ${discovered.endpoint}`'),
    ('`请求 ${metrics.requests} · 鉴权失败 ${metrics.authFailures}`', '`Requests ${metrics.requests} · auth failures ${metrics.authFailures}`'),
    ('`连接与任务（${peers.length} 连接 · ${sessions.length} 会话）`', '`Connections & tasks (${peers.length} connections · ${sessions.length} sessions)`'),
    # ---- index.js (server-side update check errors) ----
    ('"响应里没有 version"', '"Response has no version"'),
    ('"没有可用的更新源"', '"No update source available"'),
    ('"读不到插件版本（package.json 缺少 version）"', '"Cannot read plugin version (package.json missing version)"'),
    ('`版本号无法解析：${version}`', '`Cannot parse version: ${version}`'),
]

CJK = __import__("re").compile(r"[一-鿿]")

def main():
    root = sys.argv[1] if len(sys.argv) > 1 else "."
    targets = [os.path.join(root, "lib", "client.js"), os.path.join(root, "lib", "index.js")]
    total = 0
    for path in targets:
        if not os.path.isfile(path):
            print(f"skip (missing): {path}"); continue
        orig = path + ".orig"
        if not os.path.exists(orig):
            shutil.copy2(path, orig)
            print(f"backup -> {orig}")
        src = open(orig, encoding="utf8").read()
        n = 0
        for old, new in PAIRS:
            c = src.count(old)
            if c:
                src = src.replace(old, new); n += c
        left = sum(1 for line in src.splitlines() if CJK.search(line))
        open(path, "w", encoding="utf8").write(src)
        print(f"{path}: {n} replacements, {left} CJK lines left (comments only)")
        total += n
    print(f"done: {total} replacements")

if __name__ == "__main__":
    main()
