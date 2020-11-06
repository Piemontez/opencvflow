#!/bin/bash

CREATE_BUILD_FOLDER_IF_DOESNT_EXIST() {
    if [ ! -d build ]
    then
        mkdir -p build
    fi
}

INSTALL() {
    CREATE_BUILD_FOLDER_IF_DOESNT_EXIST;
    cmake -D RELEASE=ON .
    make
}

INSTALL;
