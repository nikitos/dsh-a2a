window.__ModuleLoader__.load({
	id: "@hanphone/dsh-a2a",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		//#region src/client/dashboard.css.ts
		/**
		* A2A dashboard stylesheet — an idempotent `<style>` injector built entirely
		* on the product's `--dsw-alias-*` design tokens, so light/dark themes and
		* future token changes apply automatically, plus `@container` rules that
		* react to the settings drawer's own width (not the browser viewport).
		*
		* Class names are prefixed `dsh-a2a-` to avoid collisions with product or
		* third-party styles.
		* @module dsh-a2a/client/dashboard.css
		*/
		const DASHBOARD_CSS_ID = "@hanphone/dsh-a2a/dashboard.css";
		const css = String.raw`
		/* ── layout ─────────────────────────────────────────────── */
		.dsh-a2a-root { container-type: inline-size; container-name: a2a; }
		.dsh-a2a-section { display: flex; flex-direction: column; gap: 20px; }
		.dsh-a2a-stack { display: flex; flex-direction: column; gap: 16px; }
		.dsh-a2a-crew { display: flex; flex-direction: column; gap: 10px; }
		.dsh-a2a-card-list { display: flex; flex-direction: column; gap: 8px; }
		.dsh-a2a-btn-row { display: flex; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
		.dsh-a2a-intro { color: var(--dsw-alias-label-secondary, #61666b); font-size: 13px; line-height: 1.6; margin: 0; }
		.dsh-a2a-footer { color: var(--dsw-alias-label-tertiary, #81858c); font-size: 12px; margin-top: 4px; }
		.dsh-a2a-count { font-size: 12px; font-weight: 400; color: var(--dsw-alias-label-tertiary, #81858c); background: var(--dsw-alias-bg-layer-2, rgba(127,127,127,.1)); border-radius: 10px; padding: 1px 8px; }
		.dsh-a2a-mono { font-family: var(--ds-font-family-code, "SF Mono", "JetBrains Mono", "Fira Code", Consolas, "Liberation Mono", Menlo, Courier, "PingFang SC", "Microsoft YaHei"); }

		/* notice / error */
		.dsh-a2a-notice { padding: 8px 12px; border-radius: 8px; font-size: 13px; background: var(--dsw-alias-bg-layer-2, rgba(127,127,127,.08)); color: var(--dsw-alias-label-primary, #0f1115); }
		.dsh-a2a-error { color: var(--dsw-alias-state-error-primary, #d92d20); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d92d20) 9%, transparent); }

		/* empty state / hint */
		.dsh-a2a-empty { color: var(--dsw-alias-label-tertiary, #81858c); font-size: 13px; background: var(--dsw-alias-bg-layer-2, rgba(127,127,127,.06)); border-radius: 8px; padding: 12px 14px; }
		.dsh-a2a-hint { font-size: 11.5px; color: var(--dsw-alias-label-tertiary, #81858c); line-height: 1.6; }

		/* section titles */
		.dsh-a2a-h3 { margin: 0; font-size: 14px; font-weight: 600; color: var(--dsw-alias-label-primary, #0f1115); display: flex; align-items: center; gap: 8px; }

		/* tabs */
		.dsh-a2a-tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.3)); }
		.dsh-a2a-tab { padding: 6px 12px; font-size: 13px; background: none; border: none; border-bottom: 2px solid transparent; color: var(--dsw-alias-label-secondary, #61666b); cursor: pointer; }
		.dsh-a2a-tab[data-active='true'] { color: var(--dsw-alias-label-primary, #0f1115); border-bottom-color: var(--dsw-alias-brand-primary, #4a7dff); }
		.dsh-a2a-tab:hover:not([data-active='true']) { color: var(--dsw-alias-label-primary, #0f1115); }

		/* state dot */
		.dsh-a2a-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-label-tertiary, #81858c); flex: none; }
		.dsh-a2a-dot[data-state='connected'] { background: var(--dsw-alias-state-success-primary, #12b76a); }
		.dsh-a2a-dot[data-state='reconnecting'] { background: var(--dsw-alias-state-warn-primary, #f79009); }
		.dsh-a2a-dot[data-state='disabled'] { background: var(--dsw-alias-state-warn-primary, #f79009); }
		.dsh-a2a-dot[data-state='failed'] { background: var(--dsw-alias-state-error-primary, #d92d20); }

		/* buttons */
		.dsh-a2a-btn {
		  display: inline-flex; align-items: center; justify-content: center; gap: 4px;
		  margin-right: 6px; padding: 4px 12px; font-size: 12px; line-height: 18px;
		  border-radius: 8px; border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.3));
		  background: transparent; color: var(--dsw-alias-label-primary, #0f1115);
		  cursor: pointer; transition: background .15s, border-color .15s, color .15s, opacity .15s;
		}
		.dsh-a2a-btn:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.08)); border-color: var(--dsw-alias-border-l3, rgba(127,127,127,.45)); }
		.dsh-a2a-btn:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary, #4a7dff); outline-offset: 1px; }
		.dsh-a2a-btn:disabled { opacity: .5; cursor: default; }
		.dsh-a2a-btn:last-child { margin-right: 0; }
		.dsh-a2a-btn-primary { background: var(--dsw-alias-button-primary-fill, var(--dsw-alias-brand-primary, #4a7dff)); border-color: transparent; color: #fff; }

		/* forms */
		.dsh-a2a-form { display: flex; gap: 8px; margin: 8px 0; flex-wrap: wrap; align-items: center; }
		.dsh-a2a-input, .dsh-a2a-select {
		  padding: 5px 10px; font-size: 13px; border-radius: 8px;
		  border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.3));
		  background: transparent; color: var(--dsw-alias-label-primary, #0f1115);
		  transition: border-color .15s;
		}
		.dsh-a2a-input:focus, .dsh-a2a-select:focus { outline: none; border-color: var(--dsw-alias-brand-primary, #4a7dff); }
		.dsh-a2a-input:disabled, .dsh-a2a-select:disabled { opacity: .5; }

		/* cards */
		.dsh-a2a-card { border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.3)); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 6px; }
		.dsh-a2a-card-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
		.dsh-a2a-card-name { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary, #0f1115); }
		.dsh-a2a-card-sub { font-size: 12px; color: var(--dsw-alias-label-tertiary, #81858c); word-break: break-all; }
		.dsh-a2a-badge { font-size: 11px; padding: 1px 8px; border-radius: 10px; background: var(--dsw-alias-bg-layer-2, rgba(127,127,127,.1)); color: var(--dsw-alias-label-secondary, #61666b); }
		.dsh-a2a-skill { display: inline-block; margin: 1px 4px 1px 0; padding: 0 8px; border-radius: 10px; background: var(--dsw-alias-bg-layer-2, rgba(127,127,127,.12)); color: var(--dsw-alias-label-secondary, #61666b); font-size: 12px; }

		/* preview (two-phase add) */
		.dsh-a2a-preview { border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.3)); border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
		.dsh-a2a-preview-head { display: flex; align-items: center; gap: 8px; }
		.dsh-a2a-preview-name { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary, #0f1115); }
		.dsh-a2a-preview-desc { font-size: 12px; color: var(--dsw-alias-label-secondary, #61666b); line-height: 1.6; }
		.dsh-a2a-preview-meta { font-size: 12px; color: var(--dsw-alias-label-tertiary, #81858c); }
		.dsh-a2a-skill-list { display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: var(--dsw-alias-label-secondary, #61666b); }
		.dsh-a2a-skill-list-title { font-size: 12px; color: var(--dsw-alias-label-tertiary, #81858c); }
		.dsh-a2a-skill-toggle { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--dsw-alias-label-secondary, #61666b); }
		.dsh-a2a-metrics { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--dsw-alias-label-secondary, #61666b); }
		.dsh-a2a-detail { max-height: 320px; overflow: auto; margin: 8px 0 0; padding: 10px 12px; border-radius: 8px; background: var(--dsw-alias-bg-layer-2, rgba(127,127,127,.08)); color: var(--dsw-alias-label-primary, #0f1115); font-size: 12px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
		.dsh-a2a-link { background: none; border: none; padding: 0; color: var(--dsw-alias-brand-primary, #4a7dff); cursor: pointer; font-size: 12px; text-align: left; }
		.dsh-a2a-link:hover { text-decoration: underline; }

		/* tables */
		.dsh-a2a-table-wrap { overflow-x: auto; border-radius: 10px; border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.3)); }
		.dsh-a2a-table { width: 100%; border-collapse: collapse; font-size: 13px; }
		.dsh-a2a-table th { text-align: left; padding: 8px 10px; color: var(--dsw-alias-label-tertiary, #81858c); font-weight: 500; border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.3)); white-space: nowrap; }
		.dsh-a2a-table td { padding: 8px 10px; border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(127,127,127,.12)); vertical-align: top; }
		.dsh-a2a-table tr:last-child td { border-bottom: none; }

		/* auth state */
		.dsh-a2a-auth { font-size: 12px; color: var(--dsw-alias-label-tertiary, #81858c); }

		/* version / update strip */
		.dsh-a2a-verbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; padding: 10px 14px; border-radius: 10px; background: var(--dsw-alias-bg-layer-2, rgba(127,127,127,.07)); border: 1px solid var(--dsw-alias-border-l1, rgba(127,127,127,.16)); }
		.dsh-a2a-verbar-main { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; min-width: 0; }
		.dsh-a2a-verbar-side { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
		.dsh-a2a-verbar-name { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary, #0f1115); }
		.dsh-a2a-verbar-version { font-size: 12px; color: var(--dsw-alias-label-secondary, #61666b); }
		.dsh-a2a-verbar-status { font-size: 12px; color: var(--dsw-alias-label-tertiary, #81858c); }
		.dsh-a2a-verbar-status[data-tone='ok'] { color: var(--dsw-alias-state-success-primary, #12b76a); }
		.dsh-a2a-verbar-status[data-tone='update'] { color: var(--dsw-alias-brand-primary, #4a7dff); font-weight: 600; }
		.dsh-a2a-verbar-status[data-tone='unknown'] { color: var(--dsw-alias-state-warn-primary, #f79009); }
		.dsh-a2a-verbar-runtime { font-size: 11.5px; color: var(--dsw-alias-label-tertiary, #81858c); }
		.dsh-a2a-update-detail { display: flex; flex-direction: column; gap: 8px; padding: 10px 14px; border-radius: 10px; background: color-mix(in srgb, var(--dsw-alias-brand-primary, #4a7dff) 7%, transparent); border: 1px solid color-mix(in srgb, var(--dsw-alias-brand-primary, #4a7dff) 28%, transparent); }
		.dsh-a2a-command { margin: 0; padding: 8px 10px; border-radius: 8px; background: var(--dsw-alias-bg-layer-2, rgba(127,127,127,.1)); color: var(--dsw-alias-label-primary, #0f1115); font-size: 11.5px; line-height: 1.6; white-space: pre-wrap; word-break: break-all; }

		/* narrow drawer */
		@container a2a (max-width: 460px) {
		  .dsh-a2a-form { flex-direction: column; align-items: stretch; }
		  .dsh-a2a-card-head { flex-direction: column; align-items: flex-start; }
		  .dsh-a2a-verbar { align-items: flex-start; }
		  .dsh-a2a-verbar-side { width: 100%; }
		}
		`;
		/** Inject the dashboard stylesheet once; the returned disposer removes it. */
		function injectDashboardStyles() {
			let tag = document.getElementById(DASHBOARD_CSS_ID);
			if (tag === null) {
				tag = document.createElement("style");
				tag.id = DASHBOARD_CSS_ID;
				tag.dataset.plugin = "a2a";
				tag.dataset.pluginCss = `a2a/dashboard`;
				tag.textContent = css;
				document.head.appendChild(tag);
			}
			let removed = false;
			return () => {
				if (removed) return;
				removed = true;
				tag?.remove();
			};
		}
		//#endregion
		//#region src/client/update-status.ts
		/** Human-readable status; a failed lookup never reads as "up to date". */
		function updateStatusText(update, error) {
			if (error !== void 0) return `Update check failed: ${error}`;
			if (update === void 0) return "Checking for updates…";
			if (update.hasUpdate) return `New version v${update.latest ?? ""} available`;
			if (!update.ok) return `Cannot fetch the latest version right now (${update.error ?? "network"}) — this does not mean everything is fine`;
			if (update.ahead) return `Local version is newer than the published one (${update.latest ?? ""})`;
			return `Up to date (v${update.latest ?? ""})`;
		}
		/** Tone paired with {@link updateStatusText}. */
		function updateToneOf(update, error) {
			if (error !== void 0) return "unknown";
			if (update === void 0) return "pending";
			if (update.hasUpdate) return "update";
			return update.ok ? "ok" : "unknown";
		}
		/**
		* Two-step update command for the given profile (`remove`, then `add`).
		* A missing or malformed profile falls back to `web`; the value is only
		* displayed and copied, never executed.
		*/
		function updateCommandFor(profile) {
			const candidate = profile ?? "";
			const name = /^[A-Za-z0-9._-]+$/.test(candidate) ? candidate : "web";
			return [`dsh plugin --profile ${name} remove @hanphone/dsh-a2a`, `dsh plugin --profile ${name} add @hanphone/dsh-a2a`].join("\n");
		}
		//#endregion
		//#region src/client/index.ts
		/** Services this plugin needs from the client runtime. */
		const inject = ["slots"];
		const NS = "a2a";
		function apply(ctx) {
			ctx.effect(() => injectDashboardStyles(), `${NS}: dashboard styles`);
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "a2a",
				order: 90,
				label: () => "A2A Connections",
				inject: () => ({})
			}, A2aSection));
		}
		async function fetchSnapshot(query = {}) {
			const params = new URLSearchParams();
			if (query.taskLimit !== void 0) params.set("taskLimit", String(query.taskLimit));
			if (query.taskOffset !== void 0) params.set("taskOffset", String(query.taskOffset));
			if (query.taskState !== void 0 && query.taskState.length > 0) params.set("taskState", query.taskState);
			const suffix = params.size > 0 ? `?${params.toString()}` : "";
			const res = await fetch(`/a2a/api${suffix}`, { headers: { accept: "application/json" } });
			if (!res.ok) throw new Error(`snapshot HTTP ${res.status}`);
			return await res.json();
		}
		async function fetchJson(path) {
			const res = await fetch(path, { headers: { accept: "application/json" } });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return await res.json();
		}
		async function fetchPresets() {
			const res = await fetch("/a2a/api/presets", { headers: { accept: "application/json" } });
			if (!res.ok) return [];
			return await res.json();
		}
		async function fetchUpdate(force = false) {
			const res = await fetch(`/a2a/api/update${force ? "?refresh=1" : ""}`, { headers: { accept: "application/json" } });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return await res.json();
		}
		async function postControl(payload) {
			const res = await fetch("/a2a/api", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(payload)
			});
			return await res.json().catch(() => ({
				ok: false,
				message: `HTTP ${res.status}`
			}));
		}
		function dotState(state) {
			if (state === "connected") return "connected";
			if (state === "reconnecting" || state === "disabled") return "disabled";
			if (state === "failed") return "failed";
			return "connected";
		}
		function presetLabel(presets, id) {
			if (id === void 0) return "—";
			return presets.find((p) => p.id === id)?.name ?? id;
		}
		function A2aSection(_props) {
			const [snap, setSnap] = (0, react.useState)(void 0);
			const [presets, setPresets] = (0, react.useState)([]);
			const [error, setError] = (0, react.useState)(void 0);
			const [notice, setNotice] = (0, react.useState)(void 0);
			const [busy, setBusy] = (0, react.useState)(false);
			const [update, setUpdate] = (0, react.useState)(void 0);
			const [updateBusy, setUpdateBusy] = (0, react.useState)(false);
			const [updateError, setUpdateError] = (0, react.useState)(void 0);
			const [tab, setTab] = (0, react.useState)("inbound");
			const [taskFilter, setTaskFilter] = (0, react.useState)("");
			const [taskLimit, setTaskLimit] = (0, react.useState)(50);
			const [selectedTask, setSelectedTask] = (0, react.useState)(void 0);
			const [cardView, setCardView] = (0, react.useState)(void 0);
			const [conversation, setConversation] = (0, react.useState)(void 0);
			const [conversationKey, setConversationKey] = (0, react.useState)("");
			const [testInbound, setTestInbound] = (0, react.useState)("");
			const [testContext, setTestContext] = (0, react.useState)("");
			const [testSkill, setTestSkill] = (0, react.useState)("chat");
			const [testText, setTestText] = (0, react.useState)("");
			const [testResult, setTestResult] = (0, react.useState)(void 0);
			const [editingIn, setEditingIn] = (0, react.useState)(null);
			const [inName, setInName] = (0, react.useState)("");
			const [inDesc, setInDesc] = (0, react.useState)("");
			const [inVersion, setInVersion] = (0, react.useState)("1.0.0");
			const [inPreset, setInPreset] = (0, react.useState)("");
			const [inToken, setInToken] = (0, react.useState)("");
			const [inClearAuth, setInClearAuth] = (0, react.useState)(false);
			const [inTrace, setInTrace] = (0, react.useState)(false);
			const [editingOut, setEditingOut] = (0, react.useState)(null);
			const [outName, setOutName] = (0, react.useState)("");
			const [outUrl, setOutUrl] = (0, react.useState)("");
			const [outPreset, setOutPreset] = (0, react.useState)("");
			const [outTimeout, setOutTimeout] = (0, react.useState)("60000");
			const [outToken, setOutToken] = (0, react.useState)("");
			const [discovered, setDiscovered] = (0, react.useState)(null);
			const [discovering, setDiscovering] = (0, react.useState)(false);
			const [outDisabledSkills, setOutDisabledSkills] = (0, react.useState)([]);
			const [outSkillOverrides, setOutSkillOverrides] = (0, react.useState)("{}");
			(0, react.useEffect)(() => {
				let alive = true;
				const tick = async () => {
					try {
						const [next, presetRows] = await Promise.all([fetchSnapshot({
							taskLimit,
							...taskFilter !== "" ? { taskState: taskFilter } : {}
						}), fetchPresets()]);
						if (alive) {
							setSnap(next);
							setPresets(presetRows);
							const def = presetRows.find((p) => p.isDefault)?.id;
							setInPreset((current) => current === "" && def !== void 0 ? def : current);
							setOutPreset((current) => current === "" && def !== void 0 ? def : current);
							setTestInbound((current) => current === "" ? next.inbounds[0]?.id ?? "" : current);
							setTestSkill((current) => current === "" ? next.inbounds[0]?.skills[0]?.id ?? "chat" : current);
							setError(void 0);
						}
					} catch (err) {
						if (alive) setError(err.message);
					}
				};
				tick();
				const timer = setInterval(() => void tick(), 3e3);
				return () => {
					alive = false;
					clearInterval(timer);
				};
			}, [taskFilter, taskLimit]);
			(0, react.useEffect)(() => {
				let alive = true;
				fetchUpdate().then((info) => {
					if (alive) setUpdate(info);
				}).catch((err) => {
					if (alive) setUpdateError(err.message);
				});
				return () => {
					alive = false;
				};
			}, []);
			const checkUpdate = async () => {
				if (updateBusy) return;
				setUpdateBusy(true);
				setUpdateError(void 0);
				try {
					setUpdate(await fetchUpdate(true));
				} catch (err) {
					setUpdateError(err.message);
				} finally {
					setUpdateBusy(false);
				}
			};
			const control = async (payload) => {
				setBusy(true);
				try {
					const result = await postControl(payload);
					if (!result.ok) setError(result.message);
					else setNotice(result.message);
					setSnap(await fetchSnapshot({
						taskLimit,
						...taskFilter !== "" ? { taskState: taskFilter } : {}
					}));
					return result;
				} catch (err) {
					setError(err.message);
					return {
						ok: false,
						message: err.message
					};
				} finally {
					setBusy(false);
				}
			};
			const openTask = async (id) => {
				try {
					setSelectedTask(await fetchJson(`/a2a/api/task?id=${encodeURIComponent(id)}`));
				} catch (err) {
					setError(err.message);
				}
			};
			const openCard = async (id) => {
				try {
					setCardView(await fetchJson(`/a2a/api/card?id=${encodeURIComponent(id)}`));
				} catch (err) {
					setError(err.message);
				}
			};
			const openConversation = async (contextId, serverId) => {
				try {
					const query = new URLSearchParams({ contextId });
					if (serverId !== void 0) query.set("serverId", serverId);
					setConversation(await fetchJson(`/a2a/api/session?${query.toString()}`));
					setConversationKey(`${serverId ?? ""}/${contextId}`);
				} catch (err) {
					setError(err.message);
				}
			};
			const submitTest = async () => {
				if (testInbound === "" || testText.trim() === "") return;
				const result = await control({
					action: "inbound.sendTest",
					id: testInbound,
					text: testText.trim(),
					...testContext.trim() !== "" ? { contextId: testContext.trim() } : {},
					...testSkill.trim() !== "" ? { skill: testSkill.trim() } : {}
				});
				if (result.ok) setTestResult(result.task);
			};
			const toggleOutboundSkill = (id) => {
				setOutDisabledSkills((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
			};
			const beginCreateInbound = () => {
				setEditingIn(null);
				setInName("");
				setInDesc("");
				setInVersion("1.0.0");
				setInPreset(presets.find((p) => p.isDefault)?.id ?? "");
				setInToken("");
				setInClearAuth(false);
				setInTrace(false);
			};
			const beginEditInbound = (v) => {
				setEditingIn(v.id);
				setInName(v.name);
				setInDesc(v.description);
				setInVersion(v.version);
				setInPreset(v.preset ?? presets.find((p) => p.isDefault)?.id ?? "");
				setInToken("");
				setInClearAuth(false);
				setInTrace(v.trace);
			};
			const submitInbound = async () => {
				if (!inName.trim() || busy) return;
				const base = {
					name: inName.trim(),
					description: inDesc.trim() || "An A2A inbound server",
					version: inVersion.trim() || "1.0.0",
					...inPreset !== "" ? { preset: inPreset } : {},
					trace: inTrace
				};
				if (!(editingIn === null ? await control({
					action: "inbound.create",
					...base
				}) : await control({
					action: "inbound.update",
					id: editingIn,
					...base
				})).ok) return;
				let targetId = editingIn;
				if (targetId === null) targetId = (await fetchSnapshot()).inbounds[0]?.id ?? null;
				if (targetId === null) return;
				if (inToken.trim().length > 0) await control({
					action: "inbound.setAuth",
					id: targetId,
					token: inToken.trim()
				});
				else if (inClearAuth) await control({
					action: "inbound.setAuth",
					id: targetId
				});
				beginCreateInbound();
			};
			const doDiscover = async () => {
				if (!outUrl.trim() || discovering) return;
				setDiscovering(true);
				setDiscovered(null);
				try {
					const result = await postControl({
						action: "outbound.discover",
						agentCardUrl: outUrl.trim(),
						...outToken.trim() !== "" ? { token: outToken.trim() } : {}
					});
					if (result.ok && result.preview !== void 0) {
						const preview = result.preview;
						setDiscovered(preview);
						setOutName((v) => v || preview.name);
						setError(void 0);
					} else setError(result.message);
				} finally {
					setDiscovering(false);
				}
			};
			const submitOutbound = async () => {
				if (!outName.trim() || !outUrl.trim() || busy) return;
				const timeout = Number.parseInt(outTimeout, 10);
				const timeoutMs = Number.isFinite(timeout) && timeout > 0 ? timeout : void 0;
				let skillOverrides = {};
				try {
					if (outSkillOverrides.trim() !== "") skillOverrides = JSON.parse(outSkillOverrides);
				} catch {
					setError("skillOverrides must be valid JSON");
					return;
				}
				if (editingOut !== null) {
					if (!(await control({
						action: "outbound.update",
						id: editingOut,
						...outName.trim() !== "" ? { name: outName.trim() } : {},
						...outPreset !== "" ? { preset: outPreset } : {},
						...timeoutMs !== void 0 ? { timeoutMs } : {},
						disabledSkills: outDisabledSkills,
						...Object.keys(skillOverrides).length > 0 ? { skillOverrides } : {}
					})).ok) return;
					if (outToken.trim().length > 0) await control({
						action: "outbound.setAuth",
						id: editingOut,
						token: outToken.trim()
					});
					resetOutboundForm();
					return;
				}
				if (!(await control({
					action: "outbound.create",
					name: outName.trim(),
					agentCardUrl: outUrl.trim(),
					...outPreset !== "" ? { preset: outPreset } : {},
					...timeoutMs !== void 0 ? { timeoutMs } : {},
					disabledSkills: outDisabledSkills,
					...Object.keys(skillOverrides).length > 0 ? { skillOverrides } : {}
				})).ok) return;
				const newest = (await fetchSnapshot()).outbounds[0];
				if (newest !== void 0 && outToken.trim().length > 0) await control({
					action: "outbound.setAuth",
					id: newest.id,
					token: outToken.trim()
				});
				resetOutboundForm();
			};
			const beginEditOutbound = (v) => {
				setEditingOut(v.id);
				setOutName(v.name);
				setOutUrl(v.agentCardUrl);
				setOutPreset(v.preset ?? presets.find((p) => p.isDefault)?.id ?? "");
				setOutTimeout(String(v.timeoutMs));
				setOutToken("");
				setDiscovered(null);
				setOutDisabledSkills(v.skills.filter((skill) => !skill.enabled).map((skill) => skill.id));
				setOutSkillOverrides("{}");
			};
			const resetOutboundForm = () => {
				setEditingOut(null);
				setOutName("");
				setOutUrl("");
				setOutPreset(presets.find((p) => p.isDefault)?.id ?? "");
				setOutTimeout("60000");
				setOutToken("");
				setDiscovered(null);
				setOutDisabledSkills([]);
				setOutSkillOverrides("{}");
			};
			const inbounds = snap?.inbounds ?? [];
			const outbounds = snap?.outbounds ?? [];
			const peers = snap?.peers ?? [];
			const tasks = snap?.tasks ?? [];
			const sessions = snap?.sessions ?? [];
			const metrics = snap?.metrics;
			const editingOutbound = outbounds.find((v) => v.id === editingOut);
			const h = (text, count) => (0, react.createElement)("div", { className: "dsh-a2a-h3" }, text, count !== void 0 ? (0, react.createElement)("span", { className: "dsh-a2a-count" }, String(count)) : null);
			const empty = (text) => (0, react.createElement)("div", { className: "dsh-a2a-empty" }, text);
			const pluginVersion = update?.current || snap?.version || "";
			const updateStatus = updateStatusText(update, updateError);
			const updateTone = updateToneOf(update, updateError);
			const runtime = update?.runtime;
			const profile = runtime?.profile ?? "web";
			const updateCommand = updateCommandFor(profile);
			const copyUpdateCommand = () => {
				if (navigator.clipboard === void 0) {
					setNotice("Copy failed, select the command manually");
					return;
				}
				navigator.clipboard.writeText(updateCommand).then(() => setNotice("Update command copied")).catch(() => setNotice("Copy failed, select the command manually"));
			};
			return (0, react.createElement)("div", { className: "dsh-a2a-root" }, (0, react.createElement)("div", { className: "dsh-a2a-section" }, (0, react.createElement)("p", { className: "dsh-a2a-intro" }, "Manage A2A connections of this DSH: inbound servers publish DSH as an Agent (each bound to one agent preset, skills derive automatically); outbound servers connect to and call remote A2A Agents."), (0, react.createElement)("div", { className: "dsh-a2a-verbar" }, (0, react.createElement)("div", { className: "dsh-a2a-verbar-main" }, (0, react.createElement)("span", { className: "dsh-a2a-verbar-name" }, "dsh-a2a"), (0, react.createElement)("span", { className: "dsh-a2a-verbar-version dsh-a2a-mono" }, pluginVersion !== "" ? `v${pluginVersion}` : "v—"), (0, react.createElement)("span", {
				className: "dsh-a2a-verbar-status",
				"data-tone": updateTone
			}, updateStatus)), (0, react.createElement)("div", { className: "dsh-a2a-verbar-side" }, runtime !== void 0 ? (0, react.createElement)("span", { className: "dsh-a2a-verbar-runtime" }, `Node ${runtime.node} · ${runtime.platform}/${runtime.arch}`) : null, (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				type: "button",
				disabled: updateBusy,
				onClick: () => {
					checkUpdate();
				}
			}, updateBusy ? "Checking…" : "Check for updates"))), update !== void 0 && update.hasUpdate ? (0, react.createElement)("div", { className: "dsh-a2a-update-detail" }, (0, react.createElement)("div", { className: "dsh-a2a-hint" }, `New version v${update.latest ?? ""} found (current v${update.current}, source ${update.source ?? "unknown"}). Uninstall the old version before installing the new one; installing directly may pull a stale cached copy. The command uses the current profile (${profile}); restart DSH once after install.`), (0, react.createElement)("pre", { className: "dsh-a2a-command dsh-a2a-mono" }, updateCommand), (0, react.createElement)("div", { className: "dsh-a2a-btn-row" }, (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				type: "button",
				onClick: copyUpdateCommand
			}, "Copy command"), update.repoUrl !== null ? (0, react.createElement)("a", {
				className: "dsh-a2a-link",
				href: update.repoUrl,
				target: "_blank",
				rel: "noreferrer"
			}, "Open repository") : null)) : null, error !== void 0 ? (0, react.createElement)("div", { className: "dsh-a2a-notice dsh-a2a-error" }, `Load failed: ${error}`) : null, notice !== void 0 ? (0, react.createElement)("div", { className: "dsh-a2a-notice" }, notice) : null, (0, react.createElement)("div", { className: "dsh-a2a-tabs" }, (0, react.createElement)("button", {
				className: "dsh-a2a-tab",
				"data-active": String(tab === "inbound"),
				onClick: () => setTab("inbound")
			}, `Inbound Servers (${inbounds.length})`), (0, react.createElement)("button", {
				className: "dsh-a2a-tab",
				"data-active": String(tab === "outbound"),
				onClick: () => setTab("outbound")
			}, `Outbound Servers (${outbounds.length})`), (0, react.createElement)("button", {
				className: "dsh-a2a-tab",
				"data-active": String(tab === "activity"),
				onClick: () => setTab("activity")
			}, `Connections & tasks (${peers.length} connections · ${sessions.length} sessions)`)), tab === "inbound" ? (0, react.createElement)("div", { className: "dsh-a2a-stack" }, (0, react.createElement)("div", { className: "dsh-a2a-crew" }, h("Inbound Servers", inbounds.length), inbounds.length === 0 ? empty("No inbound servers yet. Create one to publish an A2A endpoint.") : (0, react.createElement)("div", { className: "dsh-a2a-card-list" }, ...inbounds.map((v) => (0, react.createElement)("div", {
				className: "dsh-a2a-card",
				key: v.id
			}, (0, react.createElement)("div", { className: "dsh-a2a-card-head" }, (0, react.createElement)("span", {
				"data-state": v.enabled ? "connected" : "disabled",
				className: "dsh-a2a-dot"
			}), (0, react.createElement)("span", { className: "dsh-a2a-card-name" }, v.name), (0, react.createElement)("span", { className: "dsh-a2a-badge" }, presetLabel(presets, v.preset)), (0, react.createElement)("span", { className: "dsh-a2a-badge dsh-a2a-mono" }, `v${v.version}`), ...v.trace ? [(0, react.createElement)("span", {
				className: "dsh-a2a-badge",
				key: "trace"
			}, "trace")] : [], (0, react.createElement)("span", { className: "dsh-a2a-auth" }, v.authTokenEnv !== void 0 ? "· auth configured" : "· anonymous")), (0, react.createElement)("div", { className: "dsh-a2a-card-sub dsh-a2a-mono" }, `${v.endpointPath} · ${v.cardUrl ?? v.cardPath}`), v.skills.length > 0 ? (0, react.createElement)("div", null, ...v.skills.map((s) => (0, react.createElement)("span", {
				className: "dsh-a2a-skill",
				key: s.id,
				title: s.description ?? ""
			}, s.name))) : null, (0, react.createElement)("div", { className: "dsh-a2a-btn-row" }, (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				disabled: busy,
				onClick: () => {
					control({
						action: v.enabled ? "inbound.disable" : "inbound.enable",
						id: v.id
					});
				}
			}, v.enabled ? "Disable" : "Enable"), (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				disabled: busy,
				onClick: () => {
					openCard(v.id);
				}
			}, "Card"), (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				disabled: busy,
				onClick: () => {
					setTestInbound(v.id);
					setTestSkill(v.skills[0]?.id ?? "chat");
					setTestResult(void 0);
				}
			}, "Test"), (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				disabled: busy,
				onClick: () => beginEditInbound(v)
			}, "Edit"), (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				disabled: busy,
				onClick: () => {
					control({
						action: "inbound.remove",
						id: v.id
					});
					if (editingIn === v.id) beginCreateInbound();
				}
			}, "Delete")))))), (0, react.createElement)("div", { className: "dsh-a2a-card" }, h(editingIn !== null ? "Edit Inbound Server" : "New Inbound Server"), (0, react.createElement)("form", {
				className: "dsh-a2a-form",
				onSubmit: (ev) => {
					ev.preventDefault();
					submitInbound();
				}
			}, (0, react.createElement)("input", {
				className: "dsh-a2a-input",
				value: inName,
				placeholder: "Name",
				onChange: (e) => setInName(e.target.value)
			}), (0, react.createElement)("input", {
				className: "dsh-a2a-input",
				value: inVersion,
				placeholder: "Version",
				style: { width: "76px" },
				onChange: (e) => setInVersion(e.target.value)
			}), (0, react.createElement)("select", {
				className: "dsh-a2a-select",
				value: inPreset,
				onChange: (e) => setInPreset(e.target.value)
			}, ...presets.map((p) => (0, react.createElement)("option", {
				value: p.id,
				key: p.id,
				title: p.description ?? p.id
			}, p.name ?? p.id))), (0, react.createElement)("input", {
				className: "dsh-a2a-input",
				type: "password",
				value: inToken,
				placeholder: editingIn !== null ? "Bearer Token (leave empty to keep, type to update)" : "Bearer Token (optional)",
				onChange: (e) => setInToken(e.target.value)
			}), (0, react.createElement)("label", { className: "dsh-a2a-hint" }, (0, react.createElement)("input", {
				type: "checkbox",
				checked: inTrace,
				onChange: (e) => setInTrace(e.target.checked)
			}), "  Allow trace extension (tool names/redacted summaries, off by default)"), (0, react.createElement)("button", {
				className: "dsh-a2a-btn dsh-a2a-btn-primary",
				type: "submit",
				disabled: busy || !inName.trim()
			}, editingIn !== null ? "Save changes" : "Create Server"), editingIn !== null ? (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				type: "button",
				disabled: busy,
				onClick: () => beginCreateInbound()
			}, "Cancel") : null), editingIn !== null && snap?.inbounds.find((x) => x.id === editingIn)?.authTokenEnv !== void 0 ? (0, react.createElement)("div", { className: "dsh-a2a-form" }, (0, react.createElement)("label", { className: "dsh-a2a-hint" }, "Auth is configured."), (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				type: "button",
				disabled: busy,
				onClick: () => {
					setInClearAuth(true);
					submitInbound();
				}
			}, "Clear auth")) : null, (0, react.createElement)("div", { className: "dsh-a2a-form" }, (0, react.createElement)("input", {
				className: "dsh-a2a-input",
				value: inDesc,
				placeholder: "Description",
				style: {
					flex: 1,
					minWidth: "220px"
				},
				onChange: (e) => setInDesc(e.target.value)
			})), (0, react.createElement)("div", { className: "dsh-a2a-hint" }, "Skills derive automatically from the bound preset (everything is a plugin); Bearer Token can stay empty (anonymous).")), (0, react.createElement)("div", { className: "dsh-a2a-card" }, h("Built-in test console", void 0), (0, react.createElement)("div", { className: "dsh-a2a-form" }, (0, react.createElement)("select", {
				className: "dsh-a2a-select",
				value: testInbound,
				onChange: (e) => {
					setTestInbound(e.target.value);
					const inbound = inbounds.find((v) => v.id === e.target.value);
					setTestSkill(inbound?.skills[0]?.id ?? "chat");
				}
			}, ...inbounds.map((v) => (0, react.createElement)("option", {
				value: v.id,
				key: v.id
			}, v.name))), (0, react.createElement)("input", {
				className: "dsh-a2a-input",
				value: testSkill,
				placeholder: "skill",
				style: { width: "120px" },
				onChange: (e) => setTestSkill(e.target.value)
			}), (0, react.createElement)("input", {
				className: "dsh-a2a-input",
				value: testContext,
				placeholder: "contextId (optional)",
				style: { width: "180px" },
				onChange: (e) => setTestContext(e.target.value)
			}), (0, react.createElement)("input", {
				className: "dsh-a2a-input",
				value: testText,
				placeholder: "Send a test message",
				style: {
					flex: 1,
					minWidth: "220px"
				},
				onChange: (e) => setTestText(e.target.value)
			}), (0, react.createElement)("button", {
				className: "dsh-a2a-btn dsh-a2a-btn-primary",
				type: "button",
				disabled: busy || testInbound === "" || testText.trim() === "",
				onClick: () => {
					submitTest();
				}
			}, "Send")), testResult !== void 0 ? (0, react.createElement)("pre", { className: "dsh-a2a-detail" }, JSON.stringify(testResult, null, 2)) : null), cardView !== void 0 ? (0, react.createElement)("div", { className: "dsh-a2a-card" }, h("AgentCard JSON"), (0, react.createElement)("pre", { className: "dsh-a2a-detail" }, JSON.stringify(cardView, null, 2)), (0, react.createElement)("div", { className: "dsh-a2a-btn-row" }, (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				type: "button",
				onClick: () => setCardView(void 0)
			}, "Close"))) : null) : null, tab === "outbound" ? (0, react.createElement)("div", { className: "dsh-a2a-stack" }, (0, react.createElement)("div", { className: "dsh-a2a-crew" }, h("Outbound Servers", outbounds.length), outbounds.length === 0 ? empty("No outbound servers yet. Add a remote A2A connection to register its skills as model tools.") : (0, react.createElement)("div", { className: "dsh-a2a-card-list" }, ...outbounds.map((v) => (0, react.createElement)("div", {
				className: "dsh-a2a-card",
				key: v.id
			}, (0, react.createElement)("div", { className: "dsh-a2a-card-head" }, (0, react.createElement)("span", {
				"data-state": dotState(v.state),
				className: "dsh-a2a-dot"
			}), (0, react.createElement)("span", { className: "dsh-a2a-card-name" }, v.name), (0, react.createElement)("span", { className: "dsh-a2a-badge" }, presetLabel(presets, v.preset)), v.agentVersion !== void 0 ? (0, react.createElement)("span", { className: "dsh-a2a-badge dsh-a2a-mono" }, `v${v.agentVersion}`) : null, (0, react.createElement)("span", { className: "dsh-a2a-auth" }, `· ${v.state} · tools ${v.toolCount}/${v.skillCount}`)), (0, react.createElement)("div", { className: "dsh-a2a-card-sub dsh-a2a-mono" }, v.agentCardUrl), v.lastError !== void 0 ? (0, react.createElement)("div", { className: "dsh-a2a-notice dsh-a2a-error" }, v.lastError) : null, (0, react.createElement)("div", { className: "dsh-a2a-btn-row" }, (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				disabled: busy,
				onClick: () => {
					control({
						action: v.enabled ? "outbound.disable" : "outbound.enable",
						id: v.id
					});
				}
			}, v.enabled ? "Disable" : "Enable"), (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				disabled: busy,
				onClick: () => {
					control({
						action: "outbound.refresh",
						id: v.id
					});
				}
			}, "Refresh"), (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				disabled: busy,
				onClick: () => beginEditOutbound(v)
			}, "Edit"), (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				disabled: busy,
				onClick: () => {
					control({
						action: "outbound.remove",
						id: v.id
					});
					if (editingOut === v.id) resetOutboundForm();
				}
			}, "Delete")))))), (0, react.createElement)("div", { className: "dsh-a2a-card" }, h(editingOut !== null ? "Edit Outbound Server" : "Add Outbound Server"), (0, react.createElement)("form", {
				className: "dsh-a2a-form",
				onSubmit: (ev) => {
					ev.preventDefault();
					doDiscover();
				}
			}, (0, react.createElement)("input", {
				className: "dsh-a2a-input",
				value: outName,
				placeholder: "Name",
				onChange: (e) => setOutName(e.target.value)
			}), (0, react.createElement)("input", {
				className: "dsh-a2a-input",
				value: outUrl,
				placeholder: "Remote AgentCard URL",
				style: {
					flex: 1,
					minWidth: "220px"
				},
				onChange: (e) => {
					setOutUrl(e.target.value);
					setDiscovered(null);
				}
			}), (0, react.createElement)("input", {
				className: "dsh-a2a-input",
				type: "password",
				value: outToken,
				placeholder: "Bearer Token (optional)",
				onChange: (e) => setOutToken(e.target.value)
			}), (0, react.createElement)("select", {
				className: "dsh-a2a-select",
				value: outPreset,
				onChange: (e) => setOutPreset(e.target.value)
			}, ...presets.map((p) => (0, react.createElement)("option", {
				value: p.id,
				key: p.id,
				title: p.description ?? p.id
			}, p.name ?? p.id))), (0, react.createElement)("input", {
				className: "dsh-a2a-input",
				value: outTimeout,
				placeholder: "Timeout ms",
				style: { width: "90px" },
				onChange: (e) => setOutTimeout(e.target.value)
			}), editingOutbound !== void 0 ? (0, react.createElement)("div", { className: "dsh-a2a-skill-list" }, (0, react.createElement)("div", { className: "dsh-a2a-skill-list-title" }, "Skills (check to enable)"), ...editingOutbound.skills.map((skill) => (0, react.createElement)("label", {
				key: skill.id,
				className: "dsh-a2a-skill-toggle"
			}, (0, react.createElement)("input", {
				type: "checkbox",
				checked: !outDisabledSkills.includes(skill.id),
				onChange: () => toggleOutboundSkill(skill.id)
			}), ` ${skill.name}${skill.description !== void 0 ? ` — ${skill.description}` : ""}`)), (0, react.createElement)("input", {
				className: "dsh-a2a-input",
				value: outSkillOverrides,
				placeholder: "per-skill override JSON, e.g. {\"chat\":{\"description\":\"...\"}}",
				onChange: (e) => setOutSkillOverrides(e.target.value)
			})) : null, editingOut === null ? (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				type: "submit",
				disabled: busy || discovering || !outUrl.trim()
			}, discovering ? "Reading…" : "Import") : null, (0, react.createElement)("button", {
				className: "dsh-a2a-btn dsh-a2a-btn-primary",
				type: "button",
				disabled: busy || editingOut === null && discovered === null || !outName.trim() || !outUrl.trim(),
				onClick: () => {
					submitOutbound();
				}
			}, editingOut !== null ? "Save changes" : "Connect"), editingOut !== null ? (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				type: "button",
				disabled: busy,
				onClick: () => resetOutboundForm()
			}, "Cancel") : null), discovered !== null ? (0, react.createElement)("div", { className: "dsh-a2a-preview" }, (0, react.createElement)("div", { className: "dsh-a2a-preview-head" }, (0, react.createElement)("span", {
				"data-state": "connected",
				className: "dsh-a2a-dot"
			}), (0, react.createElement)("span", { className: "dsh-a2a-preview-name" }, discovered.name), discovered.version !== void 0 ? (0, react.createElement)("span", { className: "dsh-a2a-preview-meta dsh-a2a-mono" }, `v${discovered.version}`) : null), discovered.description !== void 0 ? (0, react.createElement)("div", { className: "dsh-a2a-preview-desc" }, discovered.description) : null, discovered.skills.length > 0 ? (0, react.createElement)("div", { className: "dsh-a2a-skill-list" }, (0, react.createElement)("div", { className: "dsh-a2a-skill-list-title" }, `Skills (${discovered.skills.length})`), ...discovered.skills.map((s) => (0, react.createElement)("div", { key: s.id }, `• ${s.name}${s.description !== void 0 ? ` — ${s.description}` : ""}`))) : null, (0, react.createElement)("div", { className: "dsh-a2a-preview-meta dsh-a2a-mono" }, `Endpoint ${discovered.endpoint}`), (0, react.createElement)("div", { className: "dsh-a2a-btn-row" }, (0, react.createElement)("button", {
				className: "dsh-a2a-btn dsh-a2a-btn-primary",
				disabled: busy || !outName.trim(),
				onClick: () => {
					submitOutbound();
				}
			}, "Connect"), (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				disabled: busy,
				onClick: () => {
					setDiscovered(null);
					setOutUrl("");
				}
			}, "Cancel"))) : (0, react.createElement)("div", { className: "dsh-a2a-hint" }, editingOut === null ? "Enter a remote AgentCard URL and click \"Import\" to read its name, description, skills and endpoint; the connection is created after confirmation." : "Saving applies name/preset/timeout and token changes and rebuilds the connection."))) : null, tab === "activity" ? (0, react.createElement)("div", { className: "dsh-a2a-stack" }, (0, react.createElement)("div", { className: "dsh-a2a-crew" }, h("Metrics"), metrics !== void 0 ? (0, react.createElement)("div", { className: "dsh-a2a-metrics" }, (0, react.createElement)("span", null, `Requests ${metrics.requests} · auth failures ${metrics.authFailures}`), (0, react.createElement)("span", null, `Tasks ${metrics.tasks.created} (done ${metrics.tasks.completed} / failed ${metrics.tasks.failed} / canceled ${metrics.tasks.canceled} / interrupted ${metrics.tasks.interrupted})`), (0, react.createElement)("span", null, `avg ${metrics.tasks.avgDurationMs}ms · max ${metrics.tasks.maxDurationMs}ms`), (0, react.createElement)("span", null, `Outbound ${metrics.outbound.calls} (errors ${metrics.outbound.errors}, avg ${metrics.outbound.avgDurationMs}ms)`)) : empty("No metrics yet."), metrics !== void 0 && metrics.audit.length > 0 ? (0, react.createElement)("div", { className: "dsh-a2a-table-wrap" }, (0, react.createElement)("table", { className: "dsh-a2a-table" }, (0, react.createElement)("thead", null, (0, react.createElement)("tr", null, (0, react.createElement)("th", null, "Time"), (0, react.createElement)("th", null, "Event"), (0, react.createElement)("th", null, "Instance / Task"), (0, react.createElement)("th", null, "Details"))), (0, react.createElement)("tbody", null, ...metrics.audit.slice(-20).reverse().map((event, index) => (0, react.createElement)("tr", { key: `${event.at}-${index}` }, (0, react.createElement)("td", null, event.at), (0, react.createElement)("td", null, event.kind), (0, react.createElement)("td", null, event.serverId ?? event.taskId ?? "-"), (0, react.createElement)("td", null, event.detail ?? event.method ?? event.source ?? "-")))))) : null), (0, react.createElement)("div", { className: "dsh-a2a-crew" }, h("Inbound connections (who calls this service)", peers.length), peers.length === 0 ? empty("No inbound connections yet. They appear here once other A2A clients call this DSH endpoint.") : (0, react.createElement)("div", { className: "dsh-a2a-table-wrap" }, (0, react.createElement)("table", { className: "dsh-a2a-table" }, (0, react.createElement)("thead", null, (0, react.createElement)("tr", null, (0, react.createElement)("th", null, "Source"), (0, react.createElement)("th", null, "Task"), (0, react.createElement)("th", null, "Streaming"), (0, react.createElement)("th", null, "First / Last"), (0, react.createElement)("th", null, "Actions"))), (0, react.createElement)("tbody", null, ...peers.map((p) => (0, react.createElement)("tr", { key: p.id }, (0, react.createElement)("td", null, p.source ?? p.label), (0, react.createElement)("td", null, `${p.taskCount} (active ${p.activeTaskIds.length})`), (0, react.createElement)("td", null, p.streaming ? "●" : "—"), (0, react.createElement)("td", null, (0, react.createElement)("span", { className: "dsh-a2a-card-sub" }, `${p.firstSeen ?? ""} / ${p.lastSeen ?? ""}`)), (0, react.createElement)("td", null, (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				disabled: busy,
				onClick: () => {
					control({
						action: "inbound.close",
						id: p.id
					});
				}
			}, "Close")))))))), (0, react.createElement)("div", { className: "dsh-a2a-crew" }, h("Inbound sessions (by contextId)", sessions.length), sessions.length === 0 ? empty("No sessions yet. When other A2A clients call this service with a contextId, a session row appears here.") : (0, react.createElement)("div", { className: "dsh-a2a-table-wrap" }, (0, react.createElement)("table", { className: "dsh-a2a-table" }, (0, react.createElement)("thead", null, (0, react.createElement)("tr", null, (0, react.createElement)("th", null, "Session"), (0, react.createElement)("th", null, "Instance"), (0, react.createElement)("th", null, "Preset"), (0, react.createElement)("th", null, "State"), (0, react.createElement)("th", null, "Task"), (0, react.createElement)("th", null, "Streaming"), (0, react.createElement)("th", null, "First / Last"), (0, react.createElement)("th", null, "Actions"))), (0, react.createElement)("tbody", null, ...sessions.map((s) => (0, react.createElement)("tr", { key: `${s.serverId ?? ""}/${s.contextId}` }, (0, react.createElement)("td", null, (0, react.createElement)("span", { className: "dsh-a2a-card-sub dsh-a2a-mono" }, s.contextId)), (0, react.createElement)("td", null, s.serverName ?? s.serverId ?? "-"), (0, react.createElement)("td", null, s.preset ?? "-"), (0, react.createElement)("td", null, (0, react.createElement)("span", {
				"data-state": s.status === "running" ? "connected" : void 0,
				className: "dsh-a2a-dot"
			}), ` ${s.status === "running" ? "running" : "idle"}`), (0, react.createElement)("td", null, `${s.taskCount} (active ${s.activeCount})`), (0, react.createElement)("td", null, s.streaming ? "●" : "—"), (0, react.createElement)("td", null, (0, react.createElement)("span", { className: "dsh-a2a-card-sub" }, `${s.firstSeen} / ${s.lastSeen}`)), (0, react.createElement)("td", null, (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				disabled: busy || s.activeCount === 0,
				onClick: () => {
					control({
						action: "session.cancel",
						id: s.contextId,
						...s.serverId !== void 0 ? { serverId: s.serverId } : {}
					});
				}
			}, "Cancel active"), (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				disabled: busy,
				onClick: () => {
					openConversation(s.contextId, s.serverId);
				}
			}, "Conversation"), (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				disabled: busy,
				onClick: () => {
					control({
						action: "session.close",
						id: s.contextId,
						...s.serverId !== void 0 ? { serverId: s.serverId } : {}
					});
				}
			}, "Close")))))))), conversation !== void 0 ? (0, react.createElement)("div", { className: "dsh-a2a-crew" }, h(`Session conversation (${conversationKey})`), (0, react.createElement)("pre", { className: "dsh-a2a-detail" }, JSON.stringify(conversation, null, 2))) : null, (0, react.createElement)("div", { className: "dsh-a2a-crew" }, h("Task", tasks.length), (0, react.createElement)("div", { className: "dsh-a2a-form" }, (0, react.createElement)("select", {
				className: "dsh-a2a-select",
				value: taskFilter,
				onChange: (e) => {
					setTaskFilter(e.target.value);
					setTaskLimit(50);
				}
			}, (0, react.createElement)("option", { value: "" }, "All states"), (0, react.createElement)("option", { value: "TASK_STATE_WORKING" }, "WORKING"), (0, react.createElement)("option", { value: "TASK_STATE_COMPLETED" }, "COMPLETED"), (0, react.createElement)("option", { value: "TASK_STATE_FAILED" }, "FAILED"), (0, react.createElement)("option", { value: "TASK_STATE_CANCELED" }, "CANCELED"), (0, react.createElement)("option", { value: "TASK_STATE_INPUT_REQUIRED" }, "INPUT_REQUIRED"), (0, react.createElement)("option", { value: "TASK_STATE_AUTH_REQUIRED" }, "AUTH_REQUIRED")), (0, react.createElement)("span", { className: "dsh-a2a-hint" }, `${snap?.taskTotal ?? tasks.length} total, showing ${tasks.length}`), snap?.taskNextOffset !== null && snap?.taskNextOffset !== void 0 ? (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				type: "button",
				onClick: () => setTaskLimit((current) => current + 50)
			}, "Load more") : null), tasks.length === 0 ? empty("No tasks yet.") : (0, react.createElement)("div", { className: "dsh-a2a-table-wrap" }, (0, react.createElement)("table", { className: "dsh-a2a-table" }, (0, react.createElement)("thead", null, (0, react.createElement)("tr", null, (0, react.createElement)("th", null, "ID"), (0, react.createElement)("th", null, "Skill"), (0, react.createElement)("th", null, "Source"), (0, react.createElement)("th", null, "State"), (0, react.createElement)("th", null, "Actions"))), (0, react.createElement)("tbody", null, ...tasks.map((t) => (0, react.createElement)("tr", { key: t.id }, (0, react.createElement)("td", null, (0, react.createElement)("button", {
				className: "dsh-a2a-link dsh-a2a-mono",
				type: "button",
				onClick: () => {
					openTask(t.id);
				}
			}, t.id)), (0, react.createElement)("td", null, t.metadata?.skill ?? "-"), (0, react.createElement)("td", null, t.metadata?.serverId ?? t.serverId ?? "-"), (0, react.createElement)("td", null, t.status?.state ?? "-"), (0, react.createElement)("td", null, (0, react.createElement)("button", {
				className: "dsh-a2a-btn",
				disabled: busy,
				onClick: () => {
					control({
						action: "task.cancel",
						id: t.id
					});
				}
			}, "Cancel"))))))), selectedTask !== void 0 ? (0, react.createElement)("pre", { className: "dsh-a2a-detail" }, JSON.stringify(selectedTask, null, 2)) : null)) : null, (0, react.createElement)("div", { className: "dsh-a2a-footer" }, "Auto-refresh every 3 seconds.")));
		}
		//#endregion
		exports.A2aSection = A2aSection;
		exports.apply = apply;
		exports.inject = inject;

		return module.exports;
	}
});
