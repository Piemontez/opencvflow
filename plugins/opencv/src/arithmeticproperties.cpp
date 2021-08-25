#include "arithmetic.h"

/**
 * @brief ArithmeticKernelNode::properties
 * @return
 */
QMap<QString, ocvflow::Properties> ArithmeticKernelNode::properties()
{
    QMap<QString, ocvflow::Properties> props;
    props.insert("Kernel", ocvflow::DoubleTableProperties);
    props.insert("Anchor", ocvflow::SizeIntProperties);
    return props;
}

ocvflow::PropertiesVariant ArithmeticKernelNode::property(const QString &property)
{
    if (!property.compare("Kernel"))
        return kernel;
    if (!property.compare("Anchor"))
        return ocvflow::PropertiesVariant(anchor.x, anchor.y);

    return 0;
}

bool ArithmeticKernelNode::setProperty(const QString &property, const ocvflow::PropertiesVariant &value)
{
    if (!property.compare("Kernel"))
        kernel = value.mat;
    if (!property.compare("Anchor"))
        anchor = cv::Point(std::get<0>(value.sizeI), std::get<1>(value.sizeI));

    return true;
}