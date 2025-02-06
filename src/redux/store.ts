import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import { baseApi } from './api/baseApi'
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist/es/constants";

const persistConfig = {
    key: "auth",
    storage,
};

// Combine Reducers
const rootReducer = combineReducers({
    auth: authReducer, 
    [baseApi.reducerPath]: baseApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ FIX: Ensure RTK Query Middleware is added
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(baseApi.middleware), // ✅ Add API middleware
});

// ✅ Pass store instance to persistStore
export const persistor = persistStore(store);

// ✅ Correct TypeScript types
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;