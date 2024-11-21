import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from 'redux-persist';
import rootReducer from "./rootReducer";
import { configureStore } from '@reduxjs/toolkit'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const makeStore = () => {
    return configureStore({
        devTools: process.env.NODE_ENV !== 'production',
        reducer: persistedReducer, //rootReducer,
        // include a custom middleware that enables caching and manages subscription lifetimes
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
            }
        })//.concat()
    })
}
 
export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
// export default store;