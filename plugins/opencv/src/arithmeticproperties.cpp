#include "arithmetic.h"

/**
 * @brief ArithmeticKernelNode::properties
 * @return
 */
QMap<QString, ocvflow::Properties> ArithmeticKernelNode::properties()
{
    QMap<QString, ocvflow::Properties> props;
    props.insert("Kernel", ocvflow::DoubleTableProperties);
    return props;
}

ocvflow::PropertiesVariant ArithmeticKernelNode::property(const QString &property)
{
    if (!property.compare("Kernel"))
        return kernel;
    return 0;
}

bool ArithmeticKernelNode::setProperty(const QString &property, const ocvflow::PropertiesVariant &value)
{
    if (!property.compare("Kernel"))
        kernel = value.mat;

    return true;
}