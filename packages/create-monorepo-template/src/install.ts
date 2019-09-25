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
  const devDeps = [
    "create-monorepo-app",
    "eslint",
    "eslint-config-react-app",
    "@typescript-eslint/eslint-plugin@2.x",
    "@typescript-eslint/parser@2.x",
    "babel-eslint@10.x",
    "eslint-plugin-flowtype@3.x",
    "eslint-plugin-import@2.x",
    "eslint-plugin-jsx-a11y@6.x",
    "eslint-plugin-react@7.x",
    "eslint-plugin-react-hooks@1.x",
    "typescript"
  ];
  const cmd = "yarnpkg";
  const args = ["add", "--dev", "--ignore-workspace-root-check"];
  return await runCommand(cmd, [...args, ...devDeps], destinationFolder);
}
