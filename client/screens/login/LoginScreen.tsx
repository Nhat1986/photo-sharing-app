import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
} from 'react-native'
import { useFonts, Raleway_700Bold } from '@expo-google-fonts/raleway'
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito'
import { router } from 'expo-router'
import { api } from '@/external/fetch';
import { useUserSession } from '@/components/contexts/sessionContext'
import { authClient, saveToken } from '@/common/auth'
import { TokenType } from '@kinde-oss/react-native-sdk-0-7x'


async function getUser(userId:string) {
  const {data,error} = await api.GET('/user/{userId}',{
    params:{ path: {
      userId
    }}
  })

  if(error) return;

  return data.user;
}

export default function LogIn() {
//   if (__DEV__) {
//     const originalWarn = console.warn;
//     console.warn = (message, ...args) => {
//       if (message && message.includes('fontFamily') && message.includes('has not been loaded')) {
//         return; // Don't show font warnings
//       }
//       originalWarn(message, ...args); // Otherwise, show the warning
//     };
//   LogBox.ignoreLogs([
//     'fontFamily'  // This will ignore all warnings related to missing fonts
//   ]);
// }
const {updateSession} = useUserSession()


  const handleLogin = async () => {
    router.push('/(tabs)/albums')

   const token = await authClient.login();
    if (token) {
      // User was authenticated
      saveToken(token.access_token)

      // fetch user
      const userId = (await authClient.getClaim('sub',TokenType.ACCESS_TOKEN)).value
      const user = await getUser(userId)

      if(user == undefined) {
        router.push('/(routes)/login');
      }else{
        // Set user info in context
        updateSession({
          userId: user.id,
          firstName: user.firstName,
          lastName:user.lastName,
          profileImage:user.profileImage || '',
          isLoggedIn:true
        })

        router.push('/(tabs)/albums')
      }

    }
    else{
      router.push('/(routes)/login')
    } 
  };
  

  return (
    <ScrollView>
      <View className="flex-1 justify-center items-center pt-32">
        <Text
          style={{ fontFamily: 'Raleway_700Bold' }}
          className="font-medium text-3xl mb-4"
        >
          Memory Sharing
        </Text>
        <TouchableOpacity>
       
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue-600 p-3 w-60 mb-3 rounded-lg justify-center"
          onPress={handleLogin}
        >
          <Text
            className="text-white text-lg self-center"
            style={{ fontFamily: 'Nunito_700Bold' }}
          >
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-gray-300 p-3 w-60 rounded-3xl justify-center"
          onPress={() => router.push('/(routes)/signup')}
        >
          <Text
            className="text-white text-lg self-center"
            style={{ fontFamily: 'Nunito_700Bold' }}
          >
            create new account
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}