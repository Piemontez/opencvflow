CREATE_BUILD_FOLDER_IF_DOESNT_EXIST() {
    if [ ! -d build ]
    then
        mkdir -p build
    fi
}

INSTALL() {
    CREATE_BUILD_FOLDER_IF_DOESNT_EXIST;
    cmake --no-warn-unused-cli \
        -DDCMAKE_INSTALL_PREFIX=opencvflow \
	    -DCMAKE_EXPORT_COMPILE_COMMANDS:BOOL=TRUE \
	    -DCMAKE_BUILD_TYPE:STRING=Release \
	    -DCMAKE_C_COMPILER:FILEPATH=/usr/bin/gcc \
	    -DCMAKE_CXX_COMPILER:FILEPATH=/usr/bin/g++ \
	    -H./  -B./build -G "Unix Makefiles"
}

INSTALL;
