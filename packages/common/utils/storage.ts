import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const set_value = async(key: string, value: any) => {
    try {
        const json_val = value ? JSON.stringify(value) : ''; 
        if(Platform.OS == 'web'){
            await AsyncStorage.setItem(key, json_val);
        }
        else {
            await SecureStore.setItemAsync(key, json_val);
        }
    } catch (error) {
        throw error;
    }
}

export const get_value = async(key: string) => {
    try { 
        let json_val = null; 
        if(Platform.OS == 'web'){
            json_val = await AsyncStorage.getItem(key);
        }
        else {
            json_val = await SecureStore.getItemAsync(key); 
        }   
        return json_val != null ? JSON.parse(json_val) : null;
    } catch (error) {
        throw error;
    }
}

export const delete_value = async(key: string) => {
    try {
        if(Platform.OS == 'web'){
            return await AsyncStorage.removeItem(key);
        }
        else {
            return await SecureStore.deleteItemAsync(key);
        }
    } catch (error) { 
        throw error;
    }
}