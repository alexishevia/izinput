import { Dropbox } from "dropbox";

export default async function getFileRevision({ accessToken, path }) {
  const dropbox = new Dropbox({ fetch: global.fetch, accessToken });
  const data = await dropbox.filesGetMetadata({ path });
  if (data[".tag"] !== "file") {
    throw new Error(`The provided path does not point to a file: ${path}`);
  }
  return data.rev;
}
