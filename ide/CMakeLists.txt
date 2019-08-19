cmake_minimum_required(VERSION 3.1.0 FATAL_ERROR)

message("Building IDE")

project(opencvflow)

#definitions
add_definitions(-DAPP_FULL_NAME="OpenCVFlow")

#flags
#qtflags
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

if(CMAKE_VERSION VERSION_LESS "3.7.0")
    set(CMAKE_INCLUDE_CURRENT_DIR ON)
endif()

#c++11flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 -pthread")

#compilerflag
IF(RELEASE)
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Werror -o2")
ELSE()
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Werror -g")
ENDIF()

#dependencies
find_package(OpenCV REQUIRED)

find_package(Qt5 COMPONENTS REQUIRED Core Gui Widgets)
get_target_property(QtCore_location Qt5::Core LOCATION)

#make source files list
file(GLOB_RECURSE opencvflow_SRC src/*.cpp)

#remove main from list 
list(REMOVE_ITEM opencvflow_SRC "src/main.cpp")

#make include list
file(GLOB_RECURSE opencvflow_INCLUDE include/*.h)

#includes
include_directories(${OpenCV_INCLUDE_DIRS}
    include)


#file to builder
add_executable(opencvflow
    src/main.cpp
    src/window.cpp
    src/node.cpp)

target_link_libraries(opencvflow
    Qt5::Core
    Qt5::Gui 
    Qt5::Widgets
#    ${OpenCV_LIBS}
    opencv_core
#    opencv_highgui
#    opencv_imgcodecs
#    opencv_imgproc
#    opencv_features2d
#    opencv_calib3d
#    opencv_video
#    opencv_videoio
#    opencv_optflow
)

install(TARGETS opencvflow DESTINATION bin)
