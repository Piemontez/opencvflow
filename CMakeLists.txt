cmake_minimum_required(VERSION 3.1.0)

project(OpenCVFlowBuilder)

set(CMAKE_BUILD_TYPE Debug)
file(GLOB SOURCES "*.cpp")

#flags
#c++11flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14 -pthread")

set(CVFLOW_INSTALL_DIR      "${CMAKE_CURRENT_BINARY_DIR}/dist")
set(CVFLOW_INSTALL_BIN_DIR  "${CVFLOW_INSTALL_DIR}/bin")
set(CVFLOW_INSTALL_PLUGIN_DIR  "${CVFLOW_INSTALL_DIR}/plugins")

message(STATUS "INSTALL_DIR = ${CVFLOW_INSTALL_DIR}")

#compilerflag
IF(RELEASE)
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Werror -o2")
ELSE()
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Werror -g")
ENDIF()

#Sub Projects
add_subdirectory(ide)
add_subdirectory(plugins)
