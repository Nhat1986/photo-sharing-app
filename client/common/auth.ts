import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { KindeSDK } from '@kinde-oss/react-native-sdk-0-7x';


// Access environment variables with optional chaining and default values
const KINDE_ISSUER_URL = Constants.expoConfig?.extra?.KINDE_ISSUER_URL ?? '';
const KINDE_POST_CALLBACK_URL = Constants.expoConfig?.extra?.KINDE_POST_CALLBACK_URL ?? '';
const KINDE_CLIENT_ID = Constants.expoConfig?.extra?.KINDE_CLIENT_ID ?? '';
const KINDE_POST_LOGOUT_REDIRECT_URL = Constants.expoConfig?.extra?.KINDE_POST_LOGOUT_REDIRECT_URL ?? '';


// Initialize KindeSDK
export const authClient = new KindeSDK(
    KINDE_ISSUER_URL,
    KINDE_POST_CALLBACK_URL,
    KINDE_CLIENT_ID,
    KINDE_POST_LOGOUT_REDIRECT_URL
  );


export async function saveToken(token: string) {
    await SecureStore.setItemAsync('accessToken', token);
  }  
  
export async function getToken() {
    return await SecureStore.getItemAsync('accessToken');
  }