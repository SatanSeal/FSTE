export interface iRedux_state {
    app: iApp_state,
}

export interface iApp_state {
    dark_mode: boolean,
    opened_windows: modal_name[],
    news: iArticle[],
    opened_article: iArticle | null,
    font_size: number,
    news_fetch_count: number,

    search_string: string | null,
}

export interface iNews_response {
    status: 'ok' | 'error',
    totalResults: number,
    articles: iArticle[],
}

export interface iArticle {
    source: {
        id: null | string,
        name: string,
    },
    author: string,
    title: string,
    description: string,
    url: string,
    urlToImage: string,
    publishedAt: string,    // time
    content: string,
}

export interface iSources_response {
    status: 'ok' | 'error',
    sources: iSource[],
}

interface iSource {
    id: string,
    name: string,
    description: string,
    url: string,
    category: string,
    language: string,
    country: string,
}

export type modal_name = 'article';