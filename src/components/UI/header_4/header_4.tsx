import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { styled, useTheme, Theme, CSSObject, alpha } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import SettingsIcon from '@mui/icons-material/Settings';
import FeedIcon from '@mui/icons-material/Feed';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";

import { useStoreDispatch } from "../../../store/store";
import { mobile_max_width } from "../../../settings";

const drawerWidth = 200;

const news_list = [
    {
        title: 'Headlines',
        icon: <FeedIcon/>,
        link: '/feed'
    },
    {
        title: 'Search',
        icon: <SearchIcon/>,
        link: '/search'
    }
]
const other_list = [
    {
        title: 'Settings',
        icon: <SettingsIcon/>,
        link: '/settings'
    },
    {
        title: 'About us',
        icon: <InfoIcon/>,
        link: '/about'
    },
    {
        title: 'Help',
        icon: <HelpIcon/>,
        link: '/help'
    }
]


const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

export const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));
  
interface AppBarProps extends MuiAppBarProps {
    open?: boolean,
    is_mobile?: boolean,
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open, is_mobile }) => ({
    // zIndex: theme.zIndex.drawer + 1,
    zIndex: theme.zIndex.drawer + (is_mobile? 0 : 1),
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && !is_mobile && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DesktopDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        // paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        paddingLeft: `calc(1em)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));



const Header4: React.FC = () => {

    const history = useHistory();
    const location = useLocation();
    const theme = useTheme();
    const { set_serach_string } = useStoreDispatch();

    const [open, set_open] = useState(false);
    const [local_search_string, set_local_search_string] = useState('');
    const [search_input_showed, set_search_input_showed] = useState(false);

    const [is_mobile, set_is_mobile] = useState(false);

    useEffect(()=>{
        set_search_input_showed( !location.pathname.includes('/search') );
    }, [location])

    useEffect(()=>{
        const func = () => set_is_mobile(window.innerWidth <= mobile_max_width);
        func();
        window.addEventListener('resize', func);

        return ()=>{
            window.removeEventListener('resize', func);
        }
    }, [])

    const handle_drawer_open = () => {
        set_open(true);
    };

    const handle_drawer_close = () => {
        set_open(false);
    };

    const handle_search_input = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        set_local_search_string(e.target.value);
    }

    // const handle_enter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const handle_enter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter'){
            // console.log('this is enter!');
            set_serach_string(local_search_string);
            history.push('/search');
            set_local_search_string('');
        }
    }

    const handle_search_click = () => {
        // console.log('search_string: ', local_search_string);
        set_serach_string(local_search_string);
        history.push('/search');
        set_local_search_string('');
    }

    const handle_link_click = (link: string) => {
        set_open(false);
        history.push(link);
    }

    // mobile
    const toggle_drawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        set_open(open);
    };
    // /mobile


    return (
        <>
            <CssBaseline />
            <AppBar position='fixed' open={open} is_mobile={is_mobile}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handle_drawer_open}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        FSTE
                    </Typography>
                    {search_input_showed &&
                        <Search
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                value={local_search_string}
                                onChange={handle_search_input}
                                onKeyPress={handle_enter}
                            />
                            <SearchIcon 
                                style={{
                                    cursor: 'pointer',
                                    margin: '0 5px',
                                }}
                                onMouseDown={handle_search_click}
                            />
                        </Search>
                    }
                </Toolbar>
            </AppBar>
            {is_mobile?
                <Drawer
                    anchor='left'
                    open={open}
                    onClose={toggle_drawer(false)}
                >
                    <Box
                        sx={{ width: drawerWidth }}
                        role="presentation"
                        onClick={toggle_drawer(false)}
                        onKeyDown={toggle_drawer(false)}
                    >
                        <List>
                            {news_list.map(list_item => (
                                <ListItem key={list_item.title} disablePadding>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                        onClick={() => handle_link_click(list_item.link)}
                                    >
                                        <ListItemIcon>
                                            {list_item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={list_item.title} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                        <Divider />
                        <List>
                            {other_list.map(list_item => (
                                <ListItem key={list_item.title} disablePadding>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                        onClick={() => handle_link_click(list_item.link)}
                                    >
                                        <ListItemIcon>
                                            {list_item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={list_item.title} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                        </Box>
                </Drawer>
            :
                <DesktopDrawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handle_drawer_close}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {news_list.map(list_item => (
                            <ListItem key={list_item.title} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                    }}
                                    onClick={() => handle_link_click(list_item.link)}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {list_item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={list_item.title} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {other_list.map(list_item => (
                            <ListItem key={list_item.title} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                    }}
                                    onClick={() => handle_link_click(list_item.link)}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {list_item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={list_item.title} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DesktopDrawer>
            }
        </>
    )
}

export default Header4;