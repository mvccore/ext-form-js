# MvcCore Extension - Form - Custom Javascripts

[![Latest Stable Version](https://img.shields.io/badge/Stable-v4.2.0-brightgreen.svg?style=plastic)](https://github.com/mvccore/ext-form-js/releases)
[![License](https://img.shields.io/badge/Licence-BSD-brightgreen.svg?style=plastic)](https://mvccore.github.io/docs/mvccore/4.0.0/LICENCE.md)
[![Google Closure Build](https://img.shields.io/badge/Google%20Closure%20Build-passing-brightgreen.svg?style=plastic)](https://developers.google.com/closure/compiler/)

Node.JS builder to compile custom javascripts for PHP library MvcCore Form Extension ([mvccore/ext-form](https://github.com/mvccore/ext-form)), which serves web forms and much more.

Custom javascripts are compiled by **Google Closure Compiller** with advanced compilation.

## Instalation
#### Windows
```cmd
:: create new mpty directory "mvccore-ext-form-js"
mkdir mvccore-ext-form-js
:: clone this repository into newly created folder
git clone https://github.com/mvccore/ext-form-js mvccore-ext-form-js
:: go to repository folder
cd mvccore-ext-form-js
:: go to repository latest release
php -r "$a=shell_exec('git ls-remote --tags .');$b=explode('refs/tags/',$a);$c=trim($b[count($b)-1]);shell_exec('git checkout tags/'.$c);"
:: remove whole '.git' directory, git history (you don't need this repository history in your project repo)
rmdir /S /Q .git
:: load this node package dependencies
call npm update
:: call this node package install script
call node install.js
:: go to start parent directory
cd ../..
```
#### Linux
```shell
# create new mpty directory "mvccore-ext-form-js"
mkdir mvccore-ext-form-js
# clone this repository into newly created folder
git clone https://github.com/mvccore/ext-form-js mvccore-ext-form-js
# go to repository folder
cd mvccore-ext-form-js
# go to repository latest release
php -r "$a=shell_exec('git ls-remote --tags .');$b=explode('refs/tags/',$a);$c=trim($b[count($b)-1]);shell_exec('git checkout tags/'.$c);"
# remove whole '.git' directory, git history (you don't need this repository history in your project repo)
rm -r -f .git
# load this node package dependencies
npm update
# call this node package install script
node install.js
# go to start parent directory
cd ../..
```

## Excending and custom javascript development
- add, change or remove anything in "node_modules/ext-form-js/src/*.js"
- build your new javascript files
- configure PHP library MvcCore Form Extension to use your custom javascripts

## Building

### Configuration
- open file "node_modules/ext-form-js/dev-tools/build.js"
- edit lines 14 and 15 to change compiled javascript files destination

### Windows
```shell
cd node_modules/ext-form-js/dev-tools
build.cmd
```

### Mac/Linux
```shell
cd node_modules/ext-form-js/dev-tools
sh build.sh
```
