import React, { lazy, Suspense, useState } from "react";
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { store } from './store/store';
import { basename } from "./settings";

import './scss/index.scss';

import Box from "@mui/material/Box";
import LinearProgress from '@mui/material/LinearProgress';
import ColorModeHandler from "./components/UI/color_mode_handler/color_mode_handler";
import Header, { DrawerHeader } from "./components/UI/header/header";
import ArticleModal from "./components/article_modal/article_modal";
import LocalStroageManager from "./components/UI/local_storage_manager/local_store_manager";
import FontSizeWrapper from "./components/UI/fontSize_wrapper/fontSize_wrapper";

//	dynamic import of pages
const FeedPage = lazy(() => import('./components/feed_page/feed_page'));
const SearchPage = lazy(() => import('./components/search_page/search_page'));
const SettingsPage = lazy(() => import('./components/settings_page/settings_page'));
const AboutPage = lazy(() => import('./components/about_page/about_page'));
const HelpPage = lazy(() => import('./components/help_page/help_page'));


const Index: React.FC = () => {

	const [dark_mode, set_dark_mode] = useState(false);
	const theme = React.useMemo(
		() =>
		  createTheme({
			palette: {
				mode: dark_mode? 'dark' : 'light',
			},
		  }),
		[dark_mode],
	);


	return (
		<React.StrictMode>
			<Provider store={store}>
				<BrowserRouter basename={basename}>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<ThemeProvider theme={theme}>
							<ColorModeHandler set_outer_dark_mode={set_dark_mode}/>	{/* set_outer_dark_mode - workaround, fix it */}
							<LocalStroageManager/>
							<FontSizeWrapper>
								<Header/>
								<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
									<DrawerHeader />	{/* top padding */}
									<Suspense fallback={<LinearProgress />}>
										<Switch>
											<Route exact path='/feed' component={FeedPage}/>
											<Route exact path='/search' component={SearchPage}/>
											<Route exact path='/settings' component={SettingsPage}/>
											<Route exact path='/about' component={AboutPage}/>
											<Route exact path='/help' component={HelpPage}/>
											<Redirect to='/feed'/>	{/* redirect to feed_page if not matched */}
										</Switch>
									</Suspense>
								</Box>
							</FontSizeWrapper>
							<ArticleModal/>
						</ThemeProvider>
					</LocalizationProvider>
				</BrowserRouter>
			</Provider>
		</React.StrictMode>
	)
}

ReactDOM.render( <Index />, document.getElementById('root') );