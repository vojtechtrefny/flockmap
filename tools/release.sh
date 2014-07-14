#!/bin/bash

rsync --verbose -r --times --copy-links --delete index.html static build
