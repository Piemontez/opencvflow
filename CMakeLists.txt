cmake_minimum_required(VERSION 2.8.12.1)

set(CMAKE_BUILD_TYPE Debug)
file(GLOB SOURCES "*.cpp")

#Sub Projects
add_subdirectory(ide)
add_subdirectory(plugins)