#!/bin/bash
sudo apt-get install libasound2-dev
npm install
bower install
grunt uglify
grunt compass
grunt