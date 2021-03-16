cmake_minimum_required(VERSION 3.1.0 FATAL_ERROR)

message("Building Tools Plugin")

project(tools VERSION 0.3.0 DESCRIPTION "Tools Plugin")

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

find_package(QT NAMES Qt6 Qt5 COMPONENTS Core REQUIRED)
find_package(Qt${QT_VERSION_MAJOR} COMPONENTS REQUIRED Core Gui Widgets Charts DataVisualization REQUIRED)
get_target_property(QtCore_location Qt${QT_VERSION_MAJOR}::Core LOCATION)

qt5_wrap_cpp(MOC_Files
    include/nodetools.h
)


#includes
include_directories(
    ${opencvflow_SOURCE_DIR}/include
    ${OpenCV_INCLUDE_DIRS}
    include)

add_library(tools SHARED
    src/nodetools.cpp
    src/toolsplugin.cpp
    ${MOC_Files}
)

#add ide libraries
target_link_libraries(tools
    Qt${QT_VERSION_MAJOR}::Core
    Qt${QT_VERSION_MAJOR}::Widgets
    Qt${QT_VERSION_MAJOR}::Charts
    Qt${QT_VERSION_MAJOR}::DataVisualization
)

install(TARGETS tools
    DESTINATION ${CVFLOW_INSTALL_PLUGIN_DIR})