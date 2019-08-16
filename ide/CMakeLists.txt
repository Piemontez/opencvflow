cmake_minimum_required(VERSION 3.1.0)

project(opencvflow)

add_definitions(-DAPP_FULL_NAME="OpenCVFlow")

#flags
#c++11flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 -pthread")

#qtflags
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

if(CMAKE_VERSION VERSION_LESS "3.7.0")
    set(CMAKE_INCLUDE_CURRENT_DIR ON)
endif()

#compilerflag
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall")

#dependencies
find_package(OpenCV REQUIRED)

find_package(Qt5 REQUIRED COMPONENTS Widgets)
get_target_property(QtCore_location Qt5::Core LOCATION)

#file to builder
add_executable(opencvflow
	main.cpp)

target_link_libraries(opencvflow ${OpenCV_LIBS} Qt5::Widgets)

install(TARGETS opencvflow DESTINATION bin)
