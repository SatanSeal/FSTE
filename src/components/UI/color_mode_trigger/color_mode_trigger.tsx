import React from "react";

import { useStoreDispatch, use_store_selector } from "../../../store/store";

import './color_mode_trigger.scss';

import moon_dark_img from '../../../assets/moon_dark.png';


const ColorModeTrigger: React.FC <{minimized?: boolean, is_tabindex?: boolean}> = ({minimized, is_tabindex}) =>{

    const { dark_mode } = use_store_selector( store => store.app );

    const { set_dark_mode } = useStoreDispatch();

    
    return (
        <div className={`Color_mode_trigger ${minimized? 'Color_mode_trigger_minimized' : ''}`}>
            <div
                className={dark_mode? 'trigger_link' : 'trigger_link_active'}
                tabIndex={dark_mode && is_tabindex? 0 : -1}
                onClick={() => set_dark_mode(false)}
                onKeyDown={e => e.key === 'Enter' && set_dark_mode(false)}
            > 
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 30 30"
                    style={{fill: dark_mode? 'white' : 'black'}}
                >
                    <path d="M 14.984375 0.98632812 A 1.0001 1.0001 0 0 0 14 2 L 14 5 A 1.0001 1.0001 0 1 0 16 5 L 16 2 A 1.0001 1.0001 0 0 0 14.984375 0.98632812 z M 5.796875 4.7988281 A 1.0001 1.0001 0 0 0 5.1015625 6.515625 L 7.2226562 8.6367188 A 1.0001 1.0001 0 1 0 8.6367188 7.2226562 L 6.515625 5.1015625 A 1.0001 1.0001 0 0 0 5.796875 4.7988281 z M 24.171875 4.7988281 A 1.0001 1.0001 0 0 0 23.484375 5.1015625 L 21.363281 7.2226562 A 1.0001 1.0001 0 1 0 22.777344 8.6367188 L 24.898438 6.515625 A 1.0001 1.0001 0 0 0 24.171875 4.7988281 z M 15 8 A 7 7 0 0 0 8 15 A 7 7 0 0 0 15 22 A 7 7 0 0 0 22 15 A 7 7 0 0 0 15 8 z M 2 14 A 1.0001 1.0001 0 1 0 2 16 L 5 16 A 1.0001 1.0001 0 1 0 5 14 L 2 14 z M 25 14 A 1.0001 1.0001 0 1 0 25 16 L 28 16 A 1.0001 1.0001 0 1 0 28 14 L 25 14 z M 7.9101562 21.060547 A 1.0001 1.0001 0 0 0 7.2226562 21.363281 L 5.1015625 23.484375 A 1.0001 1.0001 0 1 0 6.515625 24.898438 L 8.6367188 22.777344 A 1.0001 1.0001 0 0 0 7.9101562 21.060547 z M 22.060547 21.060547 A 1.0001 1.0001 0 0 0 21.363281 22.777344 L 23.484375 24.898438 A 1.0001 1.0001 0 1 0 24.898438 23.484375 L 22.777344 21.363281 A 1.0001 1.0001 0 0 0 22.060547 21.060547 z M 14.984375 23.986328 A 1.0001 1.0001 0 0 0 14 25 L 14 28 A 1.0001 1.0001 0 1 0 16 28 L 16 25 A 1.0001 1.0001 0 0 0 14.984375 23.986328 z"/>
                </svg>
                {!minimized && 'Light'}
            </div>
            <div
                className={dark_mode? 'trigger_link_active' : 'trigger_link'}
                tabIndex={!dark_mode && is_tabindex? 0 : -1}
                onClick={() => set_dark_mode(true)}
                onKeyDown={e => e.key === 'Enter' && set_dark_mode(true)}
            >
                <img src={moon_dark_img} alt=' '/>
                {!minimized &&
                    <div className="Color_mode_dark_link">
                        Dark
                    </div>
                }
            </div>
        </div>
    )
}

export default ColorModeTrigger;