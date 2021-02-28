#ifndef GLOBALS_H
#define GLOBALS_H

#include <tuple>
#include "opencv2/core/mat.hpp"

namespace ocvflow
{
    class PluginInterface;

    enum ToolBarNames
    {
        FilesTB,
        SourcesTB,
        ProcessorsTB,
        ConnectorsTB,
        BuildTB,
        WindowTB
    };

    struct PropertiesVariant
    {
        PropertiesVariant(const bool b) : type{BOOL}, b{b} {}
        PropertiesVariant(const int i) : type{INT}, i{i} {}
        PropertiesVariant(const float f) : type{FLOAT}, f{f} {}
        PropertiesVariant(const double d) : type{DOUBLE}, d{d} {}
        PropertiesVariant(const int w, const int h) : type{INT_SIZE} { this->sizeI = std::make_tuple(w, h); }
        PropertiesVariant(cv::Mat mat)
        { /*this->mat = mat;*/
        }

        ~PropertiesVariant(){};
        PropertiesVariant(const PropertiesVariant &rvalue)
        {
            type = rvalue.type;
            switch (rvalue.type)
            {
            case BOOL: b = rvalue.b; break;
            case INT: i = rvalue.i; break;
            case FLOAT: f = rvalue.f; break;
            case DOUBLE: d = rvalue.d; break;
            case INT_SIZE: sizeI = rvalue.sizeI; break;
            case CV_MAT: mat = rvalue.mat; break;
            default:
                break;
            }
        };

        enum { 
            BOOL, INT, FLOAT, DOUBLE, INT_SIZE, CV_MAT
        } type;
        union
        {
            bool b;
            int i;
            float f;
            double d;
            std::tuple<int, int> sizeI;
            cv::Mat mat;
        };
    };

    enum Properties
    {
        EmptyProperties,
        BooleanProperties,
        IntProperties,
        FloatProperties,
        DoubleProperties,
        SizeIntProperties,
        OneZeroTableProperties,
        IntTableProperties,
        DoubleTableProperties,
        ScalarProperties
    };

// Define the API version.
#define OCVFLOW_PLUGIN_API_VERSION 1

#ifdef WIN32
#define OCVFLOW_PLUGIN_EXPORT __declspec(dllexport)
#else
#define OCVFLOW_PLUGIN_EXPORT // empty
#endif

    // Define a type for the static function pointer.
    OCVFLOW_PLUGIN_EXPORT typedef PluginInterface *(*GetPluginFunc)();

    // Plugin details structure that's exposed to the application.
    struct PluginDetails
    {
        int apiVersion;
        const char *fileName;
        const char *className;
        const char *pluginName;
        const char *pluginVersion;
        GetPluginFunc initializeFunc;
    };

#define OCVFLOW_STANDARD_PLUGIN_STUFF \
    OCVFLOW_PLUGIN_API_VERSION,       \
        __FILE__

#define OCVFLOW_PLUGIN(classType, pluginName, pluginVersion)         \
    extern "C"                                                       \
    {                                                                \
        OCVFLOW_PLUGIN_EXPORT ocvflow::PluginInterface *loadPlugin() \
        {                                                            \
            static classType singleton;                              \
            return &singleton;                                       \
        }                                                            \
        OCVFLOW_PLUGIN_EXPORT ocvflow::PluginDetails exports =       \
            {                                                        \
                OCVFLOW_STANDARD_PLUGIN_STUFF,                       \
                #classType,                                          \
                pluginName,                                          \
                pluginVersion,                                       \
                loadPlugin,                                          \
        };                                                           \
    }

} // namespace ocvflow

#endif // GLOBALS_H
