import { Dropbox } from "dropbox";
import { Buffer } from "buffer";

export default async function dropboxWriteFile({
  accessToken,
  path,
  text,
  revision
}) {
  const dropbox = new Dropbox({ fetch: global.fetch, accessToken });
  const metaData = await dropbox.filesUpload({
    path,
    // converting to Buffer to get around dropbox issue
    // https://github.com/dropbox/dropbox-sdk-js/issues/179
    contents: Buffer.from(text),
    // for more info about `mode` see:
    // https://dropbox.github.io/dropbox-sdk-js/global.html#FilesCommitInfo
    mode: { ".tag": "update", update: revision }
  });
  return {
    revision: metaData.rev || revision,
    path: metaData.path_lower || path
  };
}
