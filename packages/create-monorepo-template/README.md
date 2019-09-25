# create-monorepo-template

Bootstrap a monorepo for front-end applications. Uses [Create Monorepo App](https://github.com/utrolig/monorepo-tools/tree/master/packages/create-monorepo-app) to bootstrap applications inside the monorepo.

```sh
npx create-monorepo-template my-app
```

It will create a directory called `my-app` inside the current folder.<br>
Inside that directory, it will generate the initial monorepo structure and install the `devDependencies`
It uses eslint internally.

```
my-app
├── package.json
└── packages
```

Once the installation is done, you can open your project folder:

```sh
cd my-app
```

Inside the newly created project, you can run `yarn new` to bootstrap a new app.
