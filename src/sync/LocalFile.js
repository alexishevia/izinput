import { createStore } from "redux";
import reducer from "../reducer";

export default function LocalFile({ localStorage, remoteStorage }) {
  if (!localStorage) throw new Error("localStorage is required");
  if (!remoteStorage) throw new Error("remoteStorage is required");

  let text = "";
  let revision = null;
  let lineCount = -1;
  let store = createStore(reducer);

  // load() fetches data from localStorage
  async function load() {
    const str = await localStorage.read();
    if (!str) return;
    let initialState;
    ({ text, revision, lineCount, store: initialState } = JSON.parse(str));
    store = createStore(reducer, initialState);
  }

  // save() stores values into localStorage
  async function save() {
    await localStorage.write(
      JSON.stringify({ text, revision, lineCount, store: store.getState() })
    );
  }

  // process() runs actions through the store.
  // Note: ignores lines that have been processed before.
  function process() {
    text.split("\n").forEach((str, i) => {
      if (i <= lineCount) return;
      lineCount = i;
      if (!str) return;
      const action = JSON.parse(str);
      store.dispatch(action);
    });
  }

  // pull() fetches data from remoteStorage
  // Note: also updates localStorage.
  async function pull() {
    await load();
    const latestRevision = await remoteStorage.getLatestRevision();
    if (latestRevision === revision) return;
    await remoteStorage.pull();
    ({ text, revision } = remoteStorage);
    process();
    await save();
  }

  // push() saves data into remoteStorage
  // Note: also updates localStorage.
  async function push() {
    await remoteStorage.push({ text, revision });
    ({ revision } = remoteStorage);
    await save();
  }

  // appendActions() adds new actions to the localFile and processes them
  function appendActions(actions) {
    if (!actions.length) return;
    text = [text, ...actions.filter(Boolean).map(JSON.stringify)].join("\n");
    process();
  }

  // public interface
  return {
    get text() {
      return text;
    },
    get revision() {
      return revision;
    },
    get lineCount() {
      return lineCount;
    },
    get store() {
      return store;
    },
    save,
    pull,
    push,
    appendActions
  };
}
