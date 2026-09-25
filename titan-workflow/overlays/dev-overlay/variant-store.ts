/**
 * Variant state for the dev overlay.
 *
 * Two ways to consume a variant, both fed from here:
 *
 *  1. CSS  - `data-titan-design-variant-<key>="<value>"` is set on <html>, so
 *            styles can switch with no change to any component file:
 *              html[data-titan-design-variant-hero='stacked'] .hero {
 *                flex-direction: column;
 *              }
 *
 *  2. Hook - `useVariant('hero')` for structural differences (a different
 *            component, different copy) that CSS cannot express.
 *
 * Prefer (1) where it works: it leaves no trace in component code, so there is
 * nothing to collapse at handoff.
 *
 * Selections persist in localStorage so a reload mid-review loses nothing.
 */

import { useSyncExternalStore } from 'react';
import { VARIANTS } from './variants.config';

const STORAGE_KEY = '__titanDesignVariants';

/**
 * Deliberately long. `data-v-` was the original choice and was wrong twice over:
 * it is Vue's scoped-style prefix, and nike already owns a `data-titan-*`
 * product namespace (`data-titan-email-file-id`). This string cannot plausibly
 * appear for any other reason, which is what makes the handoff grep trustworthy.
 */
const ATTR_PREFIX = 'data-titan-design-variant-';

type TState = Record<string, string>;

const listeners = new Set<() => void>();

/** Defaults are the first option of every group. */
const defaults = (): TState =>
  VARIANTS.reduce<TState>((acc, group) => {
    if (group.options.length > 0) {
      acc[group.key] = group.options[0];
    }
    return acc;
  }, {});

const read = (): TState => {
  const base = defaults();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return base;
    // Only trust keys and values that still exist in the config, so a renamed
    // or deleted group cannot resurrect a stale selection.
    return VARIANTS.reduce<TState>((acc, group) => {
      const stored = parsed[group.key];
      if (typeof stored === 'string' && group.options.includes(stored)) {
        acc[group.key] = stored;
      }
      return acc;
    }, base);
  } catch {
    return base;
  }
};

let state: TState = typeof window === 'undefined' ? {} : read();

/** Mirrors state onto <html> so stylesheets can select on it. */
const applyToDom = () => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Drop attributes for groups that no longer exist. Without this, deleting a
  // group from the config leaves its attribute on <html> for the rest of the
  // session, so a stale selector keeps matching through a hot reload - exactly
  // when a designer is editing the config mid-review.
  Array.from(root.attributes)
    .map(attr => attr.name)
    .filter(name => name.startsWith(ATTR_PREFIX))
    .filter(name => !(name.slice(ATTR_PREFIX.length) in state))
    .forEach(name => root.removeAttribute(name));

  Object.entries(state).forEach(([key, value]) => {
    root.setAttribute(`${ATTR_PREFIX}${key}`, value);
  });
};

export const getVariants = (): TState => state;

export const setVariant = (key: string, value: string) => {
  state = { ...state, [key]: value };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // A full or blocked localStorage should not break the review.
  }
  applyToDom();
  listeners.forEach(fn => fn());
};

export const resetVariants = () => {
  state = defaults();
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  applyToDom();
  listeners.forEach(fn => fn());
};

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

/** Set the attributes once at import time, before anything renders. */
applyToDom();

/**
 * The current value of one variant group.
 *
 * Returns the group's default if the key is unknown, so a typo degrades to the
 * original design rather than crashing a review.
 */
export const useVariant = (key: string): string => {
  const all = useSyncExternalStore(subscribe, getVariants, getVariants);
  const group = VARIANTS.find(g => g.key === key);
  return all[key] ?? group?.options[0] ?? '';
};

export const useAllVariants = (): TState =>
  useSyncExternalStore(subscribe, getVariants, getVariants);
