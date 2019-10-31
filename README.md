# Walter

First thing when cloning the repo:

## Install packages

```ps
> npm install
```

## Set up access configuration

Make a copy of `config.example.json` inside the `src` folder and name it `config.json`.

Add in there the bot prefix you want to use and your access token.

## Build

The project uses babel to transpile to ES2015, commands are already set up in `package.json`
Just run this command to build everything:

``` ps
> npm run build
```

## Debug

Using Visual Studio Code, just start the debugger and it will automagically compile & build.

The debugging for the TypeScript files is set up to work out of the box.

There is no hot-reload set up, so you'll have to restart the debugging process (this triggers a re-build) when you modify the source code.
