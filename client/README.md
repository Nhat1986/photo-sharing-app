# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

# Generating API types

This project relies heavily on the generation of an OpenAPI schema which is generated automatically by the backend api. Here in the client we can use this schema, along with two libraries which allow us to generate typesafe fetching endpoints.

   * openapi-typescript
   * openapi-fetch

Whenever this schema changes we will need to regenerate the types used to ensure they are in sync. in the future this will be managed more strictly using CI/CD processes, however at this time we can simply run:

```bash
npm run typegen
```

which will regenerate these types from the shared schema.