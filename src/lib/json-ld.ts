/** JSON-LD text for a <script type="application/ld+json"> element. */
export function jsonLdText(data: unknown): string {
  // HTML script data cannot contain a raw "</" sequence.
  // JSON.stringify does not escape U+003C. `\u003c` is the JSON spelling of
  // the HTML `\x3C` escape (W3C JSON-LD 1.1 §7.2 also allows `&lt;`).
  // Cite: https://html.spec.whatwg.org/multipage/scripting.html#restrictions-for-contents-of-script-elements
  // Cite: https://www.w3.org/TR/json-ld11/#restrictions-for-contents-of-json-ld-script-elements
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
