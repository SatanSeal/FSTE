import React from 'react';
import Box from "@mui/material/Box";

import { use_store_selector } from '../../../store/store';


const FontSizeWrapper: React.FC = ({children}) => {
    
    const { font_size } = use_store_selector( store => store.app );


    return(
        <Box
            sx={{
                display: 'flex',
                fontSize: font_size+'px',
                // width: '100%',
                // alignItems: 'center',
                // justifyContent: 'center',
                // bgcolor: 'background.default',
                // color: 'text.primary',
                // borderRadius: 1,
                // p: 3,
            }}
        >
            {children}
        </Box>
    )
}

export default FontSizeWrapper;