import React, { useEffect, useRef } from "react";

import { iArticle } from "../../../interfaces";
import { useStoreDispatch } from "../../../store/store";

import './article.scss';

interface props {
    article: iArticle,
    set_is_height_reached?: (state: true) => void;
}


const Article: React.FC <props> = ({article, set_is_height_reached}) => {

    const { open_article_modal } = useStoreDispatch();

    const ref = useRef<HTMLDivElement | null>();

    useEffect(()=>{
        let func = () => scroll_listener(ref.current, set_is_height_reached);
    
        if (set_is_height_reached){
            func();
            window.addEventListener('scroll', func);
        }

        return () => {
            window.removeEventListener('scroll', func);
        }
    }, [set_is_height_reached])
    
    const scroll_listener = (ref: HTMLDivElement  | undefined | null, set_is_height_reached?: (state: true) => void) => {
        if (
            ref &&
            set_is_height_reached
        ) {
            // old orc teсhnologies
            let offset_top = 0;
            let elem: HTMLElement | null = ref;
            do {
                offset_top  += elem.offsetTop;
                // eslint-disable-next-line
            } while (elem = elem.parentElement);

            if (window.pageYOffset + window.outerHeight - offset_top >= 0) {   
                set_is_height_reached(true);
            }
        }
    }


    return (
        <div
            className='Article'
            onClick={() => open_article_modal(article)}
            ref={reference => ref.current = reference}
        >
            <div
                className="article_image"
            >
                <img src={article.urlToImage} height='200px'/>
            </div>
            <div className="article_time">
                {article.publishedAt.split('T')[0] + ' ' + article.publishedAt.split('T')[1].split('Z')[0]}
            </div>
                {article.title}
            <div>
            </div>
        </div>
    )
}

export default Article;