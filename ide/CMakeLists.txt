cmake_minimum_required(VERSION 2.8.12.1)

project(opencvflow)

#flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 -pthread")

#dependencies
find_package( OpenCV REQUIRED )

find_package(PkgConfig REQUIRED)
pkg_check_modules(JSONCPP jsoncpp)

#file to builder
add_executable(opencvflow
	main.cpp)

target_link_libraries(opencvflow
  ${OpenCV_LIBS}
  ${JSONCPP_LIBRARIES})

install(TARGETS opencvflow DESTINATION bin)
