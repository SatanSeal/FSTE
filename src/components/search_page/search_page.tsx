import React, { useEffect, useState } from "react";
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

import { store } from "../../store/store";
import { languages_enum, searchIn_enum, category_enum, countries_enum, sorting_enum } from "../../settings";
import { GET } from "../../utils/helpers";
import { iSource } from "../../interfaces";
import { format } from "date-fns";

const languages_arr = ['', 'auto', ...Object.keys(languages_enum).sort()];
const languages_arr_2 = ['auto', ...Object.keys(languages_enum).sort()];
const searchIn_arr = ['', ...Object.keys(searchIn_enum).sort()];
const countries_arr = ['auto', ...Object.keys(countries_enum).sort()];
const categories_arr = [...Object.keys(category_enum).sort()];
const sortBy_arr = [...Object.keys(sorting_enum).sort()];


const SearchPage: React.FC = () => {

    const [local_search_string, set_local_search_string] = useState( store.getState().app.search_string || '' );
    const [selected_lang, set_selected_lang] = useState<string | null>(null);
    const [selected_searchIn, set_selected_searchIn] = useState<string[]>([]);
    const [included_sources, set_included_sources] = useState<iSource[]>([]);
    const [excluded_sources, set_excluded_sources] = useState<iSource[]>([]);
    const [selected_sortBy, set_selected_sortBy] = useState<string | null>(null);
    const [fromDate, set_fromDate] = useState<Date | null>(null);
    const [toDate, set_toDate] = useState<Date | null>(null);

    const search = () => {
        /*
        let get_props: everything_props = {
            path: '/everything'
        }

        // not passes if prop equals ''
        if (selected_lang && selected_lang in languages_arr){
            get_props.language = selected_lang as languages_enum | 'auto';
        }

        if (local_search_string){
            get_props.q = local_search_string;
        }

        if (selected_search_in && selected_search_in in searchIn_arr){
            get_props.searchIn = selected_search_in as searchIn_enum;
        }

        GET(get_props)
        */

        // upper equals to bottom

        GET({
            path: '/everything',
            // not passed if has no value
            ...(local_search_string && {q: local_search_string}),
            ...((selected_lang && languages_arr.includes(selected_lang)) && {language: selected_lang as languages_enum | 'auto'}),
            ...(selected_searchIn.length > 0 && {searchIn: selected_searchIn as searchIn_enum[]}),  // add filtering values in searchIn_arr
            // ...((selected_searchIn && searchIn_arr.includes(selected_searchIn)) && {searchIn: selected_searchIn as searchIn_enum}),
            ...(included_sources.length > 0 && {domains: included_sources.map(src => src.url.replace('https://', ''))}),    // not working without replace
            ...(excluded_sources.length > 0 && {excludeDomains: excluded_sources.map(src => src.url.replace('https://', ''))}),
            ...(selected_sortBy && {sortBy: selected_sortBy as sorting_enum}),
            ...(fromDate && {from: format(fromDate, 'yyyy-MM-dd\'T\'HH-mm-ss')}),
            ...(toDate && {to: format(toDate, 'yyyy-MM-dd\'T\'HH-mm-ss')}),
        })
    }

    // async input
    const [sources_arr, set_sources_arr] = useState<iSource[]>([]);
    const [sources_category, set_sources_category] = useState<string | null>(null);
    const [sources_lang, set_sources_lang] = useState<string | null>(null);
    const [sources_country, set_sources_country] = useState<string | null>(null);
    const [included_sources_opened, set_included_sources_opened] = useState(false);
    const [excluded_sources_opened, set_excluded_sources_opened] = useState(false);
    const sources_loading = (included_sources_opened || excluded_sources_opened) && sources_arr.length === 0;

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
            // show something
            throw new Error();
        }
    }

    const get_specified_sources = async () => {
        let new_sources = await get_sources()
        set_sources_arr( new_sources );

        let new_sources_names = new_sources.map(src => src.name)
        set_included_sources( included_sources.filter(src => new_sources_names.includes(src.name)));
        set_excluded_sources( excluded_sources.filter(src => new_sources_names.includes(src.name)));
        // set_sources_open(true);
    }
    // /async input


    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <TextField
                    label='Search'
                    variant='outlined'
                    value={local_search_string}
                    onChange={e => set_local_search_string(e.target.value)}
                />
                <Button
                    variant="outlined"
                    onMouseDown={search}
                    >
                    Go
                </Button>
            </div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="search_details"
                    id="search_details"
                >
                    <Typography>Search details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div
                        style={{ display: 'flex', flexDirection: 'row', padding: '10px 0'}}
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
                                    label="Search in"
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
            {/* <Divider/> */}
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="sources_details"
                    id="sources_details"
                >
                    <Typography>Sources details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div
                        style={{display: 'flex', flexDirection: 'row', padding: '10px 0'}}
                    >
                        <Autocomplete
                            id="included_sources"
                            sx={{ width: 300 }}
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
                            sx={{ width: 300 }}
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
                            sx={{ width: 200 }}
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
                            sx={{ width: 200 }}
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
                            sx={{ width: 200 }}
                        />
                        {/* // for multiple
                        <Autocomplete
                            multiple
                            id="tags-standard"
                            options={countries_arr}
                            // getOptionLabel={(option) => option.title}
                            // defaultValue={[top100Films[13]]}
                            value={sources_countries}
                            onChange={(event, newValue) => {
                                set_sources_countries(newValue);
                            }}
                            getOptionDisabled={(option) =>
                                sources_countries.length > 0 ?
                                    (
                                        (sources_countries.includes('auto') && option !== 'auto') ||
                                        (!sources_countries.includes('auto') && option === 'auto')
                                    ) 
                                : false
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Source countries"
                                    // placeholder="Favorites"
                                />
                            )}
                            sx={{ width: 200 }}
                        />
                        */}
                        <Button
                            variant="outlined"
                            onMouseDown={get_specified_sources}
                        >
                            Refresh
                        </Button>
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default SearchPage;