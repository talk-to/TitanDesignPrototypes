/**
 * DEV OVERLAY — design-branch only. Never ships.
 *
 * A small draggable widget for switching between UI options live, so one build
 * can show several directions in a stakeholder review.
 *
 * Mounted by a single marked block in the app entry (`src/index.js` in nike):
 *
 *   /* TITAN-DEV-OVERLAY:START — design branch only, strip before handoff *\/
 *   import '@vanguard/dev-overlay';
 *   /* TITAN-DEV-OVERLAY:END *\/
 *
 * The markers make removal deterministic: handoff deletes between them rather
 * than hunting for an import, and `git grep TITAN-DEV-OVERLAY` is the canonical
 * check that nothing was left behind.
 *
 * Guarded three ways: it no-ops in production, it renders nothing when
 * `variants.config.ts` is empty, and it never mounts twice.
 *
 * Edit `variants.config.ts` to add controls. Nothing else here needs touching.
 */

import React, { useCallback, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { VARIANTS, TVariantGroup } from './variants.config';
import {
  resetVariants,
  setVariant,
  useAllVariants,
} from './variant-store';
import './dev-overlay.less';

const POSITION_KEY = '__titanDesignOverlayPos';
const COLLAPSED_KEY = '__titanDesignOverlayCollapsed';
const CONTAINER_ID = 'titan-dev-overlay-root';

type TPos = { x: number; y: number };

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

/** 2 options reads best as a toggle, 3-4 as tabs, more as a dropdown. */
const controlFor = (group: TVariantGroup) => {
  if (group.control) return group.control;
  if (group.options.length <= 2) return 'toggle';
  if (group.options.length <= 4) return 'tabs';
  return 'dropdown';
};

const VariantControl = ({
  group,
  value,
}: {
  group: TVariantGroup;
  value: string;
}) => {
  const kind = controlFor(group);

  if (kind === 'dropdown') {
    return (
      <select
        className="tdo-select"
        value={value}
        aria-label={group.label}
        onChange={e => setVariant(group.key, e.target.value)}
        data-test-id={`dev-overlay-select-${group.key}`}
      >
        {group.options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  // Toggle and tabs are the same control at different widths - a row of
  // buttons where exactly one is active.
  return (
    <div className={`tdo-segmented tdo-segmented--${kind}`} role="group" aria-label={group.label}>
      {group.options.map(option => (
        <button
          key={option}
          type="button"
          className={`tdo-segment${option === value ? ' is-active' : ''}`}
          aria-pressed={option === value}
          onClick={() => setVariant(group.key, option)}
          data-test-id={`dev-overlay-option-${group.key}-${option}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

const DevOverlay = () => {
  const values = useAllVariants();
  const [pos, setPos] = useState<TPos>(() =>
    readJson<TPos>(POSITION_KEY, { x: 16, y: 16 })
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() =>
    readJson<boolean>(COLLAPSED_KEY, false)
  );
  const dragOffset = useRef<TPos | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragOffset.current) return;
    // Clamp so the widget can never be dragged fully off screen and lost.
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 40;
    setPos({
      x: Math.min(Math.max(0, e.clientX - dragOffset.current.x), maxX),
      y: Math.min(Math.max(0, e.clientY - dragOffset.current.y), maxY),
    });
  };

  const onPointerUp = () => {
    if (!dragOffset.current) return;
    dragOffset.current = null;
    writeJson(POSITION_KEY, pos);
  };

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed(prev => {
      writeJson(COLLAPSED_KEY, !prev);
      return !prev;
    });
  }, []);

  // Count how many groups are off their default, so the collapsed pill can say
  // whether anything is currently overridden.
  const changed = VARIANTS.filter(
    group => values[group.key] !== group.options[0]
  ).length;

  return (
    <div
      className={`tdo${isCollapsed ? ' is-collapsed' : ''}`}
      style={{ left: pos.x, top: pos.y }}
      data-test-id="dev-overlay"
    >
      <div
        className="tdo-header"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        data-test-id="dev-overlay-header"
      >
        <span className="tdo-grip" aria-hidden="true">⠿</span>
        <span className="tdo-title">
          Design
          {changed > 0 ? <span className="tdo-badge">{changed}</span> : null}
        </span>
        <button
          type="button"
          className="tdo-icon-btn"
          onClick={toggleCollapsed}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? 'Expand design options' : 'Collapse design options'}
          data-test-id="dev-overlay-collapse"
        >
          {isCollapsed ? '+' : '–'}
        </button>
      </div>

      {isCollapsed ? null : (
        <div className="tdo-body">
          {VARIANTS.map(group => (
            <div className="tdo-group" key={group.key}>
              <div className="tdo-label">{group.label}</div>
              <VariantControl group={group} value={values[group.key]} />
              {group.hint ? <div className="tdo-hint">{group.hint}</div> : null}
            </div>
          ))}
          {changed > 0 ? (
            <button
              type="button"
              className="tdo-reset"
              onClick={resetVariants}
              data-test-id="dev-overlay-reset"
            >
              Reset to defaults
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

const mount = () => {
  if (process.env.NODE_ENV === 'production') return;
  if (VARIANTS.length === 0) return;
  if (typeof document === 'undefined') return;
  if (document.getElementById(CONTAINER_ID)) return;

  const container = document.createElement('div');
  container.id = CONTAINER_ID;
  document.body.appendChild(container);
  createRoot(container).render(<DevOverlay />);
};

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
}

export { useVariant } from './variant-store';
export default DevOverlay;
