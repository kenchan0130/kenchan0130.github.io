import * as algoliasearch from 'algoliasearch/lite'
import autocomplete from 'autocomplete.js'
import { RequestOptions } from '@algolia/transporter'
import { SearchOptions, SearchResponse } from '@algolia/client-search'

type AlgoliaResult = {
  fullyHighlighted?: boolean
  matchedWords: string[]
  matchLevel: string
  value: string
}

type Suggestion = {
  categories: string[]
  content: string
  date: number
  excerpt_html: string
  excerpt_text: string
  headings: string[]
  html: string
  objectID: string
  outline: string
  permalink: string
  slug: string
  tags: string[]
  title: string
  type: string
  url: string
  _highlightResult: {
    categories: AlgoliaResult[]
    content: AlgoliaResult
    html: AlgoliaResult
    tags: AlgoliaResult[]
    title: AlgoliaResult
  }
  _snippetResult: {
    content: {
      matchLevel: string
      value: string
    }
  }
}

const newHitsSource = (
  index: algoliasearch.SearchIndex,
  params?: RequestOptions & SearchOptions
) => {
  return async (
    query: string,
    cb: (hits: Suggestion[], res?: SearchResponse) => void
  ) => {
    try {
      const res = await index.search(query, params)
      cb(res.hits as Suggestion[], res)
    } catch (e) {
      console.error(e)
      cb([])
    }
  }
}

const toString = (node: Node): string => {
  const div = document.createElement('div')
  div.appendChild(node)
  return div.innerHTML
}

const client = algoliasearch.default(
  'DEFR5IK9E2',
  'e46cd2115fe449f4b27a68bf16eaacb7'
)
const index = client.initIndex('kenchan0130_blog')

$(() => {
  autocomplete(
    '#js-search-input',
    {
      hint: false,
      openOnFocus: true,
      templates: {
        footer:
          '<div class="aa-branding"><img src="https://res.cloudinary.com/hilnmyskv/image/upload/q_auto/v1611661165/Algolia_com_Website_assets/images/shared/algolia_logo/search-by-algolia-light-background.svg"/></div>',
      },
    },
    [
      {
        source: newHitsSource(index, { hitsPerPage: 4 }),
        displayKey: 'name',
        templates: {
          suggestion: (suggestion: Suggestion) => {
            const suggestionTemplate = document.querySelector(
              '#suggestion-template'
            ) as HTMLTemplateElement | null
            const rawTemplateContent = suggestionTemplate?.content
            if (!rawTemplateContent) {
              console.error('Suggestion template is not found.')
              return
            }
            // Deep copy
            const templateContent = document.importNode(
              rawTemplateContent,
              true
            )

            const suggestionTitle = templateContent.querySelector(
              '.js-suggestion-title'
            ) as HTMLParagraphElement | null
            const suggestionContent = templateContent.querySelector(
              '.js-suggestion-content'
            ) as HTMLParagraphElement | null
            const suggestionLink = templateContent.querySelector(
              'a'
            ) as HTMLAnchorElement | null
            if (!suggestionTitle || !suggestionContent || !suggestionLink) {
              console.error('Suggestion template is invalid.')
              return
            }

            suggestionTitle.innerHTML = suggestion._highlightResult.title.value
            suggestionLink.href = suggestion.url

            if (
              suggestion._highlightResult.content.value &&
              suggestion._highlightResult.content.matchLevel !== 'none'
            ) {
              suggestionContent.innerHTML =
                suggestion._highlightResult.content.value
            } else {
              suggestionContent.style.display = 'none'
            }

            return toString(templateContent)
          },
        },
      },
    ]
  )
})
