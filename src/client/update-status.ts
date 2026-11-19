/**
 * Pure presentation helpers for the version/update strip.
 *
 * Kept free of React and DOM so the "unknown is not up to date" rule and the
 * profile-specific update command are unit-testable without a browser.
 * @module dsh-a2a/client/update-status
 */

/** The host's update-check answer (mirrors src/update.ts `UpdateInfo`). */
export interface UpdateInfo {
  readonly ok: boolean
  readonly current: string
  readonly latest: string | null
  readonly hasUpdate: boolean
  readonly ahead: boolean
  readonly error: string | null
  readonly source: 'npm' | 'github' | null
  readonly repoUrl: string | null
  readonly cached: boolean
  readonly runtime: {
    readonly node: string
    readonly platform: string
    readonly arch: string
    readonly profile: string | null
  }
}

/** Visual tone for the version-strip status text. */
export type UpdateTone = 'pending' | 'update' | 'ok' | 'unknown'

/** Human-readable status; a failed lookup never reads as "up to date". */
export function updateStatusText(update: UpdateInfo | undefined, error: string | undefined): string {
  if (error !== undefined) return `Update check failed: ${error}`
  if (update === undefined) return 'Checking for updates…'
  if (update.hasUpdate) return `New version v${update.latest ?? ''} available`
  if (!update.ok) return `Cannot fetch the latest version right now (${update.error ?? 'network'}) — this does not mean everything is fine`
  if (update.ahead) return `Local version is newer than the published one (${update.latest ?? ''})`
  return `Up to date (v${update.latest ?? ''})`
}

/** Tone paired with {@link updateStatusText}. */
export function updateToneOf(update: UpdateInfo | undefined, error: string | undefined): UpdateTone {
  if (error !== undefined) return 'unknown'
  if (update === undefined) return 'pending'
  if (update.hasUpdate) return 'update'
  return update.ok ? 'ok' : 'unknown'
}

/**
 * Two-step update command for the given profile (`remove`, then `add`).
 * A missing or malformed profile falls back to `web`; the value is only
 * displayed and copied, never executed.
 */
export function updateCommandFor(profile: string | null | undefined): string {
  const candidate = profile ?? ''
  const name = /^[A-Za-z0-9._-]+$/.test(candidate) ? candidate : 'web'
  return [
    `dsh plugin --profile ${name} remove @hanphone/dsh-a2a`,
    `dsh plugin --profile ${name} add @hanphone/dsh-a2a`,
  ].join('\n')
}
