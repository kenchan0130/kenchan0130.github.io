declare module 'autocomplete.js' {
  const autocomplete: {
    (
      selector: any,
      options: any,
      datasets: any,
      typeaheadObject?: any,
      ...args: any[]
    ): any
    noConflict: () => typeof autocomplete
    escapeHighlightedString: (
      str: any,
      highlightPreTag: any,
      highlightPostTag: any
    ) => string
    sources: {
      hits: {
        (index: any, params: any): (query: any, cb: any) => void
      }
      popularIn: any
    }
  }
  export default autocomplete
}
