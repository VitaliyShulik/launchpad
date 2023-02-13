# How to make an application build and host an application on your domain

0. Install dependencies if you haven't already

    ```bash
    yarn
    ```

1. Build app

    ```bash
    yarn build
    ```

In order to host an application on your domain, you may consult the official documentation regarding [deployment using create-react-app](https://create-react-app.dev/docs/deployment/). As an alternative, GitHub Pages is a straightforward option that we would recommend.

The easiest way to start from scratch:
    1. Open DNS (if there is no domain, then first we buy it)
    2. Create a GitHub repository (from the`build` folder)
    3. Enable Github pages
    4. Bind domain

If you have a hosting:
    1. Open it
    2. Open file manager, create a folder
    3. Upload files (from the`build` folder) there
