/** A labelled correct or chosen answer: inline for one text, a list for several. */
export function AnswerList({
  label,
  labelClass,
  texts,
  textClass = 'text-sm',
}: {
  label: string
  labelClass: string
  texts: Array<string>
  /** Font size of the whole block. */
  textClass?: string
}) {
  return (
    <div className={`mt-2 first-of-type:mt-3 ${textClass}`}>
      <span className={`font-semibold ${labelClass}`}>{label}:</span>
      {texts.length === 1 ? (
        <span> {texts[0]}</span>
      ) : (
        <ul className="mt-1 list-disc pl-5">
          {texts.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
