cmake_minimum_required(VERSION 3.1.0 FATAL_ERROR)

message("Building OpenCV Plugin")

project(opencv VERSION 0.3.0 DESCRIPTION "OpenCV Plugin")

#flags
#qtflags
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

if(CMAKE_VERSION VERSION_LESS "3.7.0")
    set(CMAKE_INCLUDE_CURRENT_DIR ON)
endif()

#dependencies
find_package(OpenCV REQUIRED)

find_package(Qt5 COMPONENTS REQUIRED Core Gui Widgets)
get_target_property(QtCore_location Qt5::Core LOCATION)

#includes
include_directories(
    ${opencvflow_SOURCE_DIR}/include
    ${OpenCV_INCLUDE_DIRS}
    include)


add_library(opencv SHARED
    src/imgproc.cpp
    src/imgprocproperties.cpp
    src/videoio.cpp
    src/videoioproperties.cpp
    src/imgcodecs.cpp
    src/imgcodecsproperties.cpp
    src/opencvplugin.cpp
    src/arithmetic.cpp
    src/arithmeticproperties.cpp)

#add ide libraries
target_link_libraries(opencv
    Qt5::Core
    Qt5::Widgets)

install(TARGETS opencv
    DESTINATION ${CVFLOW_INSTALL_PLUGIN_DIR})
