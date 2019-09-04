cmake_minimum_required(VERSION 3.1.0)

project(OpenCVFlowBuilder)

set(CMAKE_BUILD_TYPE Debug)
file(GLOB SOURCES "*.cpp")

#flags
#c++11flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 -pthread")

#compilerflag
IF(RELEASE)
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Werror -o2")
ELSE()
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Werror -g")
ENDIF()

#Sub Projects
add_subdirectory(ide)
add_subdirectory(plugins)
