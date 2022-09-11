import React from "react";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


const ArticlePreloader: React.FC = () => {
    return (
        <Stack spacing={1} className='Article'>
            {/* For variant="text", adjust the height via font-size */}
            {/* <Skeleton variant="text" sx={{ fontSize: '1rem' }} /> */}

            {/* For other variants, adjust the size with `width` and `height` */}
            {/* <Skeleton variant="circular" width={40} height={40} /> */}
            <Skeleton variant="rounded" width={400} height={200}/>
            <Skeleton variant="text" width='50%'/>
            <Skeleton variant="rounded" width='100%' height={60}/>
        </Stack>
    )
}

export default ArticlePreloader;