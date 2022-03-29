# React example front application (in progress)
This is a simple example of React app. It accesses and displays data from REST services provided by java-example-services project (or nodejs-example-services) on port 9080.

The code was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) v5.0 tool - which provides ready to use Webpack configuration along with JSX.

The application is complimentary with my [spark-dataprocessing](https://github.com/banksone/spark-dataprocessing) project which contains an httpd docker container dedicated to serving the app and connecting with API served by my [java-example-services](https://github.com/banksone/java-example-services) project.

The Httpd Docker container is configured vis two files boc-httpd.conf (enabling required modules including mod_proxy) and site.conf setting a virtual host that proxy-passes API requests to the Java docker container.

In order to use the application with the whole environment, you should make a build

```
npm run build
```

Next, copy the content of the build directory into the public directory of [spark-dataprocessing](https://github.com/banksone/spark-dataprocessing) project. 
Besides the React app, you have to copy also the JAR file from [java-example-services](https://github.com/banksone/java-example-services) project into the main folder of the spark-processing project.

In the future, I will include some continuous integration and continuous delivery in the project to connect all the components.

status: application loads language configuration JSON and collects a list of movies from API.

## Scripts

### `npm start`
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`
Builds the app for production to the `build` folder.\
