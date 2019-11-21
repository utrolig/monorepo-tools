import spawn from "cross-spawn";
import chalk from "chalk";

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
  const deps = ["react", "react-dom", "redux", "react-redux"];

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
    "typescript",
    "@types/jest",
    "@types/react",
    "@types/react-dom",
    "react-monorepo-compiler"
  ];

  const cmd = "yarnpkg";
  const args = ["add", "--ignore-workspace-root-check"];
  const devArgs = ["add", "--dev", "--ignore-workspace-root-check"];

  console.log(chalk.blue("Installing dependencies"));
  await runCommand(cmd, [...args, ...deps], destinationFolder);

  console.log(chalk.blue("Installing devDependencies"));
  await runCommand(cmd, [...devArgs, ...devDeps], destinationFolder);
}
