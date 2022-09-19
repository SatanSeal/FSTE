import React from "react";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";

import { useStoreDispatch, use_store_selector } from "../../store/store";
import { Button, DialogActions } from "@mui/material";

// move to .scss
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    width: '90vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    // p: 4,
    borderRadius: '10px',
    maxHeight: '90vh',
    overflow: 'auto',
};

const timeout = 500;


const ArticleModal: React.FC = () => {

    const { opened_windows, opened_article, font_size } = use_store_selector( store => store.app );
    const { close_article_modal } = useStoreDispatch();


    if (!opened_article) return <></>
    return (
        <div>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                open={opened_windows.includes('article')}
                onClose={() => close_article_modal(timeout)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{timeout: timeout}}
                
            >
                <Fade in={opened_windows.includes('article')}>
                    <Box sx={style}>
                        <DialogTitle
                            sx={{
                                m: 0,
                                p: 2,
                                fontSize: font_size+4+'px',
                            }}
                        >
                            {opened_article.title}
                            {/*<IconButton
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
                            </IconButton>*/}
                        </DialogTitle>
                        <Divider/>
                        <DialogContent
                            // sx={{
                            //     overflow: 'auto',
                            //     maxHeight: '70vh',
                            // }}
                        >
                            <img
                                src={opened_article.urlToImage}
                                style={{width: '100%'}}
                                alt=''
                            />
                            <Typography
                                id="modal-description"
                                sx={{
                                    // mt: 2,
                                    // p: '5px 10px',
                                    fontSize: font_size+'px',
                                }}
                            >
                                {opened_article.content}
                            </Typography>
                        </DialogContent>
                        <Divider/>
                        <DialogActions>
                            <Button onClick={() => close_article_modal(timeout)}>
                                Close
                            </Button>
                        </DialogActions>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default ArticleModal;