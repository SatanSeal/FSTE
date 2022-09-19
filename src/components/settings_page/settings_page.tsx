import React from "react";
import TextField from '@mui/material/TextField';
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import { useStoreDispatch, use_store_selector } from "../../store/store";

import './settings_page.scss';

import ColorModeTrigger from "../UI/color_mode_trigger/color_mode_trigger";
import Tooltip from "@mui/material/Tooltip";


const SettingsPage: React.FC = () => {

    const { use_user_loaction, font_size } = use_store_selector( store => store.app );
    const { set_use_user_location, set_font_size } = useStoreDispatch();

    const handle_switch_change = (event: React.ChangeEvent<HTMLInputElement>) => {
        set_use_user_location(event.target.checked);
      };


    return (
        <div>
            <ColorModeTrigger />
            <br/>
            <TextField
                id="outlined-number"
                label="Font size"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                value={font_size}
                onChange={e => set_font_size(+e.target.value)}
            />
            <br/>
            <Tooltip title="Uses your location (if possible) for searching news on your langage" placement='right'>
                <FormControlLabel
                    sx={{
                        m: '10px 0 0 0'
                    }}
                    label='Use user location'
                    labelPlacement='start'
                    control={
                        <Switch
                            checked={use_user_loaction}
                            onChange={handle_switch_change}
                        />
                    }
                />
            </Tooltip>
        </div>
    )
}

export default SettingsPage;