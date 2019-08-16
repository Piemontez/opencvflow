cmake_minimum_required(VERSION 3.1.0)

message("Building IDE")

project(opencvflow)

add_definitions(-DAPP_FULL_NAME="OpenCVFlow")

#flags
#c++11flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 -pthread")

#compilerflag
IF(RELEASE)
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Werror -o2")
ELSE()
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Werror -g")
ENDIF()

#qtflags
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

if(CMAKE_VERSION VERSION_LESS "3.7.0")
    set(CMAKE_INCLUDE_CURRENT_DIR ON)
endif()

#dependencies
find_package(OpenCV REQUIRED)

find_package(Qt5 REQUIRED COMPONENTS Widgets)
get_target_property(QtCore_location Qt5::Core LOCATION)

#includes
include_directories(${OpenCV_INCLUDE_DIRS})


#make source files list
file(GLOB_RECURSE opencvflow_SRC src/*.cpp)

#remove main from list 
list(REMOVE_ITEM opencvflow_SRC "src/main.cpp")

#make include list
file(GLOB_RECURSE opencvflow_INCLUDE include/*.h)


#file to builder
add_executable(opencvflow
	src/main.cpp)

message(${OpenCV_LIBS})

target_link_libraries(opencvflow
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
