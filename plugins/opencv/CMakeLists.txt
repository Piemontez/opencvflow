cmake_minimum_required(VERSION 3.1.0 FATAL_ERROR)

message("Building OpenCV Plugin")
message("${PROJECT_NAME}")
message("Building OpenCV Plugin")

project(opencv VERSION 0.3.0 DESCRIPTION "OpenCV Plugin")

#flags
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

#includes
include_directories(
    ${opencvflow_SOURCE_DIR}/include
    ${OpenCV_INCLUDE_DIRS}
    include)


add_library(opencv SHARED
    src/opencvplugin.cpp)

#add ide libraries
#target_link_libraries(opencvflow)

install(TARGETS opencv
    DESTINATION bin)
