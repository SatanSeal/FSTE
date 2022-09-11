import React, { useState } from "react";
import TextField from '@mui/material/TextField';

import { store } from "../../store/store";

import './settings_page.scss';

import ColorModeTrigger from "../UI/color_mode_trigger/color_mode_trigger";


const SettingsPage: React.FC = () => {

    const [font_size, set_font_size] = useState(store.getState().app.font_size);


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

        </div>
    )
}

export default SettingsPage;