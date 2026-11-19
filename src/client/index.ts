/**
 * A2A settings dashboard — browser half.
 *
 * Registers one `settings.section` ("A2A Connections") managing the multi-instance
 * A2A composition across three tabs: inbound server instances (create/edit,
 * each with its own agent preset — skills derive automatically — and an
 * optional bearer token), outbound server connections (two-phase
 * discover→connect, auth, preset, timeout), and connection/session/task
 * activity (per-context session monitoring with cancel/close).
 *
 * Styling lives in dashboard.css.ts, built entirely on the product's
 * `--dsw-alias-*` design tokens with `@container` responsiveness. All data and
 * controls sit behind the host's loopback-only `/a2a/api` route; this half is
 * a thin read/write client with no protocol knowledge.
 * @module dsh-a2a/client
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { createElement, useEffect, useState, type ReactElement } from 'react'
import { injectDashboardStyles } from './dashboard.css.ts'
import { updateCommandFor, updateStatusText, updateToneOf, type UpdateInfo } from './update-status.ts'

/** Services this plugin needs from the client runtime. */
export const inject = ['slots']

const NS = 'a2a'

export function apply(ctx: ClientContext): void {
  ctx.effect(() => injectDashboardStyles(), `${NS}: dashboard styles`)
  // settings.section is declared at runtime by ui-settings-general; slots.inject
  // defers registration until that declaration exists and follows its lifetime.
  ctx.slots.inject('settings.section', () => ctx.slots.register(
    {
      name: 'settings.section',
      id: 'a2a',
      order: 90,
      label: () => 'A2A Connections',
      inject: () => ({}),
    },
    A2aSection,
  ))
}

/** Wire types — mirror the host's src/api.ts + src/service.ts views. */
export interface SkillView {
  readonly id: string
  readonly name: string
  readonly description?: string
}

export interface InboundServerView {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly version: string
  readonly endpointPath: string
  readonly preset?: string
  readonly authTokenEnv?: string
  readonly cardPath: string
  readonly cardUrl?: string
  readonly enabled: boolean
  readonly trace: boolean
  readonly skills: readonly SkillView[]
}

export interface OutboundSkillView {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly enabled: boolean
}

export interface OutboundServerView {
  readonly id: string
  readonly name: string
  readonly agentCardUrl: string
  readonly preset?: string
  readonly enabled: boolean
  readonly timeoutMs: number
  readonly state: string
  readonly skillCount: number
  readonly toolCount: number
  readonly skills: readonly OutboundSkillView[]
  /** The remote AgentCard's advertised version (absent when unknown). */
  readonly agentVersion?: string
  readonly lastError?: string
  readonly lastCardAt?: string
}

export interface PresetView {
  readonly id: string
  readonly name?: string
  readonly description?: string
  /** Whether this preset is the deployment default when none is named. */
  readonly isDefault?: boolean
}

export interface ApiSnapshot {
  /** Installed plugin version (also present when the update check has not run). */
  readonly version: string
  readonly inbounds: readonly InboundServerView[]
  readonly outbounds: readonly OutboundServerView[]
  readonly tasks: readonly TaskView[]
  readonly taskTotal: number
  readonly taskNextOffset: number | null
  readonly peers: readonly InboundPeerView[]
  readonly sessions: readonly SessionView[]
  readonly metrics: MetricsSnapshot
}

export interface MetricsSnapshot {
  readonly requests: number
  readonly authFailures: number
  readonly tasks: {
    readonly created: number
    readonly completed: number
    readonly failed: number
    readonly canceled: number
    readonly interrupted: number
    readonly avgDurationMs: number
    readonly maxDurationMs: number
  }
  readonly outbound: {
    readonly calls: number
    readonly errors: number
    readonly avgDurationMs: number
  }
  readonly audit: readonly AuditEvent[]
}

export interface AuditEvent {
  readonly at: string
  readonly kind: string
  readonly serverId?: string
  readonly taskId?: string
  readonly method?: string
  readonly source?: string
  readonly detail?: string
}

/** The host's update-check answer is exported by `./update-status.ts`. */
export type { UpdateInfo } from './update-status.ts'

interface DiscoverPreview {
  readonly name: string
  readonly version?: string
  readonly description?: string
  readonly endpoint: string
  readonly skills: readonly SkillView[]
}

interface InboundPeerView {
  readonly id: string
  readonly label: string
  readonly source?: string | null
  readonly firstSeen?: string
  readonly lastSeen?: string
  readonly taskCount: number
  readonly activeTaskIds: readonly string[]
  readonly streaming: boolean
}

interface TaskView {
  readonly id: string
  readonly contextId?: string
  readonly serverId?: string
  readonly status?: { readonly state: string; readonly message?: { readonly parts?: readonly { readonly text?: string }[] } }
  readonly artifacts?: readonly { readonly artifactId?: string; readonly name?: string; readonly parts?: readonly unknown[] }[]
  readonly error?: { readonly code: string; readonly message: string }
  readonly metadata?: { readonly skill?: string; readonly serverId?: string }
}

/** One aggregated inbound session row (mirrors the host SessionView). */
interface SessionView {
  readonly contextId: string
  readonly sessionId: string
  readonly serverId?: string
  readonly serverName?: string
  readonly preset?: string
  readonly status: string
  readonly taskCount: number
  readonly activeCount: number
  readonly firstSeen: string
  readonly lastSeen: string
  readonly streaming: boolean
  readonly live: boolean
}

async function fetchSnapshot(query: { readonly taskLimit?: number; readonly taskOffset?: number; readonly taskState?: string } = {}): Promise<ApiSnapshot> {
  const params = new URLSearchParams()
  if (query.taskLimit !== undefined) params.set('taskLimit', String(query.taskLimit))
  if (query.taskOffset !== undefined) params.set('taskOffset', String(query.taskOffset))
  if (query.taskState !== undefined && query.taskState.length > 0) params.set('taskState', query.taskState)
  const suffix = params.size > 0 ? `?${params.toString()}` : ''
  const res = await fetch(`/a2a/api${suffix}`, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`snapshot HTTP ${res.status}`)
  return (await res.json()) as ApiSnapshot
}

