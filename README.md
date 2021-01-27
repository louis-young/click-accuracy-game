# Click Accuracy Game

Native JavaScript ES6+ object-orientated click accuracy game.

![Click Accuracy Game](documentation/click-accuracy-game.jpg)

## Description

This is a game which tests mouse accuracy and click speed by generating clickable targets at random coordinates and calculating metrics at the end.

## Motivation

I built this game to learn more about object oriented programming and to better my native JavaScript skills.

### Project Structure

#### Features

- Scalable and modular architecture
- Local development server
- Markup, Sass and JavaScript linting
- Sass preprocessing, autoprefixing and minification
- JavaScript transpiling and minification
- Static asset optimization

#### System Requirements

You'll need the following installed on your local machine.

1.  [Node.js](https://nodejs.org/en/download/)

#### Setup

**1. Clone the repository and install with NPM**

To set up the project structure, simply clone the git repository and install NPM.

```
$ git clone git@bitbucket.org:FluidStudiosStaff/project-structure.git
$ npm install
```

**2. Run**

There are different tasks which you can run depending on your needs:

- `$ npm start` - start a development server and live watch file changes.
- `$ npm run build` - build source files for production.
- `$ npm run package` - generate a production archive which is ready to deploy.
- `$ npm run clean` - clean the distributable directory.
- `$ npm run lint` - lint scripts, stylesheets and HTML.

Simply run any command in the project root directory;

`$ npm start`

#### Architecture

The root contains two directories:

- `node_modules`

- `public`

`node_modules` can be ignored by developers as they never need to be edited. They are automatically populated based on the dependencies when you install the node packages.

Inside of `public` there are two directories:

- `dist`

- `src`

`dist` contains a compiled version of the source code/assets and should only be deployed, not edited.

`src` contains source code.

Inside of `src` there are three directories:

- `assets` - contains all of the assets used in the project such as images, videos etc.

- `scripts` - contains sub directories containing your JavaScript, frameworks and libraries.

- `stylesheets` - contains the Sass architecture.

#### JavaScript

The JavaScript workflow has been designed so that there's as few server requests as possible whilst still allowing an efficient and modular way to create and edit scripts.

Scripts are linted automatically for you to ensure a high code standard and fewer errors at runtime.

The `scripts` directory in the project structure contains sub directories for your JavaScript, frameworks and libraries.

The `main.js` file in located in the root of `scripts`.

The JavaScript structure is as follows:

- `public/src/scripts/main.js` The main JavaScript file.

- `public/src/scripts/vendor/*.js` Third party scripts/libraries/frameworks.

#### Miscellaneous

##### Linting

All of your HTML, Sass and JavaScript is automatically linted on change. The output will appear in the console and will prevent poor code, bad convention and will lower the amount of silent/runtime errors.

This can also be run as a separate task by running `$ npm run lint`.

These can be configured by editing the associated linter configuration file in the project root.

##### Sourcemaps

When using compilers and combining files, you need to keep track (a map) of where this code originated from. This helps immensely when debugging a project as you can see which file an error/warning is being thrown from and view this as source code.

Simply use developer tools as you would usually, it's all handled for you.

##### Media Queries

The new project structure contains a series of custom mixins for responsive breakpoints within Sass. This system is very user friendly and allows anyone an easy way to change, add or remove breakpoints.

The usage is as follows:

```scss
body {
  background: red;
  @include tablet {
    background: blue;
  }
}
```

This means that on a mobile viewport, the background will be red. When you reach a tablet viewport width, the background will become blue. This allows for media queries to be contained within a single rule set and makes code much more readable and maintainable. It's also faster to write.

##### Containers

The new project structure contains a modular and reusable container Sass file which holds all of the project containers. This is very easy to add to, remove or change.

This container uses percentile units which are inherently responsive. It has a max width and is designed to be the main container of the site.

The usage is as follows:

```html
<div class="container"></div>
```

There is also variations of the container which can be used like so

```html
<div class="container container--small"></div>
<div class="container container--large"></div>
```

##### Variables

The new project structure contains a modular and reusable variables file which will contain all of the variables used in the project. It's extremely easy to edit, add to or remove.

It contains a main primary colour variable, which can be used throughout the site as well as a dark, light and transparent version dynamically generated for you.

The usage is as follows:

```scss
body {
  color: $primary-color;
  background-color: $primary-color-light;
  &:hover {
    color: $primary-color-dark;
    background-color: $primary-color-transparent;
  }
}
```

The new project structure also contains font weight variables, from thin to heavy inclusive.

The usage is as follows:

```scss
body {
  font-weight: $semi-bold;
}
```

In addition, the Google Material Design pallette has been included.

The usage is as follows:

```scss
body {
	color: $light-blue;
	background-color: $red-50;
	&:hover {
	color: $red-500;
	background-color: $deep-purple-700;
}
```

#### Compilation

##### Sass

Every Sass file and partial is linted, compiled, minified, prefixed and added in to the `main.min.css` file in the `dist` directory. This is ready to be deployed.

##### JavaScript

You can place multiple scripts in any of the scripts directories. These will all be compiled and bundled in to a single file per directory and moved in to the `dist` directory.

##### Assets

Static assets are automatically compressed/optimised and moved to the `dist` directory. This supports most common static asset file types.
