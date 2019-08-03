/* eslint no-underscore-dangle:[0] */

export const UNKNOWN = "UNKNOWN"; // sync has never run, but there are no pending changes either
export const SYNCED = "SYNCED"; // no pending changes
export const PENDING = "PENDING"; // there are pending changes since last sync
export const RUNNING = "RUNNING"; // sync is currently executing
export const FAILED = "FAILED"; // last sync failed

export function getLocalActions(state) {
  return (state._sync && state._sync.localActions) || [];
}

export function getSyncState(state) {
  const { startedAt = 0, succeededAt = 0, failedAt = 0 } = state._sync || {};
  if (startedAt > succeededAt && startedAt > failedAt) {
    return RUNNING;
  }
  if (failedAt >= succeededAt) {
    return FAILED;
  }
  if (getLocalActions(state).length) {
    return PENDING;
  }
  return succeededAt > 0 ? SYNCED : UNKNOWN;
}

export function isSyncRunning(state) {
  return getSyncState(state) === RUNNING;
}
