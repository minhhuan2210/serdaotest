import AsyncStorage from '@react-native-async-storage/async-storage';

class AsyncStorageClass {
  storeData = async (key: string, value: object) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log('error: ', e);
    }
  };

  getData = async <T>(key: string): Promise<T | undefined> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log('error: ', e);
    }
  };
}

export const Storage = new AsyncStorageClass();
