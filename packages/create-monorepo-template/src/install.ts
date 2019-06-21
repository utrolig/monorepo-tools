import spawn from "cross-spawn";

export function runCommand(command: string, args: string[], cwd: string) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", cwd });
    child.on("close", code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(" ")}`
        });
        return;
      }
      resolve();
    });
  });
}

export async function installDependencies(destinationFolder: string) {
  const devDeps = ["create-monorepo-app"];
  const cmd = "yarnpkg";
  const args = ["add", "--dev", "--ignore-workspace-root-check"];
  return await runCommand(cmd, [...args, ...devDeps], destinationFolder);
}
