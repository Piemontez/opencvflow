#ifndef GLOBALS_H
#define GLOBALS_H

#include <tuple>

namespace ocvflow {

class PluginInterface;

enum ToolBarNames {
    FilesTB,
    SourcesTB,
    ProcessorsTB,
    ConnectorsTB,
    BuildTB,
    WindowTB
};

union PropertiesVariant {
    bool b;
    int i;
    float f;
    double d;
    std::tuple<int, int> sizeI;

    PropertiesVariant(bool b) {this->b = b;}
    PropertiesVariant(int i) {this->i = i;}
    PropertiesVariant(float f) {this->f = f;}
    PropertiesVariant(double d) {this->d = d;}
    PropertiesVariant(int w, int h) {this->sizeI = std::make_tuple(w,h);}

    ~PropertiesVariant() {};
};

enum Properties {
    EmptyProperties,
    BooleanProperties,
    IntProperties,
    FloatProperties,
    DoubleProperties,
    SizeIntProperties,
    IntTableProperties,
    DoubleTableProperties
};


// Define the API version.
#define OCVFLOW_PLUGIN_API_VERSION 1

#ifdef WIN32
# define OCVFLOW_PLUGIN_EXPORT __declspec(dllexport)
#else
# define OCVFLOW_PLUGIN_EXPORT // empty
#endif

// Define a type for the static function pointer.
OCVFLOW_PLUGIN_EXPORT typedef PluginInterface* (*GetPluginFunc)();

// Plugin details structure that's exposed to the application.
struct PluginDetails {
    int apiVersion;
    const char* fileName;
    const char* className;
    const char* pluginName;
    const char* pluginVersion;
    GetPluginFunc initializeFunc;
};

#define OCVFLOW_STANDARD_PLUGIN_STUFF \
    OCVFLOW_PLUGIN_API_VERSION,       \
    __FILE__

#define OCVFLOW_PLUGIN(classType, pluginName, pluginVersion)    \
  extern "C" {                                                  \
      OCVFLOW_PLUGIN_EXPORT ocvflow::PluginInterface* loadPlugin()    \
      {                                                         \
          static classType singleton;                           \
          return &singleton;                                    \
      }                                                         \
      OCVFLOW_PLUGIN_EXPORT ocvflow::PluginDetails exports = \
      {                                                         \
          OCVFLOW_STANDARD_PLUGIN_STUFF,                        \
          #classType,                                           \
          pluginName,                                           \
          pluginVersion,                                        \
          loadPlugin,                                           \
      };                                                        \
  }

}

#endif // GLOBALS_H
