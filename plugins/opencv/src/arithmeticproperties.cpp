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

/**
 * @brief GaussianKernelNode::properties
 * @return
 */
QMap<QString, ocvflow::Properties> GaussianKernelNode::properties()
{
    QMap<QString, ocvflow::Properties> props;
    props.insert("Sigma", ocvflow::DoubleProperties);
    props.insert("Rows", ocvflow::IntProperties);
    props.insert("Cols", ocvflow::IntProperties);
    return props;
}

ocvflow::PropertiesVariant GaussianKernelNode::property(const QString &property)
{
    if (!property.compare("Sigma"))
        return sigma;
    if (!property.compare("Rows"))
        return rows;
    if (!property.compare("Cols"))
        return cols;
    return 0;
}

bool GaussianKernelNode::setProperty(const QString &property, const ocvflow::PropertiesVariant &value)
{
    if (!property.compare("Sigma")) {
        if (value.d < 0)
            return false;
        sigma = value.d;
    }
    if (!property.compare("Rows"))
        rows = value.i;
    if (!property.compare("Cols"))
        cols = value.i;

    buildKernel();
    return true;
}