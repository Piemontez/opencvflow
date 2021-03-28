#ifndef GLOBALS_H
#define GLOBALS_H

#include <string>
#include <tuple>
#include "opencv2/core/mat.hpp"

namespace ocvflow
{
    class PluginInterface;

    /**
     * Menus disponíveis na IDE
     */
    enum ToolBarNames
    {
        FilesTB,
        SourcesTB,
        ProcessorsTB,
        ConnectorsTB,
        BuildTB,
        WindowTB
    };

    /**
     * Tipos de propriedades de um nó
     */
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
        ScalarProperties,
        FileProperties
    };

    /**
     * Variável para tráfego de informação entre a ide e o nó.
     * Utilizado para descrever as propriedades de um nó.
     */
    struct PropertiesVariant
    {
        PropertiesVariant(const bool b) : type{BOOL}, b{b} {}
        PropertiesVariant(const int i) : type{INT}, i{i} {}
        PropertiesVariant(const float f) : type{FLOAT}, f{f} {}
        PropertiesVariant(const double d) : type{DOUBLE}, d{d} {}
        PropertiesVariant(const std::string &string) : type{STRING}, s{string} {}
        PropertiesVariant(const int w, const int h) : type{INT_SIZE} { this->sizeI = std::make_tuple(w, h); }
        PropertiesVariant(const double v0, const double v1, const double v2, const double v3) : type{SCALAR} { this->scalar = std::make_tuple(v0, v1, v2, v3); }
        PropertiesVariant(const cv::Mat mat) : type{CV_MAT}, mat{mat} {}

        operator bool() const { return b; }
        operator int() const { return i; }
        operator float() const { return f; }
        operator double() const { return d; }

        ~PropertiesVariant(){};
        PropertiesVariant(const PropertiesVariant &rvalue)
        {
            type = rvalue.type;
            switch (rvalue.type)
            {
            case BOOL:
                b = rvalue.b;
                break;
            case INT:
                i = rvalue.i;
                break;
            case FLOAT:
                f = rvalue.f;
                break;
            case DOUBLE:
                d = rvalue.d;
                break;
            case STRING:
                s = rvalue.s;
                break;
            case INT_SIZE:
                sizeI = rvalue.sizeI;
                break;
            case CV_MAT:
                mat = rvalue.mat;
                break;
            case SCALAR:
                scalar = rvalue.scalar;
                break;
            default:
                break;
            }
        };

        enum
        {
            BOOL,
            INT,
            FLOAT,
            DOUBLE,
            STRING,
            INT_SIZE,
            CV_MAT,
            SCALAR
        } type;
        union
        {
            bool b;
            int i;
            float f;
            double d;
            std::string s;
            std::tuple<int, int> sizeI;
            cv::Mat mat;
            std::tuple<double, double, double, double> scalar;
        };
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
