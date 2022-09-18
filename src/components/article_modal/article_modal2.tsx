import React, { useState } from "react";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from "@mui/material/Divider";

import { useStoreDispatch, use_store_selector } from "../../store/store";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    // p: 4,
    borderRadius: '10px',
};


const ArticleModal2: React.FC = () => {

    const { opened_windows, opened_article } = use_store_selector( store => store.app );
    const { close_article_modal } = useStoreDispatch();

    const [timeout] = useState(500);


    if (!opened_article) return <></>
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={opened_windows.includes('article')}
                onClose={() => close_article_modal(timeout)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{timeout: timeout}}
            >
                <Fade in={opened_windows.includes('article')}>
                    <Box sx={style}>
                        <DialogTitle
                            sx={{ m: 0, p: 2 }}
                        >
                            {opened_article.title}
                            <IconButton
                                aria-label="close"
                                onClick={() => close_article_modal(timeout)}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 12,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        {/* <Typography id="transition-modal-title" variant="h6" component="h2">
                            {opened_article.title}
                        </Typography> */}
                        <Divider/>
                        <div style={{padding: '10px'}}>
                            <img src={opened_article.urlToImage} style={{width: '100%'}}/>
                        </div>
                        <Divider/>
                        <Typography id="transition-modal-description" sx={{ mt: 2, p: '5px 10px' }}>
                            {opened_article.content}
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default ArticleModal2;