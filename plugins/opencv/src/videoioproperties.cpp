#include "videoio.h"

/**
 * @brief VideoCaptureNode::properties
 * @return
 */
QMap<QString, ocvflow::Properties> VideoCaptureNode::properties()
{
    QMap<QString, ocvflow::Properties> props;
    props.insert("Index",     ocvflow::IntProperties);
    return props;
}

ocvflow::PropertiesVariant VideoCaptureNode::property(const QString &property)
{
    if (!property.compare("Index")) return index;
    return 0;
}

bool VideoCaptureNode::setProperty(const QString& property, const ocvflow::PropertiesVariant& value)
{
    if (!property.compare("Index")) index = value.i;

    return true;
}
