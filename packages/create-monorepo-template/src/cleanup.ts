import rimrafCb from "rimraf";
import { promisify } from "util";
const rimraf = promisify(rimrafCb);

export async function cleanUp(destinationFolder: string) {
  return rimraf(destinationFolder);
}
