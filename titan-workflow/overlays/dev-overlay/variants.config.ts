/**
 * THE ONLY FILE A DESIGNER EDITS.
 *
 * List the things you want to switch between while reviewing. Each group
 * becomes one control in the widget. Add and remove groups freely as the work
 * goes - the widget re-reads this on reload.
 *
 * An empty list means the widget renders nothing at all, so a project with no
 * iterations to compare costs you nothing.
 */

export type TVariantGroup = {
  /**
   * Stable id, used in `data-titan-design-variant-<key>` and
   * `useVariant('<key>')`. Keep it short - you type it in every CSS selector.
   */
  key: string;
  /** What the stakeholder sees above the control. */
  label: string;
  /**
   * First option is the default. Order them the way you want them read - the
   * current/original design usually reads best first.
   */
  options: string[];
  /**
   * Optional. Left out, it is chosen for you: 2 options -> toggle,
   * 3-4 -> tabs, 5+ -> dropdown.
   */
  control?: 'toggle' | 'tabs' | 'dropdown';
  /** Optional one-liner shown under the control, for a stakeholder's benefit. */
  hint?: string;
};

export const VARIANTS: TVariantGroup[] = [
  // Delete this example and add your own.
  //
  // {
  //   key: 'hero',
  //   label: 'Hero layout',
  //   options: ['split', 'stacked'],
  //   hint: 'Split puts the illustration beside the copy.',
  // },
];
