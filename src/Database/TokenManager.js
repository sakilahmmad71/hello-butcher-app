import AsyncStorage from '@react-native-community/async-storage';

const setToken = async(key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch(error) {
      console.log(error);
    }
}

const getToken = async(key) => {
  try {
       const result = await AsyncStorage.getItem(key);
       console.log(result);
       return result;
    } catch(error) {
      console.log(error);
    }
}

export { setToken, getToken };