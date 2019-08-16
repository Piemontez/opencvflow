#include_directories(${CMAKE_SOURCE_DIR}/ide)
include_directories(${opencvflow_SOURCE_DIR})


#add ide libraries
target_link_libraries(plugins ide)