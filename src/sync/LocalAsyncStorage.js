import { AsyncStorage } from "react-native";

export default function LocalAsyncStorage(key) {
  if (!key) throw new Error("key is required");
  return {
    read: () => AsyncStorage.getItem(key),
    write: text => AsyncStorage.setItem(key, text),
    reset: () => AsyncStorage.removeItem(key)
  };
}
