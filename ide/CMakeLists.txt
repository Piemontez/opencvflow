cmake_minimum_required(VERSION 3.1.0 FATAL_ERROR)

message("Building IDE")

project(opencvflow VERSION 0.1.0 DESCRIPTION "OpenCVFlow IDE")

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

#dependencies
find_package(OpenCV REQUIRED)

find_package(QT NAMES Qt6 Qt5 COMPONENTS Core REQUIRED)
find_package(Qt${QT_VERSION_MAJOR} COMPONENTS Core Gui Widgets REQUIRED)
get_target_property(QtCore_location Qt${QT_VERSION_MAJOR}::Core LOCATION)

#qt5_wrap_cpp(MOC_Files
#)

#includes
include_directories(
    ${opencvflow_SOURCE_DIR}/include
    ${OpenCV_INCLUDE_DIRS}
    include)

#file to builder
add_executable(opencvflow
    src/main.cpp
    #base
    src/window.cpp
    src/centralwidget.cpp
    src/node.cpp
    src/edge.cpp
    src/component.cpp
    #grapichs
    src/nodeitem.cpp
    src/nodemenuitem.cpp
    src/nodeitem.cpp
    src/edgeitem.cpp
    src/fakeedgeitem.cpp
    #extras
    src/action.cpp
    #qrc
    resources/resources.qrc
    #${MOC_Files}
)

target_link_libraries(opencvflow
    Qt${QT_VERSION_MAJOR}::Core
    Qt${QT_VERSION_MAJOR}::Gui 
    Qt${QT_VERSION_MAJOR}::Widgets
    ${CMAKE_DL_LIBS}
    opencv_core
    opencv_imgproc
    opencv_videoio
)

install(TARGETS opencvflow 
    RUNTIME DESTINATION ${CVFLOW_INSTALL_BIN_DIR})
