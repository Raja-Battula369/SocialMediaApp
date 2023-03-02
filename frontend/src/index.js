import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { persistStore, persistReducer, PERSIST, FLUSH, REHYDRATE, PAUSE, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import authRender from './State/State';


import { ChakraBaseProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";


const persistConfig = { key: 'root', storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authRender);
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, PERSIST, REHYDRATE, REGISTER, PURGE, PAUSE],
            }
        }),

});


const config = {
    initialColorMode: "light",
    useSystemColorMode: false,
};
const theme = extendTheme({ config })

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ChakraBaseProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />

            <Provider store={store}>
                <PersistGate loading={null} persistor={persistStore(store)}>
                    <App />
                </PersistGate>
            </Provider>

        </ChakraBaseProvider>

    </React.StrictMode>
);


