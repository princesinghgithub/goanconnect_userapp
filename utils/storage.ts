import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  get:    (key: string)                   => AsyncStorage.getItem(key),
  set:    (key: string, value: string)    => AsyncStorage.setItem(key, value),
  remove: (key: string)                   => AsyncStorage.removeItem(key),
  clear:  ()                              => AsyncStorage.clear(),

  getJSON: async <T>(key: string): Promise<T | null> => {
    const val = await AsyncStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  },
  setJSON: (key: string, value: any) =>
    AsyncStorage.setItem(key, JSON.stringify(value)),
};
