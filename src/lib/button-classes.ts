const base =
  'rounded-lg px-5 py-2.5 text-center font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500'

const variants = {
  primary:
    'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-600',
  secondary:
    'border border-slate-300 hover:bg-slate-100 active:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent dark:border-slate-700 dark:hover:bg-slate-800 dark:active:bg-slate-700',
}

/** Shared by <button> and router <Link> so both look identical. */
export function buttonClasses(variant: keyof typeof variants) {
  return `${base} ${variants[variant]}`
}

/** "← Quiz title" link above a page heading. Padding grows the tap target without moving the layout. */
export const backLinkClasses =
  '-my-2 inline-block rounded-sm py-2 text-sm text-sky-700 hover:underline dark:text-sky-400'
