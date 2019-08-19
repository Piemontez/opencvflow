cmake_minimum_required(VERSION 3.1.0)

project(OpenCVFlowBuilder)

set(CMAKE_BUILD_TYPE Debug)
file(GLOB SOURCES "*.cpp")

#Sub Projects
add_subdirectory(ide)
add_subdirectory(plugins)
