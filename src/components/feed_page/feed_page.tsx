import React, { useEffect, useState } from "react";

import { store, useStoreDispatch, use_store_selector } from "../../store/store";
import { GET } from "../../utils/helpers";

import Article from "../UI/article/article";
import ArticlePreloader from "../UI/article_preloader/article_preloader";

import './feed_page.scss';

const FeedPage: React.FC = () => {

    const { news_fetch_count, news } = use_store_selector( store => store.app );
    const { set_news, add_news } = useStoreDispatch();

    const [page, set_page] = useState(1);
    const [is_news_fetching, set_is_news_fetching] = useState(true);
    const [num_of_preloaders, set_num_of_preloaders] = useState(3);
    const [is_height_reached, set_is_height_reached] = useState(false);
    // const [end_reached, set_is_end_reached] = useState(false);
    const [end_reached, set_is_end_reached] = useState(true);

    useEffect(()=>{
        get_data();
        // eslint-disable-next-line
    }, []);
    
    useEffect(()=>{
        console.log('is_height_reached changed: ', is_height_reached);
        if (is_height_reached && !end_reached){
            let news_length = store.getState().app.news.length; // fix this
            if(news_length + news_fetch_count <= 100 ) { // newsAPI dev plan limit
                (async function() {
                    console.log('called data update')
                    await get_data(true);
                    set_is_height_reached(false);
                }())
            } else {
                
            }
        }
        // eslint-disable-next-line
    }, [is_height_reached, end_reached]);

    const get_data = async (update_news?: boolean) =>{
        set_is_news_fetching(true);
        try {
            /*let response = await GET({path: '/top-headlines', pageSize: news_fetch_count, page: page, autodetect_country: true});
            // let response = await GET({path: '/top-headlines', pageSize: news_fetch_count, page: page, autodetect_country: true});
            // let response = await GET({path: '/top-headlines', pageSize: news_fetch_count, page: page,});
            // let response = await GET({path: '/everything', q: 'apple', pageSize: news_fetch_count, page: page, autodetect_lang: true});
            if (response.status !== 'ok'){
                // do something
                set_is_news_fetching(true);
                return;
            }
            update_news
                ? add_news( response.articles )
                : set_news( response.articles )
            ;
            set_page(page + 1);
            if (response.articles.length < news_fetch_count) set_is_end_reached(true);*/
        } catch {

        }
        // let news = await GET({path: '/top-headlines/sources'});
        // let news = await GET({path: '/top-headlines/sources', language: 'ru'});
        // let news = await GET({path: '/top-headlines', country: 'za', category: 'technology', pageSize: 3, page: 1});
        // let news = await GET({path: '/everything', q: 'apple', searchIn: 'content', sortBy: 'relevancy'});
        // let news = await GET({path: '/everything', domains: ['techcrunch.com','tc.com'], language: ['ru', 'pt'], sortBy: 'relevancy'});
        // console.log('news: ', news);
        
        // let news = await GET('/top-headlines', {pageSize: 3, page: page});
        // let news = await GET({path: '/top-headlines', {pageSize: 3, page: page}});

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
                            article={article}
                            set_is_height_reached={(!is_height_reached && index === news.length - 1)
                                ? set_is_height_reached
                                : undefined
                            }
                        />
                    )
                })}
                {is_news_fetching &&
                    [...Array(num_of_preloaders)].map(()=>{
                        return <ArticlePreloader/>;
                    })
                }
            </div>
        </div>
    )
}

export default FeedPage;