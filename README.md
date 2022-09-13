# NODEEYE

#### Nodeeye helps develop node.js applications by automatically restarting node application when file changes in the directory are detected.

### But it restart faster then any other libraries out there. as nodeeye only restart the require.cache but not the whole complete application proccess.

#### nodeeye does not require any additional changes to your code or method of development. nodeeye is a replacement wrapper for node. To use nodeeye, replace the word node on the command line when executing your script.

# Installation

Either through cloning with git or by using [npm](http://npmjs.org) (the recommended way):

```bash
npm install -g nodeeye # or using yarn: yarn global add nodeeye
```

And nodeeye will be installed globally to your system path.

You can also install nodeeye as a development dependency:

```bash
npm install --save-dev nodeeye # or using yarn: yarn add nodeeye -D
```

With a local installation, nodeeye will not be available in your system path or you can't use it directly from the command line. Instead, the local installation of nodeeye can be run by calling it from within an npm script (such as `npm start`) or using `npx nodeeye`.

# Usage

nodeeye wraps your application, so you can pass all the arguments you would normally pass to your app:

```bash
nodeeye [your node app] -d src
```

For CLI options, use the `-h` (or `--help`) argument:

```bash
nodeeye -h
```

Using nodeye is simple.
