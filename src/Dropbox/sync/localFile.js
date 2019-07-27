/* eslint no-console:[0] */

import { AsyncStorage } from "react-native";

const LOCAL_ITEM_KEY = "IZINPUT_LOCAL_COPY";

const defaultPlaybook = {
  contents: "",
  revision: null,
  store: [], // transactions
  lastAction: -1
};

// readL gets the latest known playbook data from the local fileSystem
async function read() {
  try {
    // await AsyncStorage.removeItem(LOCAL_ITEM_KEY);
    const str = await AsyncStorage.getItem(LOCAL_ITEM_KEY);
    if (!str) return defaultPlaybook;
    return JSON.parse(str);
  } catch (err) {
    console.log("Error while reading local file:", err);
    return defaultPlaybook;
  }
}

// write saves playbook data into the local filesystem
function write(data) {
  return AsyncStorage.setItem(LOCAL_ITEM_KEY, JSON.stringify(data));
}

export default {
  read,
  write
};
