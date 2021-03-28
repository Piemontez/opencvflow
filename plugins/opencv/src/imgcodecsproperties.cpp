#include "imgcodecs.h"

/**
 * @brief ImReadNode::properties
 * @return
 */
QMap<QString, ocvflow::Properties> ImReadNode::properties()
{
    QMap<QString, ocvflow::Properties> props;
    props.insert("File", ocvflow::FileProperties);
    return props;
}

ocvflow::PropertiesVariant ImReadNode::property(const QString &property)
{
    if (!property.compare("File"))
        return file;
    return 0;
}

bool ImReadNode::setProperty(const QString &property, const ocvflow::PropertiesVariant &value)
{
    if (!property.compare("File"))
        file = value.s;

    return true;
}
