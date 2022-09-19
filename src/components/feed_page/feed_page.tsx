import React, { useEffect, useRef, useState } from "react";

import { store, useStoreDispatch, use_store_selector } from "../../store/store";
import { GET } from "../../utils/helpers";

import Article from "../UI/article/article";
import ArticlePreloader from "../UI/article_preloader/article_preloader";

import './feed_page.scss';

const num_of_preloaders = 3;

const FeedPage: React.FC = () => {

    const { news_fetch_count, news, use_user_loaction } = use_store_selector( store => store.app );
    const { set_news, add_news } = useStoreDispatch();

    const [page, set_page] = useState(1);
    const [is_news_fetching, set_is_news_fetching] = useState(true);
    const [is_height_reached, set_is_height_reached] = useState(false);
    const [end_reached, set_is_end_reached] = useState(false);

    useEffect(()=>{
        get_news();
        // eslint-disable-next-line
    }, []);
    
    const inner_news_fetching = useRef(false);
    useEffect(()=>{
        if (is_height_reached && !end_reached && !inner_news_fetching.current){
            
            let news_length = store.getState().app.news.length; // fix this
            if(news_length + news_fetch_count <= 100 ) { // newsAPI dev plan limit
                (async function() {
                    inner_news_fetching.current = true;
                    await get_news(true);
                    set_is_height_reached(false);
                    inner_news_fetching.current = false;
                }())
            }
        }
        // eslint-disable-next-line
    }, [is_height_reached, end_reached]);

    const get_news = async (update_news?: boolean) =>{
        set_is_news_fetching(true);
        try {
            let response = await GET({
                path: '/top-headlines',
                pageSize: news_fetch_count,
                page: page,
                ...(use_user_loaction && {country: 'auto'})
            });
            if (response.status !== 'ok'){
                // show snackbar
                set_is_news_fetching(false);
                return;
            }
            update_news
                ? add_news( response.articles )
                : set_news( response.articles )
            ;
            set_page(page + 1);
            if (response.articles.length < news_fetch_count) set_is_end_reached(true);
        } catch {
            // show snackbar
        }
        set_is_news_fetching(false);
    }


    return (
        <div
            className="Feed_page"
        >
            <div
                className="articles"
            >
                {news.map( (article, index) => {
                    return (
                        <Article
                            key={article.url}
                            article={article}
                            set_is_height_reached={(!is_height_reached && index === news.length - 1)
                                ? set_is_height_reached
                                : undefined
                            }
                        />
                    )
                })}
                {is_news_fetching &&
                    [...Array(num_of_preloaders)].map((i, index)=>{
                        return <ArticlePreloader key={index}/>;
                    })
                }
            </div>
        </div>
    )
}

export default FeedPage;