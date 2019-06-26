declare module "postcss-safe-parser";
declare module "react-dev-utils/FileSizeReporter" {
  import { Stats } from "webpack";
  export type FileSizes = { root: any; sizes: any };
  export function measureFileSizesBeforeBuild(
    buildFolder: string
  ): Promise<FileSizes>;
  export function printFileSizesAfterBuild(
    stats: Stats,
    previousSizes: FileSizes,
    buildFolderPath: string,
    maxGzipSize: number,
    maxChunkGzipSize: number
  ): void;
}
