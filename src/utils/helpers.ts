import { iNews_response, iSources_response } from "../interfaces";
import { category_enum, countries_enum, languages_enum, news_api, searchIn_enum, sorting_enum } from "../settings";

// type iSearch_in = 'title' | 'description' | 'content';
// type iCategory = 'business' | 'entertainment' | 'general' | 'health' | 'science' | 'sports' | 'technology';
// type iCountry = 'ar' |'au' |'at' | 'be' | 'br' | 'bg' | 'ca' | 'cn' | 'co' | 'cu' | 'cz' | 'eg' | 'fr' | 'de' | 'gr' | 'hk' | 'hu' | 'in' | 'id' | 'ie' | 'il' | 'it' | 'jp' | 'lv' | 'lt' | 'my' | 'mx' | 'ma' | 'nl' | 'nz' | 'ng' | 'no' | 'ph' | 'pl' | 'pt' | 'ro' | 'ru' | 'sa' | 'rs' | 'sg' | 'sk' | 'si' | 'za' | 'kr' | 'se' | 'ch' | 'tw' | 'th' | 'tr' | 'ae' | 'ua' | 'gb' | 'us' | 've';
// type iLanguage = 'ar' | 'de' | 'en' | 'es' | 'fr' | 'he' | 'it' | 'nl' | 'no' | 'pt' | 'ru' | 'sv' | 'ud' | 'zh';
// type iSorting = 'relevancy' | 'popularity' | 'publishedAt';

export interface everything_props {    // any of following are required: q, qInTitle, sources, domains
    path: '/everything',
    q?: string,     // URL-encoded, Max length: 500 chars
    searchIn?: searchIn_enum | searchIn_enum[],
    domains?: string | string[],    // eg bbc.co.uk, techcrunch.com, engadget.com
    excludeDomains?: string | string[], // eg bbc.co.uk, techcrunch.com, engadget.com
    from?: string,  // e.g. 2022-08-24 or 2022-08-24T04:40:01   (not working)
    to?: string,    // e.g. 2022-08-24 or 2022-08-24T04:40:01   (not working)
    language?: languages_enum | 'auto',
    sortBy?: sorting_enum,
    pageSize?: number,
    page?: number,
}
export interface top_props {
    path: '/top-headlines',
    country?: countries_enum | 'auto',    // can't mix with the 'sources'
    category?: category_enum, // can't mix with the 'sources'
    sources?: string | string[],    // can't mix with the 'country' or 'category'
    q?: string,     // URL-encoded, Max length: 500 chars
    pageSize?: number,
    page?: number, 
}
export interface top_sources_props {
    path: '/top-headlines/sources',
    category?: category_enum,
    language?: languages_enum | 'auto',
    country?: countries_enum | 'auto',
}
type GET_overload = {
    (props: everything_props): Promise<iNews_response>;
    (props: top_props): Promise<iNews_response>;
    (props: top_sources_props): Promise<iSources_response>;
}

// posible to add another apis
export const detect_country = async (): Promise<string> => {
    let response = await fetch('https://get.geojs.io/v1/ip.json');
    let ip: {ip: string} = await response.json();
    let response_2 = await fetch('https://get.geojs.io/v1/ip/country/' + ip.ip + '.json');
    let country: {ip: string, country: string, country_3: string, name: string} = await response_2.json();
    return country.country.toLowerCase();
}

/**
 * Path `/everything` requires at least q / sources / domains
 * Dont pass undefined in props
*/
export const GET: GET_overload = async (props) =>{

    let news_api_key = process.env.REACT_APP_NEWS_API_KEY;   // or move this to settings - ?

    if (!news_api_key){
        
        throw new Error();    // add (+show to client)
    }
    // console.log('news_api_key: ', news_api_key);

    console.log('props: ', props);

    switch (props.path){
        case '/everything':
            // removes 'undefined' from objects (can be disabled if undefineds not passed)
            // Object.keys(props).forEach((k) => props[k as keyof typeof props] == null && delete props[k as keyof typeof props]); // fix this
            if (props.q){
                // props.q = encodeURI(props.q).slice(0, 499);
            }

            if (props.language === 'auto'){
                let lang = navigator.language.substring(0,2);
                props.language = lang in languages_enum? lang as languages_enum : languages_enum['en'];
            }

            break;

        case '/top-headlines':
            // Object.keys(props).forEach((k) => props[k as keyof typeof props] == null && delete props[k as keyof typeof props]); // fix this
            if (props.q){
                props.q = encodeURI(props.q).slice(0, 499);
            }

            if (!props.category && !props.sources){
                props.category = category_enum['general'];
            }

            if (props.country === 'auto'){
                try {
                    let country_code = await detect_country();
                    props.country = country_code in countries_enum ? country_code as countries_enum : countries_enum['us'];
                } catch {
                    props.country = countries_enum['us'];
                }
            }

            break;

        case '/top-headlines/sources':
            // Object.keys(props).forEach((k) => props[k as keyof typeof props] == null && delete props[k as keyof typeof props]); // fix this
            
            // if (!props.settings.category){
            //     props.settings.category = 'general';
            // }
            
            if (props.language === 'auto'){
                let lang = navigator.language.substring(0,2);
                props.language = lang in languages_enum? lang as languages_enum : languages_enum['en'];
            }
            
            if (props.country === 'auto'){
                try {
                    let country_code = await detect_country();
                    props.country = country_code in countries_enum ? country_code as countries_enum : countries_enum['us'];
                } catch {
                    props.country = countries_enum['us'];
                }
            }

            break;
        // default:

        //     break;
    }

    console.log('props: ', props);

    let props_string = '';
    let props_keys = Object.keys(props);

    props_keys = props_keys.filter(key => key !== 'path');

    props_keys.forEach((key, index) => {
        props_string += index === 0
            ? '?'
            : '&'
        ;
        // props_string += key + '=' + props[key as keyof (everything_props | top_props | top_sources_props)]; // add join for arrays
        // let val = props[key as keyof (everything_props | top_props | top_sources_props)];
        let value = props[key as keyof typeof props];

        props_string += key + '=' + (Array.isArray(value)
            ? value.join()
            : value
        );
    })

    console.log('props_string: ', props_string);

    // let a: any;
    // return a;
    
    let res = await fetch(news_api + props.path + props_string, {
        headers: {
            'X-Api-Key': news_api_key,
        }
    })
    
    if (res.status === 401){    // Unauthorized
        //show something to user
    }

    if (!res.ok){
        //show something
        throw new Error();  // add
    }

    return await res.json();
    
}