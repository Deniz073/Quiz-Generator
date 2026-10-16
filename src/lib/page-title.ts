export const SITE_TITLE = 'Quiz Generator'

/** Browser tab title: "Mock exam – AZ-900 … – Quiz Generator". Most specific part first. */
export function pageTitle(...parts: Array<string | undefined>) {
  return [...parts, SITE_TITLE].filter(Boolean).join(' – ')
}
