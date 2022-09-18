import React, { useEffect } from "react";

import { useStoreDispatch, use_store_selector } from "../../../store/store";


const ColorModeHandler: React.FC <{set_outer_dark_mode?: (arg: boolean) => void}> = ({set_outer_dark_mode}) => {

    const { dark_mode } = use_store_selector( store => store.app );
    const { set_dark_mode } = useStoreDispatch();

    useEffect(()=>{     // color mode init
		let color_mode = localStorage.getItem('fste_color_mode');	// 'dark' | 'light' | null
		if ( color_mode === 'dark'){
			set_dark_mode(true);
		} else {
			if (color_mode === null){
				turn_dark_mode_off();
			}
			set_dark_mode(false);
		}
        // eslint-disable-next-line
    }, [])

    useEffect(()=>{     // color mode listener
        if (dark_mode){
            turn_dark_mode_on();
            set_outer_dark_mode && set_outer_dark_mode(true);
        } else {
            turn_dark_mode_off();
            set_outer_dark_mode && set_outer_dark_mode(false);
        }
        // eslint-disable-next-line
    }, [dark_mode])

    function turn_dark_mode_on() {
        let body = document.getElementById('body');
        if (body){
            body.className = 'dark_mode';
            localStorage.setItem('fste_color_mode', 'dark');
        }
    }
    
    function turn_dark_mode_off() {
        let body = document.getElementById('body');
        if (body){
            body.className = 'light_mode';
            localStorage.setItem('fste_color_mode', 'light');
        }
    }


    return <></>
}

export default ColorModeHandler;