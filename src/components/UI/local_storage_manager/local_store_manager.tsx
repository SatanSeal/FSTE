import React, { useEffect } from 'react';

import { useStoreDispatch, use_store_selector } from '../../../store/store';

enum local_storage_vars {
    TE_use_user_location = 'TE_use_user_location',
    TE_font_size = 'TE_font_size',
}


const LocalStroageManager: React.FC = () => {

    const { use_user_loaction, font_size } = use_store_selector( store => store.app );
    const { set_use_user_location, set_font_size } = useStoreDispatch();

    useEffect(()=>{     // on init
        let LS_UUL = localStorage.getItem(local_storage_vars.TE_use_user_location);
        if (LS_UUL === null){
            localStorage.setItem(local_storage_vars.TE_use_user_location, 'true');
        } else {
            set_use_user_location(!(LS_UUL === 'false'));   // in case of other strings will set true
        }

        let LS_FS = localStorage.getItem(local_storage_vars.TE_font_size);
        if (LS_FS === null){
            localStorage.setItem(local_storage_vars.TE_font_size, '16');
        } else {
            set_font_size(+LS_FS); //  add check for NaN
        }
        // eslint-disable-next-line
    }, [])

    useEffect(()=>{
        localStorage.setItem(local_storage_vars.TE_use_user_location, use_user_loaction + '')
    }, [use_user_loaction]);

    useEffect(()=>{
        localStorage.setItem(local_storage_vars.TE_font_size, font_size + '')
    }, [font_size])

    return <></>
}

export default LocalStroageManager;