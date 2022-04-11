# MvcCore - Extension - Form - Javascripts

[![Latest Stable Version](https://img.shields.io/badge/Stable-v5.0.1-brightgreen.svg?style=plastic)](https://github.com/mvccore/ext-form-js/releases)
[![License](https://img.shields.io/badge/License-BSD%203-brightgreen.svg?style=plastic)](https://mvccore.github.io/docs/mvccore/5.0.0/LICENSE.md)
[![Google Closure Build](https://img.shields.io/badge/Google%20Closure%20Build-passing-brightgreen.svg?style=plastic)](https://developers.google.com/closure/compiler/)

Node.JS builder to compile custom javascripts for PHP library MvcCore Form Extension ([mvccore/ext-form](https://github.com/mvccore/ext-form)), which serves web forms and much more.

Javascript files in current stable version `5.0` are compatible with `MvcCore Form Extension` with versions `4.x` and `5.x`.

Custom javascripts are compiled by **Google Closure Compiller** with advanced compilation.

## Instalation
Go to directory, where you want to place and add to base MvcCore form javascript files you custom javascript support code and run:

#### Windows
```cmd
:: create new empty directory "mvccore-ext-form-js"
mkdir mvccore-ext-form-js

:: clone this repository into newly created folder
git clone https://github.com/mvccore/ext-form-js mvccore-ext-form-js

:: go to repository folder
cd mvccore-ext-form-js

:: go to repository latest release (optional)
php -r "$a=shell_exec('git ls-remote --tags .');$b=explode('refs/tags/',$a);$c=trim($b[count($b)-1]);shell_exec('git checkout tags/'.$c);"

:: remove whole '.git' directory, git history (you don't need this repository history in your project repo)
rmdir /S /Q .git

:: load this node package dependencies
call npm update

:: call this node package install script
call node install.js

:: follow instructions on the screen
```
#### Linux
```shell
#!/bin/bash

# create new empty directory "mvccore-ext-form-js"
mkdir mvccore-ext-form-js

# clone this repository into newly created folder
git clone https://github.com/mvccore/ext-form-js mvccore-ext-form-js

# go to repository folder
cd mvccore-ext-form-js

# go to repository latest release (optional)
php -r "$a=shell_exec('git ls-remote --tags .');$b=explode('refs/tags/',$a);$c=trim($b[count($b)-1]);shell_exec('git checkout tags/'.$c);"

# remove whole '.git' directory, git history (you don't need this repository history in your project repo)
rm -r -f .git

# load this node package dependencies
sh -c "npm update"

# call this node package install script
sh -c "node install.js"

# follow instructions on the screen
```

## Excending and custom javascript development
- add, change or remove anything in "mvccore-ext-form-js/src/*.js"
- configure output location in "mvccore-ext-form-js/dev-tools/build.js"
- build your new javascript files
- configure PHP library MvcCore Form Extension to use your custom javascripts

## Building

#### Windows
```shell
cd mvccore-ext-form-js/dev-tools
build.cmd
```
#### Linux
```shell
cd mvccore-ext-form-js/dev-tools
sh build.sh
```

### Configuration
- open file "mvccore-ext-form-js/dev-tools/build.js"
- edit lines 14 and 15 to change compiled javascript files destination