async function fetchJson(path: string): Promise<unknown> {
  const res = await fetch(path, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json()
}

async function fetchPresets(): Promise<PresetView[]> {
  const res = await fetch('/a2a/api/presets', { headers: { accept: 'application/json' } })
  if (!res.ok) return []
  return (await res.json()) as PresetView[]
}

async function fetchUpdate(force = false): Promise<UpdateInfo> {
  const res = await fetch(`/a2a/api/update${force ? '?refresh=1' : ''}`, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as UpdateInfo
}

async function postControl(payload: Record<string, unknown>): Promise<{ readonly ok: boolean; readonly message: string; readonly preview?: unknown; readonly task?: unknown }> {
  const res = await fetch('/a2a/api', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return (await res.json().catch(() => ({ ok: false, message: `HTTP ${res.status}` }))) as { ok: boolean; message: string; preview?: unknown; task?: unknown }
}

function dotState(state: string): string {
  if (state === 'connected') return 'connected'
  if (state === 'reconnecting' || state === 'disabled') return 'disabled'
  if (state === 'failed') return 'failed'
  return 'connected'
}

function presetLabel(presets: readonly PresetView[], id: string | undefined): string {
  if (id === undefined) return '—'
  return presets.find((p) => p.id === id)?.name ?? id
}

type SectionProps = PropsRuntime<'settings.section'>

export function A2aSection(_props: SectionProps): ReactElement {
  const [snap, setSnap] = useState<ApiSnapshot | undefined>(undefined)
  const [presets, setPresets] = useState<readonly PresetView[]>([])
  const [error, setError] = useState<string | undefined>(undefined)
  const [notice, setNotice] = useState<string | undefined>(undefined)
  const [busy, setBusy] = useState(false)
  const [update, setUpdate] = useState<UpdateInfo | undefined>(undefined)
  const [updateBusy, setUpdateBusy] = useState(false)
  const [updateError, setUpdateError] = useState<string | undefined>(undefined)
  const [tab, setTab] = useState<'inbound' | 'outbound' | 'activity'>('inbound')
  const [taskFilter, setTaskFilter] = useState('')
  const [taskLimit, setTaskLimit] = useState(50)
  const [selectedTask, setSelectedTask] = useState<unknown>(undefined)
  const [cardView, setCardView] = useState<unknown>(undefined)
  const [conversation, setConversation] = useState<unknown>(undefined)
  const [conversationKey, setConversationKey] = useState('')
  const [testInbound, setTestInbound] = useState('')
  const [testContext, setTestContext] = useState('')
  const [testSkill, setTestSkill] = useState('chat')
  const [testText, setTestText] = useState('')
  const [testResult, setTestResult] = useState<unknown>(undefined)

  // Inbound create/edit form.
  const [editingIn, setEditingIn] = useState<string | null>(null)
  const [inName, setInName] = useState('')
  const [inDesc, setInDesc] = useState('')
  const [inVersion, setInVersion] = useState('1.0.0')
  const [inPreset, setInPreset] = useState('')
  const [inToken, setInToken] = useState('')
  const [inClearAuth, setInClearAuth] = useState(false)
  const [inTrace, setInTrace] = useState(false)

  // Outbound add/edit form (two-phase).
  const [editingOut, setEditingOut] = useState<string | null>(null)
  const [outName, setOutName] = useState('')
  const [outUrl, setOutUrl] = useState('')
  const [outPreset, setOutPreset] = useState('')
  const [outTimeout, setOutTimeout] = useState('60000')
  const [outToken, setOutToken] = useState('')
  const [discovered, setDiscovered] = useState<DiscoverPreview | null>(null)
  const [discovering, setDiscovering] = useState(false)
  const [outDisabledSkills, setOutDisabledSkills] = useState<string[]>([])
  const [outSkillOverrides, setOutSkillOverrides] = useState('{}')

  useEffect(() => {
    let alive = true
    const tick = async (): Promise<void> => {
      try {
        const [next, presetRows] = await Promise.all([
          fetchSnapshot({ taskLimit, ...(taskFilter !== '' ? { taskState: taskFilter } : {}) }),
          fetchPresets(),
        ])
        if (alive) {
          setSnap(next)
          setPresets(presetRows)
          // Default an unset preset picker to the deployment default (if any).
          const def = presetRows.find((p) => p.isDefault)?.id
          setInPreset((current) => current === '' && def !== undefined ? def : current)
          setOutPreset((current) => current === '' && def !== undefined ? def : current)
          setTestInbound((current) => current === '' ? (next.inbounds[0]?.id ?? '') : current)
          setTestSkill((current) => current === '' ? (next.inbounds[0]?.skills[0]?.id ?? 'chat') : current)
          setError(undefined)
        }
      } catch (err) {
        if (alive) setError((err as Error).message)
      }
    }
    void tick()
    const timer = setInterval(() => void tick(), 3000)
    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [taskFilter, taskLimit])

  // The version strip asks once on mount; the host caches the answer for six
  // hours and only an explicit click (refresh=1) reaches the network again.
  useEffect(() => {
    let alive = true
    fetchUpdate()
      .then((info) => { if (alive) setUpdate(info) })
      .catch((err: unknown) => { if (alive) setUpdateError((err as Error).message) })
    return () => { alive = false }
  }, [])

  const checkUpdate = async (): Promise<void> => {
    if (updateBusy) return
    setUpdateBusy(true)
    setUpdateError(undefined)
    try {
      setUpdate(await fetchUpdate(true))
    } catch (err) {
      setUpdateError((err as Error).message)
    } finally {
      setUpdateBusy(false)
    }
  }

  const control = async (payload: Record<string, unknown>): Promise<{ ok: boolean; message: string; preview?: unknown; task?: unknown }> => {
    setBusy(true)
    try {
      const result = await postControl(payload)
      if (!result.ok) setError(result.message)
      else setNotice(result.message)
      setSnap(await fetchSnapshot({ taskLimit, ...(taskFilter !== '' ? { taskState: taskFilter } : {}) }))
      return result
    } catch (err) {
      setError((err as Error).message)
      return { ok: false, message: (err as Error).message }
    } finally {
      setBusy(false)
    }
  }

  const openTask = async (id: string): Promise<void> => {
    try {
      setSelectedTask(await fetchJson(`/a2a/api/task?id=${encodeURIComponent(id)}`))
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const openCard = async (id: string): Promise<void> => {
    try {
      setCardView(await fetchJson(`/a2a/api/card?id=${encodeURIComponent(id)}`))
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const openConversation = async (contextId: string, serverId?: string): Promise<void> => {
    try {
      const query = new URLSearchParams({ contextId })
      if (serverId !== undefined) query.set('serverId', serverId)
      setConversation(await fetchJson(`/a2a/api/session?${query.toString()}`))
      setConversationKey(`${serverId ?? ''}/${contextId}`)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const submitTest = async (): Promise<void> => {
    if (testInbound === '' || testText.trim() === '') return
    const result = await control({
      action: 'inbound.sendTest',
      id: testInbound,
      text: testText.trim(),
      ...(testContext.trim() !== '' ? { contextId: testContext.trim() } : {}),
      ...(testSkill.trim() !== '' ? { skill: testSkill.trim() } : {}),
    })
    if (result.ok) setTestResult(result.task)
  }

  const toggleOutboundSkill = (id: string): void => {
    setOutDisabledSkills((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])
  }

  const beginCreateInbound = (): void => {
    setEditingIn(null)
    setInName('')
    setInDesc('')
    setInVersion('1.0.0')
    setInPreset(presets.find((p) => p.isDefault)?.id ?? '')
    setInToken('')
    setInClearAuth(false)
    setInTrace(false)
  }

  const beginEditInbound = (v: InboundServerView): void => {
    setEditingIn(v.id)
    setInName(v.name)
    setInDesc(v.description)
    setInVersion(v.version)
    setInPreset(v.preset ?? presets.find((p) => p.isDefault)?.id ?? '')
    setInToken('')
    setInClearAuth(false)
    setInTrace(v.trace)
  }

  const submitInbound = async (): Promise<void> => {
    if (!inName.trim() || busy) return
    const base = {
      name: inName.trim(),
      description: inDesc.trim() || 'An A2A inbound server',
      version: inVersion.trim() || '1.0.0',
      ...(inPreset !== '' ? { preset: inPreset } : {}),
      trace: inTrace,
    }
    const done = editingIn === null
      ? await control({ action: 'inbound.create', ...base })
      : await control({ action: 'inbound.update', id: editingIn, ...base })
    if (!done.ok) return
    // The id-echoed create response carries `id`, but the generic control
    // result drops it; resolve the target from the fresh snapshot.
    let targetId = editingIn
    if (targetId === null) {
      const fresh = await fetchSnapshot()
      const newest = fresh.inbounds[0]
      targetId = newest?.id ?? null
    }
    if (targetId === null) return
    if (inToken.trim().length > 0) await control({ action: 'inbound.setAuth', id: targetId, token: inToken.trim() })
    else if (inClearAuth) await control({ action: 'inbound.setAuth', id: targetId })
    beginCreateInbound()
  }

  const doDiscover = async (): Promise<void> => {
    if (!outUrl.trim() || discovering) return
    setDiscovering(true)
    setDiscovered(null)
    try {
      const result = await postControl({ action: 'outbound.discover', agentCardUrl: outUrl.trim(), ...(outToken.trim() !== '' ? { token: outToken.trim() } : {}) })
      if (result.ok && result.preview !== undefined) {
        const preview = result.preview as DiscoverPreview
        setDiscovered(preview)
        setOutName((v) => v || preview.name)
        setError(undefined)
      } else {
        setError(result.message)
      }
    } finally {
      setDiscovering(false)
    }
  }

  const submitOutbound = async (): Promise<void> => {
    if (!outName.trim() || !outUrl.trim() || busy) return
    const timeout = Number.parseInt(outTimeout, 10)
    const timeoutMs = Number.isFinite(timeout) && timeout > 0 ? timeout : undefined
    let skillOverrides: Record<string, { name?: string; description?: string }> = {}
    try {
      if (outSkillOverrides.trim() !== '') skillOverrides = JSON.parse(outSkillOverrides) as Record<string, { name?: string; description?: string }>
    } catch {
      setError('skillOverrides must be valid JSON')
      return
    }
    if (editingOut !== null) {
      const updated = await control({
        action: 'outbound.update',
        id: editingOut,
        ...(outName.trim() !== '' ? { name: outName.trim() } : {}),
        ...(outPreset !== '' ? { preset: outPreset } : {}),
        ...(timeoutMs !== undefined ? { timeoutMs } : {}),
        disabledSkills: outDisabledSkills,
        ...(Object.keys(skillOverrides).length > 0 ? { skillOverrides } : {}),
      })
      if (!updated.ok) return
      if (outToken.trim().length > 0) await control({ action: 'outbound.setAuth', id: editingOut, token: outToken.trim() })
      resetOutboundForm()
      return
    }
    const created = await control({
      action: 'outbound.create',
      name: outName.trim(),
      agentCardUrl: outUrl.trim(),
      ...(outPreset !== '' ? { preset: outPreset } : {}),
      ...(timeoutMs !== undefined ? { timeoutMs } : {}),
      disabledSkills: outDisabledSkills,
      ...(Object.keys(skillOverrides).length > 0 ? { skillOverrides } : {}),
    })
    if (!created.ok) return
    const fresh = await fetchSnapshot()
    const newest = fresh.outbounds[0]
    if (newest !== undefined && outToken.trim().length > 0) {
      await control({ action: 'outbound.setAuth', id: newest.id, token: outToken.trim() })
    }
    resetOutboundForm()
  }

  const beginEditOutbound = (v: OutboundServerView): void => {
    setEditingOut(v.id)
    setOutName(v.name)
    setOutUrl(v.agentCardUrl)
    setOutPreset(v.preset ?? presets.find((p) => p.isDefault)?.id ?? '')
    setOutTimeout(String(v.timeoutMs))
    setOutToken('')
    setDiscovered(null)
    setOutDisabledSkills(v.skills.filter((skill) => !skill.enabled).map((skill) => skill.id))
    setOutSkillOverrides('{}')
  }

  const resetOutboundForm = (): void => {
    setEditingOut(null)
    setOutName('')
    setOutUrl('')
    setOutPreset(presets.find((p) => p.isDefault)?.id ?? '')
    setOutTimeout('60000')
    setOutToken('')
    setDiscovered(null)
    setOutDisabledSkills([])
    setOutSkillOverrides('{}')
  }

  const inbounds = snap?.inbounds ?? []
  const outbounds = snap?.outbounds ?? []
  const peers = (snap?.peers ?? []) as readonly InboundPeerView[]
  const tasks = (snap?.tasks ?? []) as readonly TaskView[]
  const sessions = (snap?.sessions ?? []) as readonly SessionView[]
  const metrics = snap?.metrics
  const editingOutbound = outbounds.find((v) => v.id === editingOut)

  const h = (text: string, count?: number): ReactElement => createElement(
    'div', { className: 'dsh-a2a-h3' },
    text,
    count !== undefined ? createElement('span', { className: 'dsh-a2a-count' }, String(count)) : null,
  )
  const empty = (text: string): ReactElement => createElement('div', { className: 'dsh-a2a-empty' }, text)

  const pluginVersion = update?.current || snap?.version || ''
  const updateStatus = updateStatusText(update, updateError)
  const updateTone = updateToneOf(update, updateError)
  const runtime = update?.runtime
  const profile = runtime?.profile ?? 'web'
  const updateCommand = updateCommandFor(profile)
  const copyUpdateCommand = (): void => {
    if (navigator.clipboard === undefined) {
      setNotice('Copy failed, select the command manually')
      return
    }
    navigator.clipboard.writeText(updateCommand)
      .then(() => setNotice('Update command copied'))
      .catch(() => setNotice('Copy failed, select the command manually'))
  }

  return createElement(
    'div',
    { className: 'dsh-a2a-root' },
    createElement(
      'div',
      { className: 'dsh-a2a-section' },
      createElement('p', { className: 'dsh-a2a-intro' }, 'Manage A2A connections of this DSH: inbound servers publish DSH as an Agent (each bound to one agent preset, skills derive automatically); outbound servers connect to and call remote A2A Agents.'),
      // ── version / update strip ───────────────────────────────────────
      createElement('div', { className: 'dsh-a2a-verbar' },
        createElement('div', { className: 'dsh-a2a-verbar-main' },
          createElement('span', { className: 'dsh-a2a-verbar-name' }, 'dsh-a2a'),
          createElement('span', { className: 'dsh-a2a-verbar-version dsh-a2a-mono' }, pluginVersion !== '' ? `v${pluginVersion}` : 'v—'),
          createElement('span', { className: 'dsh-a2a-verbar-status', 'data-tone': updateTone }, updateStatus),
        ),
        createElement('div', { className: 'dsh-a2a-verbar-side' },
          runtime !== undefined
            ? createElement('span', { className: 'dsh-a2a-verbar-runtime' }, `Node ${runtime.node} · ${runtime.platform}/${runtime.arch}`)
            : null,
          createElement('button', { className: 'dsh-a2a-btn', type: 'button', disabled: updateBusy, onClick: () => { void checkUpdate() } }, updateBusy ? 'Checking…' : 'Check for updates'),
        ),
      ),
      update !== undefined && update.hasUpdate
        ? createElement('div', { className: 'dsh-a2a-update-detail' },
            createElement('div', { className: 'dsh-a2a-hint' }, `New version v${update.latest ?? ''} found (current v${update.current}, source ${update.source ?? 'unknown'}). Uninstall the old version before installing the new one; installing directly may pull a stale cached copy. The command uses the current profile (${profile}); restart DSH once after install.`),
            createElement('pre', { className: 'dsh-a2a-command dsh-a2a-mono' }, updateCommand),
            createElement('div', { className: 'dsh-a2a-btn-row' },
              createElement('button', { className: 'dsh-a2a-btn', type: 'button', onClick: copyUpdateCommand }, 'Copy command'),
              update.repoUrl !== null
                ? createElement('a', { className: 'dsh-a2a-link', href: update.repoUrl, target: '_blank', rel: 'noreferrer' }, 'Open repository')
                : null,
            ),
          )
        : null,
      error !== undefined ? createElement('div', { className: 'dsh-a2a-notice dsh-a2a-error' }, `Load failed: ${error}`) : null,
      notice !== undefined ? createElement('div', { className: 'dsh-a2a-notice' }, notice) : null,
      // ── tabs ─────────────────────────────────────────────────────────
      createElement('div', { className: 'dsh-a2a-tabs' },
        createElement('button', { className: 'dsh-a2a-tab', 'data-active': String(tab === 'inbound'), onClick: () => setTab('inbound') }, `Inbound Servers (${inbounds.length})`),
        createElement('button', { className: 'dsh-a2a-tab', 'data-active': String(tab === 'outbound'), onClick: () => setTab('outbound') }, `Outbound Servers (${outbounds.length})`),
        createElement('button', { className: 'dsh-a2a-tab', 'data-active': String(tab === 'activity'), onClick: () => setTab('activity') }, `Connections & tasks (${peers.length} connections · ${sessions.length} sessions)`),
      ),

      // ══ tab: inbound servers ══════════════════════════════════════════
      tab === 'inbound'
        ? createElement('div', { className: 'dsh-a2a-stack' },
            createElement('div', { className: 'dsh-a2a-crew' },
              h('Inbound Servers', inbounds.length),
              inbounds.length === 0
                ? empty('No inbound servers yet. Create one to publish an A2A endpoint.')
                : createElement('div', { className: 'dsh-a2a-card-list' },
                    ...inbounds.map((v) =>
                      createElement('div', { className: 'dsh-a2a-card', key: v.id },
                        createElement('div', { className: 'dsh-a2a-card-head' },
                          createElement('span', { 'data-state': v.enabled ? 'connected' : 'disabled', className: 'dsh-a2a-dot' }),
                          createElement('span', { className: 'dsh-a2a-card-name' }, v.name),
                          createElement('span', { className: 'dsh-a2a-badge' }, presetLabel(presets, v.preset)),
                          createElement('span', { className: 'dsh-a2a-badge dsh-a2a-mono' }, `v${v.version}`),
                          ...(v.trace ? [createElement('span', { className: 'dsh-a2a-badge', key: 'trace' }, 'trace')] : []),
                          createElement('span', { className: 'dsh-a2a-auth' }, v.authTokenEnv !== undefined ? '· auth configured' : '· anonymous'),
                        ),
                        createElement('div', { className: 'dsh-a2a-card-sub dsh-a2a-mono' }, `${v.endpointPath} · ${v.cardUrl ?? v.cardPath}`),
                        v.skills.length > 0
                          ? createElement('div', null, ...v.skills.map((s) => createElement('span', { className: 'dsh-a2a-skill', key: s.id, title: s.description ?? '' }, s.name)))
                          : null,
                        createElement('div', { className: 'dsh-a2a-btn-row' },
                          createElement('button', { className: 'dsh-a2a-btn', disabled: busy, onClick: () => { void control({ action: v.enabled ? 'inbound.disable' : 'inbound.enable', id: v.id }) } }, v.enabled ? 'Disable' : 'Enable'),
                          createElement('button', { className: 'dsh-a2a-btn', disabled: busy, onClick: () => { void openCard(v.id) } }, 'Card'),
                          createElement('button', { className: 'dsh-a2a-btn', disabled: busy, onClick: () => { setTestInbound(v.id); setTestSkill(v.skills[0]?.id ?? 'chat'); setTestResult(undefined) } }, 'Test'),
                          createElement('button', { className: 'dsh-a2a-btn', disabled: busy, onClick: () => beginEditInbound(v) }, 'Edit'),
                          createElement('button', { className: 'dsh-a2a-btn', disabled: busy, onClick: () => { void control({ action: 'inbound.remove', id: v.id }); if (editingIn === v.id) beginCreateInbound() } }, 'Delete'),
                        ),
                      ),
                    ),
                  ),
            ),
            createElement('div', { className: 'dsh-a2a-card' },
              h(editingIn !== null ? 'Edit Inbound Server' : 'New Inbound Server'),
              createElement('form', { className: 'dsh-a2a-form', onSubmit: (ev: { preventDefault(): void }) => { ev.preventDefault(); void submitInbound() } },
                createElement('input', { className: 'dsh-a2a-input', value: inName, placeholder: 'Name', onChange: (e: { target: { value: string } }) => setInName(e.target.value) }),
                createElement('input', { className: 'dsh-a2a-input', value: inVersion, placeholder: 'Version', style: { width: '76px' }, onChange: (e: { target: { value: string } }) => setInVersion(e.target.value) }),
                createElement('select', { className: 'dsh-a2a-select', value: inPreset, onChange: (e: { target: { value: string } }) => setInPreset(e.target.value) },
                  ...presets.map((p) => createElement('option', { value: p.id, key: p.id, title: p.description ?? p.id }, p.name ?? p.id)),
                ),
                createElement('input', { className: 'dsh-a2a-input', type: 'password', value: inToken, placeholder: editingIn !== null ? 'Bearer Token (leave empty to keep, type to update)' : 'Bearer Token (optional)', onChange: (e: { target: { value: string } }) => setInToken(e.target.value) }),
                createElement('label', { className: 'dsh-a2a-hint' },
                  createElement('input', { type: 'checkbox', checked: inTrace, onChange: (e: { target: { checked: boolean } }) => setInTrace(e.target.checked) }),
                  '  Allow trace extension (tool names/redacted summaries, off by default)',
                ),
                createElement('button', { className: 'dsh-a2a-btn dsh-a2a-btn-primary', type: 'submit', disabled: busy || !inName.trim() }, editingIn !== null ? 'Save changes' : 'Create Server'),
                editingIn !== null ? createElement('button', { className: 'dsh-a2a-btn', type: 'button', disabled: busy, onClick: () => beginCreateInbound() }, 'Cancel') : null,
              ),
              editingIn !== null && (snap?.inbounds.find((x) => x.id === editingIn)?.authTokenEnv) !== undefined
                ? createElement('div', { className: 'dsh-a2a-form' },
                    createElement('label', { className: 'dsh-a2a-hint' }, 'Auth is configured.'),
                    createElement('button', { className: 'dsh-a2a-btn', type: 'button', disabled: busy, onClick: () => { setInClearAuth(true); void submitInbound() } }, 'Clear auth'),
                  )
                : null,
              createElement('div', { className: 'dsh-a2a-form' },
                createElement('input', { className: 'dsh-a2a-input', value: inDesc, placeholder: 'Description', style: { flex: 1, minWidth: '220px' }, onChange: (e: { target: { value: string } }) => setInDesc(e.target.value) }),
              ),
              createElement('div', { className: 'dsh-a2a-hint' }, 'Skills derive automatically from the bound preset (everything is a plugin); Bearer Token can stay empty (anonymous).'),
            ),
            createElement('div', { className: 'dsh-a2a-card' },
              h('Built-in test console', undefined),
              createElement('div', { className: 'dsh-a2a-form' },
                createElement('select', {
                  className: 'dsh-a2a-select',
                  value: testInbound,
                  onChange: (e: { target: { value: string } }) => {
                    setTestInbound(e.target.value)
                    const inbound = inbounds.find((v) => v.id === e.target.value)
                    setTestSkill(inbound?.skills[0]?.id ?? 'chat')
                  },
                }, ...inbounds.map((v) => createElement('option', { value: v.id, key: v.id }, v.name))),
                createElement('input', { className: 'dsh-a2a-input', value: testSkill, placeholder: 'skill', style: { width: '120px' }, onChange: (e: { target: { value: string } }) => setTestSkill(e.target.value) }),
                createElement('input', { className: 'dsh-a2a-input', value: testContext, placeholder: 'contextId (optional)', style: { width: '180px' }, onChange: (e: { target: { value: string } }) => setTestContext(e.target.value) }),
                createElement('input', { className: 'dsh-a2a-input', value: testText, placeholder: 'Send a test message', style: { flex: 1, minWidth: '220px' }, onChange: (e: { target: { value: string } }) => setTestText(e.target.value) }),
                createElement('button', { className: 'dsh-a2a-btn dsh-a2a-btn-primary', type: 'button', disabled: busy || testInbound === '' || testText.trim() === '', onClick: () => { void submitTest() } }, 'Send'),
              ),
              testResult !== undefined
                ? createElement('pre', { className: 'dsh-a2a-detail' }, JSON.stringify(testResult, null, 2))
                : null,
            ),
            cardView !== undefined
              ? createElement('div', { className: 'dsh-a2a-card' },
                  h('AgentCard JSON'),
                  createElement('pre', { className: 'dsh-a2a-detail' }, JSON.stringify(cardView, null, 2)),
                  createElement('div', { className: 'dsh-a2a-btn-row' },
                    createElement('button', { className: 'dsh-a2a-btn', type: 'button', onClick: () => setCardView(undefined) }, 'Close'),
                  ),
                )
              : null,
          )
        : null,

      // ══ tab: outbound servers ═════════════════════════════════════════
      tab === 'outbound'
        ? createElement('div', { className: 'dsh-a2a-stack' },
            createElement('div', { className: 'dsh-a2a-crew' },
              h('Outbound Servers', outbounds.length),
              outbounds.length === 0
                ? empty('No outbound servers yet. Add a remote A2A connection to register its skills as model tools.')
                : createElement('div', { className: 'dsh-a2a-card-list' },
                    ...outbounds.map((v) =>
                      createElement('div', { className: 'dsh-a2a-card', key: v.id },
                        createElement('div', { className: 'dsh-a2a-card-head' },
                          createElement('span', { 'data-state': dotState(v.state), className: 'dsh-a2a-dot' }),
                          createElement('span', { className: 'dsh-a2a-card-name' }, v.name),
                          createElement('span', { className: 'dsh-a2a-badge' }, presetLabel(presets, v.preset)),
                          v.agentVersion !== undefined
                            ? createElement('span', { className: 'dsh-a2a-badge dsh-a2a-mono' }, `v${v.agentVersion}`)
                            : null,
                          createElement('span', { className: 'dsh-a2a-auth' }, `· ${v.state} · tools ${v.toolCount}/${v.skillCount}`),
                        ),
                        createElement('div', { className: 'dsh-a2a-card-sub dsh-a2a-mono' }, v.agentCardUrl),
                        v.lastError !== undefined ? createElement('div', { className: 'dsh-a2a-notice dsh-a2a-error' }, v.lastError) : null,
                        createElement('div', { className: 'dsh-a2a-btn-row' },
                          createElement('button', { className: 'dsh-a2a-btn', disabled: busy, onClick: () => { void control({ action: v.enabled ? 'outbound.disable' : 'outbound.enable', id: v.id }) } }, v.enabled ? 'Disable' : 'Enable'),
                          createElement('button', { className: 'dsh-a2a-btn', disabled: busy, onClick: () => { void control({ action: 'outbound.refresh', id: v.id }) } }, 'Refresh'),
                          createElement('button', { className: 'dsh-a2a-btn', disabled: busy, onClick: () => beginEditOutbound(v) }, 'Edit'),
                          createElement('button', { className: 'dsh-a2a-btn', disabled: busy, onClick: () => { void control({ action: 'outbound.remove', id: v.id }); if (editingOut === v.id) resetOutboundForm() } }, 'Delete'),
                        ),
                      ),
                    ),
                  ),
            ),
            createElement('div', { className: 'dsh-a2a-card' },
              h(editingOut !== null ? 'Edit Outbound Server' : 'Add Outbound Server'),
              createElement('form', { className: 'dsh-a2a-form', onSubmit: (ev: { preventDefault(): void }) => { ev.preventDefault(); void doDiscover() } },
                createElement('input', { className: 'dsh-a2a-input', value: outName, placeholder: 'Name', onChange: (e: { target: { value: string } }) => setOutName(e.target.value) }),
                createElement('input', { className: 'dsh-a2a-input', value: outUrl, placeholder: 'Remote AgentCard URL', style: { flex: 1, minWidth: '220px' }, onChange: (e: { target: { value: string } }) => { setOutUrl(e.target.value); setDiscovered(null) } }),
                createElement('input', { className: 'dsh-a2a-input', type: 'password', value: outToken, placeholder: 'Bearer Token (optional)', onChange: (e: { target: { value: string } }) => setOutToken(e.target.value) }),
                createElement('select', { className: 'dsh-a2a-select', value: outPreset, onChange: (e: { target: { value: string } }) => setOutPreset(e.target.value) },
                  ...presets.map((p) => createElement('option', { value: p.id, key: p.id, title: p.description ?? p.id }, p.name ?? p.id)),
                ),
                createElement('input', { className: 'dsh-a2a-input', value: outTimeout, placeholder: 'Timeout ms', style: { width: '90px' }, onChange: (e: { target: { value: string } }) => setOutTimeout(e.target.value) }),
                editingOutbound !== undefined
                  ? createElement('div', { className: 'dsh-a2a-skill-list' },
                      createElement('div', { className: 'dsh-a2a-skill-list-title' }, 'Skills (check to enable)'),
                      ...editingOutbound.skills.map((skill) => createElement('label', { key: skill.id, className: 'dsh-a2a-skill-toggle' },
                        createElement('input', {
                          type: 'checkbox',
                          checked: !outDisabledSkills.includes(skill.id),
                          onChange: () => toggleOutboundSkill(skill.id),
                        }),
                        ` ${skill.name}${skill.description !== undefined ? ` — ${skill.description}` : ''}`,
                      )),
                      createElement('input', {
                        className: 'dsh-a2a-input',
                        value: outSkillOverrides,
                        placeholder: 'per-skill override JSON, e.g. {"chat":{"description":"..."}}',
                        onChange: (e: { target: { value: string } }) => setOutSkillOverrides(e.target.value),
                      }),
                    )
                  : null,
                editingOut === null
                  ? createElement('button', { className: 'dsh-a2a-btn', type: 'submit', disabled: busy || discovering || !outUrl.trim() }, discovering ? 'Reading…' : 'Import')
                  : null,
                createElement('button', { className: 'dsh-a2a-btn dsh-a2a-btn-primary', type: 'button', disabled: busy || (editingOut === null && discovered === null) || !outName.trim() || !outUrl.trim(), onClick: () => { void submitOutbound() } },
                  editingOut !== null ? 'Save changes' : 'Connect'),
                editingOut !== null ? createElement('button', { className: 'dsh-a2a-btn', type: 'button', disabled: busy, onClick: () => resetOutboundForm() }, 'Cancel') : null,
              ),
              discovered !== null
                ? createElement('div', { className: 'dsh-a2a-preview' },
                    createElement('div', { className: 'dsh-a2a-preview-head' },
                      createElement('span', { 'data-state': 'connected', className: 'dsh-a2a-dot' }),
                      createElement('span', { className: 'dsh-a2a-preview-name' }, discovered.name),
                      discovered.version !== undefined ? createElement('span', { className: 'dsh-a2a-preview-meta dsh-a2a-mono' }, `v${discovered.version}`) : null,
                    ),
                    discovered.description !== undefined ? createElement('div', { className: 'dsh-a2a-preview-desc' }, discovered.description) : null,
                    discovered.skills.length > 0
                      ? createElement('div', { className: 'dsh-a2a-skill-list' },
                          createElement('div', { className: 'dsh-a2a-skill-list-title' }, `Skills (${discovered.skills.length})`),
                          ...discovered.skills.map((s) => createElement('div', { key: s.id }, `• ${s.name}${s.description !== undefined ? ` — ${s.description}` : ''}`)),
                        )
                      : null,
                    createElement('div', { className: 'dsh-a2a-preview-meta dsh-a2a-mono' }, `Endpoint ${discovered.endpoint}`),
                    createElement('div', { className: 'dsh-a2a-btn-row' },
                      createElement('button', { className: 'dsh-a2a-btn dsh-a2a-btn-primary', disabled: busy || !outName.trim(), onClick: () => { void submitOutbound() } }, 'Connect'),
                      createElement('button', { className: 'dsh-a2a-btn', disabled: busy, onClick: () => { setDiscovered(null); setOutUrl('') } }, 'Cancel'),
                    ),
                  )
                : createElement('div', { className: 'dsh-a2a-hint' }, editingOut === null ? 'Enter a remote AgentCard URL and click "Import" to read its name, description, skills and endpoint; the connection is created after confirmation.' : 'Saving applies name/preset/timeout and token changes and rebuilds the connection.'),
            ),
          )
        : null,

      // ══ tab: activity (inbound peers + tasks) ═════════════════════════
      tab === 'activity'
        ? createElement('div', { className: 'dsh-a2a-stack' },
            createElement('div', { className: 'dsh-a2a-crew' },
              h('Metrics'),
              metrics !== undefined
                ? createElement('div', { className: 'dsh-a2a-metrics' },
                    createElement('span', null, `Requests ${metrics.requests} · auth failures ${metrics.authFailures}`),
                    createElement('span', null, `Tasks ${metrics.tasks.created} (done ${metrics.tasks.completed} / failed ${metrics.tasks.failed} / canceled ${metrics.tasks.canceled} / interrupted ${metrics.tasks.interrupted})`),
                    createElement('span', null, `avg ${metrics.tasks.avgDurationMs}ms · max ${metrics.tasks.maxDurationMs}ms`),
                    createElement('span', null, `Outbound ${metrics.outbound.calls} (errors ${metrics.outbound.errors}, avg ${metrics.outbound.avgDurationMs}ms)`),
                  )
                : empty('No metrics yet.'),
              metrics !== undefined && metrics.audit.length > 0
                ? createElement('div', { className: 'dsh-a2a-table-wrap' },
                    createElement('table', { className: 'dsh-a2a-table' },
                      createElement('thead', null, createElement('tr', null,
                        createElement('th', null, 'Time'),
                        createElement('th', null, 'Event'),
                        createElement('th', null, 'Instance / Task'),
                        createElement('th', null, 'Details'),
                      )),
                      createElement('tbody', null,
                        ...metrics.audit.slice(-20).reverse().map((event, index) => createElement('tr', { key: `${event.at}-${index}` },
                          createElement('td', null, event.at),
                          createElement('td', null, event.kind),
                          createElement('td', null, event.serverId ?? event.taskId ?? '-'),
                          createElement('td', null, event.detail ?? event.method ?? event.source ?? '-'),
                        )),
                      ),
                    ),
                  )
                : null,
            ),
            createElement('div', { className: 'dsh-a2a-crew' }, h('Inbound connections (who calls this service)', peers.length),
              peers.length === 0
                ? empty('No inbound connections yet. They appear here once other A2A clients call this DSH endpoint.')
                : createElement('div', { className: 'dsh-a2a-table-wrap' },
                    createElement('table', { className: 'dsh-a2a-table' },
                      createElement('thead', null, createElement('tr', null,
                        createElement('th', null, 'Source'),
                        createElement('th', null, 'Task'),
                        createElement('th', null, 'Streaming'),
                        createElement('th', null, 'First / Last'),
                        createElement('th', null, 'Actions'),
                      )),
                      createElement('tbody', null,
                        ...peers.map((p) => createElement('tr', { key: p.id },
                          createElement('td', null, p.source ?? p.label),
                          createElement('td', null, `${p.taskCount} (active ${p.activeTaskIds.length})`),
                          createElement('td', null, p.streaming ? '●' : '—'),
                          createElement('td', null, createElement('span', { className: 'dsh-a2a-card-sub' }, `${p.firstSeen ?? ''} / ${p.lastSeen ?? ''}`)),
                          createElement('td', null, createElement('button', { className: 'dsh-a2a-btn', disabled: busy, onClick: () => { void control({ action: 'inbound.close', id: p.id }) } }, 'Close')),
                        )),
                      ),
                    ),
                  ),
            ),
            createElement('div', { className: 'dsh-a2a-crew' },
              h('Inbound sessions (by contextId)', sessions.length),
              sessions.length === 0
                ? empty('No sessions yet. When other A2A clients call this service with a contextId, a session row appears here.')
                : createElement('div', { className: 'dsh-a2a-table-wrap' },
                    createElement('table', { className: 'dsh-a2a-table' },
                      createElement('thead', null, createElement('tr', null,
                        createElement('th', null, 'Session'),
                        createElement('th', null, 'Instance'),
                        createElement('th', null, 'Preset'),
                        createElement('th', null, 'State'),
                        createElement('th', null, 'Task'),
                        createElement('th', null, 'Streaming'),
                        createElement('th', null, 'First / Last'),
                        createElement('th', null, 'Actions'),
                      )),
                      createElement('tbody', null,
                        ...sessions.map((s) => createElement('tr', { key: `${s.serverId ?? ''}/${s.contextId}` },
                          createElement('td', null, createElement('span', { className: 'dsh-a2a-card-sub dsh-a2a-mono' }, s.contextId)),
                          createElement('td', null, s.serverName ?? s.serverId ?? '-'),
                          createElement('td', null, s.preset ?? '-'),
                          createElement('td', null,
                            createElement('span', { 'data-state': s.status === 'running' ? 'connected' : undefined, className: 'dsh-a2a-dot' }),
                            ` ${s.status === 'running' ? 'running' : 'idle'}`,
                          ),
                          createElement('td', null, `${s.taskCount} (active ${s.activeCount})`),
                          createElement('td', null, s.streaming ? '●' : '—'),
                          createElement('td', null, createElement('span', { className: 'dsh-a2a-card-sub' }, `${s.firstSeen} / ${s.lastSeen}`)),
                          createElement('td', null,
                            createElement('button', { className: 'dsh-a2a-btn', disabled: busy || s.activeCount === 0, onClick: () => { void control({ action: 'session.cancel', id: s.contextId, ...(s.serverId !== undefined ? { serverId: s.serverId } : {}) }) } }, 'Cancel active'),
                            createElement('button', { className: 'dsh-a2a-btn', disabled: busy, onClick: () => { void openConversation(s.contextId, s.serverId) } }, 'Conversation'),
                            createElement('button', { className: 'dsh-a2a-btn', disabled: busy, onClick: () => { void control({ action: 'session.close', id: s.contextId, ...(s.serverId !== undefined ? { serverId: s.serverId } : {}) }) } }, 'Close'),
                          ),
                        )),
                      ),
                    ),
                  ),
            ),
            conversation !== undefined
              ? createElement('div', { className: 'dsh-a2a-crew' },
                  h(`Session conversation (${conversationKey})`),
                  createElement('pre', { className: 'dsh-a2a-detail' }, JSON.stringify(conversation, null, 2)),
                )
              : null,
            createElement('div', { className: 'dsh-a2a-crew' },
              h('Task', tasks.length),
              createElement('div', { className: 'dsh-a2a-form' },
                createElement('select', {
                  className: 'dsh-a2a-select',
                  value: taskFilter,
                  onChange: (e: { target: { value: string } }) => { setTaskFilter(e.target.value); setTaskLimit(50) },
                },
                  createElement('option', { value: '' }, 'All states'),
                  createElement('option', { value: 'TASK_STATE_WORKING' }, 'WORKING'),
                  createElement('option', { value: 'TASK_STATE_COMPLETED' }, 'COMPLETED'),
                  createElement('option', { value: 'TASK_STATE_FAILED' }, 'FAILED'),
                  createElement('option', { value: 'TASK_STATE_CANCELED' }, 'CANCELED'),
                  createElement('option', { value: 'TASK_STATE_INPUT_REQUIRED' }, 'INPUT_REQUIRED'),
                  createElement('option', { value: 'TASK_STATE_AUTH_REQUIRED' }, 'AUTH_REQUIRED'),
                ),
                createElement('span', { className: 'dsh-a2a-hint' }, `${snap?.taskTotal ?? tasks.length} total, showing ${tasks.length}`),
                snap?.taskNextOffset !== null && snap?.taskNextOffset !== undefined
                  ? createElement('button', { className: 'dsh-a2a-btn', type: 'button', onClick: () => setTaskLimit((current) => current + 50) }, 'Load more')
                  : null,
              ),
              tasks.length === 0
                ? empty('No tasks yet.')
                : createElement('div', { className: 'dsh-a2a-table-wrap' },
                    createElement('table', { className: 'dsh-a2a-table' },
                      createElement('thead', null, createElement('tr', null,
                        createElement('th', null, 'ID'),
                        createElement('th', null, 'Skill'),
                        createElement('th', null, 'Source'),
                        createElement('th', null, 'State'),
                        createElement('th', null, 'Actions'),
                      )),
                      createElement('tbody', null,
                        ...tasks.map((t) => createElement('tr', { key: t.id },
                          createElement('td', null, createElement('button', { className: 'dsh-a2a-link dsh-a2a-mono', type: 'button', onClick: () => { void openTask(t.id) } }, t.id)),
                          createElement('td', null, t.metadata?.skill ?? '-'),
                          createElement('td', null, t.metadata?.serverId ?? t.serverId ?? '-'),
                          createElement('td', null, t.status?.state ?? '-'),
                          createElement('td', null, createElement('button', { className: 'dsh-a2a-btn', disabled: busy, onClick: () => { void control({ action: 'task.cancel', id: t.id }) } }, 'Cancel')),
                        )),
                      ),
                    ),
                  ),
              selectedTask !== undefined
                ? createElement('pre', { className: 'dsh-a2a-detail' }, JSON.stringify(selectedTask, null, 2))
                : null,
            ),
          )
        : null,

      createElement('div', { className: 'dsh-a2a-footer' }, 'Auto-refresh every 3 seconds.'),
    ),
  )
}