project(cgExercise)
cmake_minimum_required(VERSION 2.4)

if(COMMAND cmake_policy)
   cmake_policy(SET CMP0003 NEW)
endif(COMMAND cmake_policy)

#set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} ${CMAKE_CURRENT_SOURCE_DIR}/cmake)

find_package(OpenGL REQUIRED)
find_package(GLUT REQUIRED)
find_package(GLEW REQUIRED)
find_package(Threads)
include_directories( ${OPENGL_INCLUDE_DIRS}  ${GLUT_INCLUDE_DIR} ${GLEW_INCLUDE_DIRS} ${CMAKE_CURRENT_SOURCE_DIR})

add_executable(cgExercise01 main01.cpp inc/lodepng.cpp shader01.frag shader01.vert shader01.geom)
target_link_libraries(cgExercise01 ${OPENGL_gl_LIBRARY} ${OPENGL_glu_LIBRARY} ${GLEW_LIBRARIES} ${GLUT_glut_LIBRARY} ${CMAKE_THREAD_LIBS_INIT})

if(EXISTS ${CMAKE_CURRENT_SOURCE_DIR}/main02.cpp)
add_executable(cgExercise02 main02.cpp inc/lodepng.cpp shader02.frag shader02.vert shader02.geom)
target_link_libraries(cgExercise02 ${OPENGL_gl_LIBRARY} ${OPENGL_glu_LIBRARY} ${GLEW_LIBRARIES} ${GLUT_glut_LIBRARY} ${CMAKE_THREAD_LIBS_INIT})
endif()

if(EXISTS ${CMAKE_CURRENT_SOURCE_DIR}/main03.cpp)
add_executable(cgExercise03 main03.cpp inc/lodepng.cpp shader03.frag shader03.vert shader03.geom)
target_link_libraries(cgExercise03 ${OPENGL_gl_LIBRARY} ${OPENGL_glu_LIBRARY} ${GLEW_LIBRARIES} ${GLUT_glut_LIBRARY} ${CMAKE_THREAD_LIBS_INIT})
endif()

if(EXISTS ${CMAKE_CURRENT_SOURCE_DIR}/main04a.cpp)
add_executable(cgExercise04a main04a.cpp inc/lodepng.cpp shader04a.frag shader04a.vert shader04a.geom)
target_link_libraries(cgExercise04a ${OPENGL_gl_LIBRARY} ${OPENGL_glu_LIBRARY} ${GLEW_LIBRARIES} ${GLUT_glut_LIBRARY} ${CMAKE_THREAD_LIBS_INIT})
endif()

if(EXISTS ${CMAKE_CURRENT_SOURCE_DIR}/main04b.cpp)
add_executable(cgExercise04b main04b.cpp inc/lodepng.cpp shader04b.frag shader04b.vert)
target_link_libraries(cgExercise04b ${OPENGL_gl_LIBRARY} ${OPENGL_glu_LIBRARY} ${GLEW_LIBRARIES} ${GLUT_glut_LIBRARY} ${CMAKE_THREAD_LIBS_INIT})
endif()

if(EXISTS ${CMAKE_CURRENT_SOURCE_DIR}/main05.cpp)
add_executable(cgExercise05 main05.cpp inc/lodepng.cpp shader05.frag shader05.vert)
target_link_libraries(cgExercise05 ${OPENGL_gl_LIBRARY} ${OPENGL_glu_LIBRARY} ${GLEW_LIBRARIES} ${GLUT_glut_LIBRARY} ${CMAKE_THREAD_LIBS_INIT})
endif()
