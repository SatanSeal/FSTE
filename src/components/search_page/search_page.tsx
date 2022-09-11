import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { store } from "../../store/store";
import { languages_enum, searchIn_enum } from "../../settings";
import { GET } from "../../utils/helpers";

const languages_arr = ['', 'auto', ...Object.keys(languages_enum)];
const searchIn_arr = ['', ...Object.keys(searchIn_enum)];


const SearchPage: React.FC = () => {

    const [local_search_string, set_local_search_string] = useState( store.getState().app.search_string || '' );

    const [selected_lang, set_selected_lang] = useState('');
    const [selected_search_in, set_selected_search_in] = useState('');

    const search = () => {
        GET({
            path: '/everything',
            q: local_search_string? local_search_string : undefined,
            // language: selected_lang && selected_lang in languages_enum? selected_lang as languages_enum : undefined,
            language: (selected_lang in languages_enum || selected_lang === 'auto')? selected_lang as languages_enum : undefined,
        })
    }


    return (
        <div>
            <TextField
                label='Search'
                variant='outlined'
                value={local_search_string}
                onChange={e => set_local_search_string(e.target.value)}
            />
            <FormControl style={{width: '120px'}}>
                <InputLabel id="lang-select-label">Language</InputLabel>
                <Select
                    labelId="lang-select-label"
                    value={selected_lang}
                    label="Language"
                    onChange={e => set_selected_lang(e.target.value)}
                >
                    {languages_arr.map(lang => {
                        return (
                            <MenuItem value={lang}>{lang? lang : 'none'}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
            <FormControl style={{width: '120px'}}>
                <InputLabel id="searchIn-select-label">Search in</InputLabel>
                <Select
                    labelId="searchIn-select-label"
                    value={selected_search_in}
                    label="Search in"
                    onChange={e => set_selected_search_in(e.target.value)}
                >
                    {searchIn_arr.map(li => {
                        return (
                            <MenuItem value={li}>{li? li : 'none'}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
            <Button
                variant="outlined"
                onMouseDown={search}
            >
                Go
            </Button>
        </div>
    )
}

export default SearchPage;