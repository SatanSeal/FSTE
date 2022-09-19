import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";

import { store, use_store_selector } from "../../store/store";
import { languages_enum, searchIn_enum, category_enum, countries_enum, sorting_enum } from "../../settings";
import { GET } from "../../utils/helpers";
import { iArticle, iSource } from "../../interfaces";

import './search_page.scss';

import Article from "../UI/article/article";
import ArticlePreloader from "../UI/article_preloader/article_preloader";
import { errors } from "../../errors";

const languages_arr = ['', 'auto', ...Object.keys(languages_enum).sort()];
const languages_arr_2 = ['auto', ...Object.keys(languages_enum).sort()];
const searchIn_arr = ['', ...Object.keys(searchIn_enum).sort()];
const countries_arr = ['auto', ...Object.keys(countries_enum).sort()];
const categories_arr = [...Object.keys(category_enum).sort()];
const sortBy_arr = [...Object.keys(sorting_enum).sort()];

const accordion_height = 56;


const SearchPage: React.FC = () => {

    const { news_fetch_count, use_user_loaction } = use_store_selector( store => store.app );

    const [searched_news, set_searched_news] = useState<iArticle[]>([]);
    const [local_search_string, set_local_search_string] = useState( store.getState().app.search_string || '' );
    const [num_of_preloaders] = useState(3);
    const [is_height_reached, set_is_height_reached] = useState(false);
    const [end_reached, set_is_end_reached] = useState(false);
    // const [end_reached, set_is_end_reached] = useState(true);
    const [current_page, set_current_page] = useState(1);
    const [news_fetching, set_news_fetching] = useState(false);
    const search_input_error = local_search_string.length === 0;

    // settings part
    const [selected_lang, set_selected_lang] = useState<string | null>(use_user_loaction? 'auto' : null);
    const [selected_searchIn, set_selected_searchIn] = useState<string[]>([]);
    const [included_sources, set_included_sources] = useState<iSource[]>([]);
    const [excluded_sources, set_excluded_sources] = useState<iSource[]>([]);
    const [selected_sortBy, set_selected_sortBy] = useState<string | null>(null);
    const [fromDate, set_fromDate] = useState<Date | null>(null);
    const [toDate, set_toDate] = useState<Date | null>(null);
    // /settings part
    // sources part
    const [sources_arr, set_sources_arr] = useState<iSource[]>([]);
    const [sources_category, set_sources_category] = useState<string | null>(null);
    const [sources_lang, set_sources_lang] = useState<string | null>(null);
    const [sources_country, set_sources_country] = useState<string | null>(null);
    const [included_sources_opened, set_included_sources_opened] = useState(false);
    const [excluded_sources_opened, set_excluded_sources_opened] = useState(false);
    const sources_loading =
        (included_sources_opened || excluded_sources_opened) &&
        !sources_category &&
        !sources_lang &&
        !sources_country &&
        sources_arr.length === 0
    ;
    const [sources_refreshing, set_sources_refreshing] = useState(false);
    //  /sources part

    useEffect(() => {
        let active = true;

        if (!sources_loading) {
            return undefined;
        }

        (async () => {
            let sources = await get_sources(true);
            if (active) {
                set_sources_arr(sources);
            }
        })();

        return () => {
            active = false;
        };
        // eslint-disable-next-line
    }, [sources_loading]);

    const inner_news_fetching = useRef(false);
    useEffect(()=>{
        if (is_height_reached && !end_reached && !inner_news_fetching.current){
            if(searched_news.length + news_fetch_count <= 100 ) { // newsAPI dev plan limit
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

    const get_news = async (add_news?: boolean) => {
        set_news_fetching(true);
        let _page = add_news? current_page : 1;
        try{
            let response = await GET({
                path: '/everything',
                pageSize: news_fetch_count,
                page: _page,
                // not passed if has no value
                ...(local_search_string && {q: local_search_string}),
                ...((selected_lang && languages_arr.includes(selected_lang)) && {language: selected_lang as languages_enum | 'auto'}),
                ...(selected_searchIn.length > 0 && {searchIn: selected_searchIn as searchIn_enum[]}),  // add filtering values in searchIn_arr
                ...(included_sources.length > 0 && {domains: included_sources.map(src => src.url.replace('https://', ''))}),    // not working without replace
                ...(excluded_sources.length > 0 && {excludeDomains: excluded_sources.map(src => src.url.replace('https://', ''))}),
                ...(selected_sortBy && {sortBy: selected_sortBy as sorting_enum}),
                ...(fromDate && {from: format(fromDate, 'yyyy-MM-dd\'T\'HH-mm-ss')}),
                ...(toDate && {to: format(toDate, 'yyyy-MM-dd\'T\'HH-mm-ss')}),
            })
            if (response.status !== 'ok'){
                set_news_fetching(false);
                // show something
                return;
            }
            set_current_page(_page+1);
            set_searched_news(
                add_news
                    ? searched_news.concat(...response.articles)
                    : response.articles
            )
            if (response.articles.length < news_fetch_count) set_is_end_reached(true);
        } catch {
            // show snackbar
        }
        set_news_fetching(false);
    }

    const get_sources = async (empty?: boolean): Promise<iSource[]> => {
        let response = await GET({
            path: '/top-headlines/sources',
            ...(!empty && sources_category && {category: sources_category as category_enum}),
            ...(!empty && sources_lang && {language: sources_lang as languages_enum | 'auto'}),
            ...(!empty && sources_country && {country: sources_country as countries_enum | 'auto'}),
        })
        if (response.status === 'ok'){
            return response.sources;
        } else {
            throw new Error(errors.RESPONSE_NOT_OK);
        }
    }

    const get_specified_sources = async () => {
        set_sources_refreshing(true);
        try {
            let new_sources = await get_sources()
            
            set_sources_arr( new_sources );
    
            let new_sources_names = new_sources.map(src => src.name)
            set_included_sources( included_sources.filter(src => new_sources_names.includes(src.name)));
            set_excluded_sources( excluded_sources.filter(src => new_sources_names.includes(src.name)));
        } catch (error) {
            // show snackbar
        }

        set_sources_refreshing(false);
        // set_sources_open(true);
    }


    return (
        <div className='Search_page'>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <TextField
                    label='Search'
                    variant='outlined'
                    value={local_search_string}
                    onChange={e => set_local_search_string(e.target.value)}
                    sx={{
                        flexGrow: 1,
                    }}
                    error={search_input_error}
                />
                <Box sx={{ m: 0, position: 'relative' }}>
                    <Button
                        variant="outlined"
                        sx={{
                            height: accordion_height,
                            margin: '0 0 0 10px',
                            width: 100,
                        }}
                        disabled={news_fetching || search_input_error}
                        onClick={() => get_news()}
                    >
                        Go
                    </Button>
                    {news_fetching && (
                        <CircularProgress
                            size={24}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                            }}
                        />
                    )}
                </Box>
            </div>
            <Accordion
                sx={{
                    margin: '10px 0',
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="search_details"
                    id="search_details"
                >
                    <Typography>Search details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            padding: '10px 0',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Autocomplete
                            id="lang_select"
                            options={languages_arr}
                            value={selected_lang}
                            onChange={(event, newValue) => {
                                set_selected_lang(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Language"
                                />
                            )}
                            sx={{ width: 200 }}
                        />
                        <Autocomplete
                            id="search_in"
                            multiple
                            options={searchIn_arr}
                            value={selected_searchIn}
                            onChange={(event, newValue) => {
                                set_selected_searchIn(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search in"
                                />
                            )}
                            sx={{ width: 200 }}
                        />
                        <Autocomplete
                            id="sort_by"
                            options={sortBy_arr}
                            value={selected_sortBy}
                            onChange={(event, newValue) => {
                                set_selected_sortBy(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Sort by"
                                />
                            )}
                            sx={{ width: 200 }}
                        />
                        <DateTimePicker
                            label="From"
                            renderInput={(params) => <TextField {...params} />}
                            value={fromDate}
                            onChange={(newValue) => {
                                set_fromDate(newValue);
                            }}
                        />
                        <DateTimePicker
                            label="To"
                            renderInput={(params) => <TextField {...params} />}
                            value={toDate}
                            onChange={(newValue) => {
                                set_toDate(newValue);
                            }}
                        />
                    </div>
                </AccordionDetails>
            </Accordion>
            <Accordion
                sx={{
                    marginBottom: '10px',
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="sources_details"
                    id="sources_details"
                >
                    <Typography>Sources details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            padding: '10px 0',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Autocomplete
                            id="included_sources"
                            sx={{
                                width: 260,
                                height: accordion_height,
                            }}
                            open={included_sources_opened}
                            onOpen={() => {
                                set_included_sources_opened(true);
                            }}
                            onClose={() => {
                                set_included_sources_opened(false);
                            }}
                            isOptionEqualToValue={(option, value) => option.name === value.name}
                            getOptionLabel={(option) => option.name}
                            options={sources_arr}
                            loading={sources_loading}

                            value={included_sources}
                            onChange={(event, newValue) => {
                                set_included_sources(newValue);
                            }}
                            multiple
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Included sources"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                        <>
                                            {sources_loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                        ),
                                    }}
                                />
                            )}
                        />
                        <Autocomplete
                            id="excluded_sources"
                            sx={{
                                width: 260,
                                height: accordion_height,
                            }}
                            open={excluded_sources_opened}
                            onOpen={() => {
                                set_excluded_sources_opened(true);
                            }}
                            onClose={() => {
                                set_excluded_sources_opened(false);
                            }}
                            isOptionEqualToValue={(option, value) => option.name === value.name}
                            getOptionLabel={(option) => option.name}
                            options={sources_arr}
                            loading={sources_loading}

                            value={excluded_sources}
                            onChange={(event, newValue) => {
                                set_excluded_sources(newValue);
                            }}
                            multiple
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Excluded sources"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                        <>
                                            {sources_loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                        ),
                                    }}
                                />
                            )}
                        />
                        <Autocomplete
                            id="sources_category"
                            options={categories_arr}
                            value={sources_category}
                            onChange={(event, newValue) => {
                                set_sources_category(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Sources category"
                                />
                            )}
                            sx={{
                                width: 180,
                                height: accordion_height,
                            }}
                        />
                        <Autocomplete
                            id="sources_language"
                            options={languages_arr_2}
                            value={sources_lang}
                            onChange={(event, newValue) => {
                                set_sources_lang(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Sources language"
                                />
                            )}
                            sx={{
                                width: 190,
                                height: accordion_height,
                            }}
                        />
                        <Autocomplete
                            id="source_country"
                            options={countries_arr}
                            value={sources_country}
                            onChange={(event, newValue) => {
                                set_sources_country(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Source country"
                                />
                            )}
                            sx={{
                                width: 170,
                                height: accordion_height,
                            }}
                        />
                        <Box sx={{ m: 1, position: 'relative' }}>
                            <Button
                                variant="contained"
                                sx={{
                                    height: accordion_height ,
                                    margin: 0
                                }}
                                disabled={sources_refreshing}
                                onClick={get_specified_sources}
                            >
                                Refresh
                            </Button>
                            {sources_refreshing && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                />
                            )}
                        </Box>
                    </div>
                </AccordionDetails>
            </Accordion>
            <div
                className="articles"
            >
                {searched_news.map( (article, index) => {
                    return (
                        <Article
                            key={article.url}
                            article={article}
                            set_is_height_reached={(!is_height_reached && index === searched_news.length - 1)
                                ? set_is_height_reached
                                : undefined
                            }
                        />
                    )
                })}
                {news_fetching &&
                    [...Array(num_of_preloaders)].map((i, index)=>{
                        return <ArticlePreloader key={index}/>;
                    })
                }
            </div>
        </div>
    )
}

export default SearchPage;