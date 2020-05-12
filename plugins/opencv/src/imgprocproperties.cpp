#include "imgproc.h"

/**
 * @brief SobelNode::properties
 * @return
 */
QMap<QString, ocvflow::Properties> SobelNode::properties()
{
    QMap<QString, ocvflow::Properties> props;
    props.insert("DDepth", ocvflow::EmptyProperties);
    props.insert("DX",     ocvflow::IntProperties);
    props.insert("DY",     ocvflow::IntProperties);
    props.insert("KSize",  ocvflow::IntProperties);
    props.insert("Scale",  ocvflow::DoubleProperties);
    props.insert("Delta",  ocvflow::DoubleProperties);
    return props;
}

ocvflow::PropertiesVariant SobelNode::property(const QString &property)
{
    if (!property.compare("KSize")) return ksize;
    if (!property.compare("DX"))    return dx;
    if (!property.compare("DY"))    return dy;
    if (!property.compare("Scale")) return scale;
    if (!property.compare("Delta")) return delta;
    return 0;
}

bool SobelNode::setProperty(const QString& property, const ocvflow::PropertiesVariant& value)
{
    if (!property.compare("KSize")) {
        if (ksize < value.i) {
            ksize = value.i + 1;
        } else if (ksize > value.i) {
            ksize = value.i - 1;
        }
        return ksize == value.i;
    }
    else if (!property.compare("DX")) dx = value.d;
    else if (!property.compare("DY")) dy = value.d;
    else if (!property.compare("Scale")) scale = value.d;
    else if (!property.compare("Delta")) delta = value.d;

    return true;
}

/**
 * @brief CannyNode::properties
 * @return
 */
QMap<QString, ocvflow::Properties> CannyNode::properties()
{
    QMap<QString, ocvflow::Properties> props;
    props.insert("Threshold 1", ocvflow::DoubleProperties);
    props.insert("Threshold 2",  ocvflow::DoubleProperties);
    props.insert("Aperture Size",  ocvflow::IntProperties);
    props.insert("L2 gradiente",  ocvflow::EmptyProperties);
    return props;
}

ocvflow::PropertiesVariant CannyNode::property(const QString &property)
{
    if (!property.compare("Threshold 1")) return threshold1;
    if (!property.compare("Threshold 2")) return threshold2;
    if (!property.compare("Aperture Size")) return aperturesize;
    return 0;
}

bool CannyNode::setProperty(const QString& property, const ocvflow::PropertiesVariant& value)
{
    if (!property.compare("Threshold 1")) threshold1 = value.d;
    else if (!property.compare("Threshold 2")) threshold2 = value.d;
    else if (!property.compare("Aperture Size")) {
        if (aperturesize < value.i) {
            aperturesize = value.i + 1;
        } else if (aperturesize > value.i) {
            aperturesize = value.i - 1;
        }
        return aperturesize == value.i;
    }

    return true;
}
/**
 * @brief LaplacianNode::properties
 * @return
 */
QMap<QString, ocvflow::Properties> LaplacianNode::properties()
{
    QMap<QString, ocvflow::Properties> props;
    props.insert("DDepth", ocvflow::EmptyProperties);
    props.insert("KSize",  ocvflow::IntProperties);
    props.insert("Scale",  ocvflow::DoubleProperties);
    props.insert("Delta",  ocvflow::DoubleProperties);
    return props;
}

ocvflow::PropertiesVariant LaplacianNode::property(const QString &property)
{
    if (!property.compare("KSize")) return ksize;
    if (!property.compare("Scale")) return scale;
    if (!property.compare("Delta")) return delta;
    return 0;
}

bool LaplacianNode::setProperty(const QString& property, const ocvflow::PropertiesVariant& value)
{
    if (!property.compare("KSize")) {
        if (ksize < value.i) {
            ksize = value.i + 1;
        } else if (ksize > value.i) {
            ksize = value.i - 1;
        }
        return ksize == value.i;
    }
    else if (!property.compare("Scale")) scale = value.d;
    else if (!property.compare("Delta")) delta = value.d;

    return true;
}

/**
 * @brief MedianBlurNode::properties
 * @return
 */
QMap<QString, ocvflow::Properties> MedianBlurNode::properties()
{
    QMap<QString, ocvflow::Properties> props;
    props.insert("KSize",  ocvflow::IntProperties);
    return props;
}

ocvflow::PropertiesVariant MedianBlurNode::property(const QString &property)
{
    if (!property.compare("KSize")) return ksize;
    return 0;
}

bool MedianBlurNode::setProperty(const QString& property, const ocvflow::PropertiesVariant& value)
{
    if (!property.compare("KSize"))
        return ksize == value.i;

    return true;
}

/**
 * @brief GaussianBlurNode::properties
 * @return
 */
QMap<QString, ocvflow::Properties> GaussianBlurNode::properties()
{
    QMap<QString, ocvflow::Properties> props;
    props.insert("Size",   ocvflow::SizeIntProperties);
    props.insert("SigmaX", ocvflow::DoubleProperties);
    props.insert("SigmaY", ocvflow::DoubleProperties);
    return props;
}

ocvflow::PropertiesVariant GaussianBlurNode::property(const QString &property)
{
    if (!property.compare("SigmaX")) return sigmaX;
    if (!property.compare("SigmaY")) return sigmaY;
    return 0;
}

bool GaussianBlurNode::setProperty(const QString& property, const ocvflow::PropertiesVariant& value)
{
    if (!property.compare("SigmaX"))
        return sigmaX == value.d;
    if (!property.compare("SigmaY"))
        return sigmaX == value.d;

    return true;
}

/**
 * @brief BilateralFilterNode::properties
 * @return
 */
QMap<QString, ocvflow::Properties> BilateralFilterNode::properties()
{
    QMap<QString, ocvflow::Properties> props;
    props.insert("D",   ocvflow::IntProperties);
    props.insert("SigmaColor", ocvflow::DoubleProperties);
    props.insert("SigmaSpace", ocvflow::DoubleProperties);
    return props;
}

ocvflow::PropertiesVariant BilateralFilterNode::property(const QString &property)
{
    if (!property.compare("D")) return d;
    if (!property.compare("SigmaColor")) return sigmaColor;
    if (!property.compare("SigmaSpace")) return sigmaSpace;
    return 0;
}

bool BilateralFilterNode::setProperty(const QString& property, const ocvflow::PropertiesVariant& value)
{
    if (!property.compare("D"))
        return d == value.i;
    if (!property.compare("SigmaColor"))
        return sigmaColor == value.d;
    if (!property.compare("SigmaSpace"))
        return sigmaSpace == value.d;

    return true;
}

/**
 * @brief BoxFilterNode::properties
 * @return
 */
QMap<QString, ocvflow::Properties> BoxFilterNode::properties()
{
    QMap<QString, ocvflow::Properties> props;
    props.insert("DDepth", ocvflow::IntProperties);
    props.insert("Ksize",  ocvflow::SizeIntProperties);
    props.insert("Anchor", ocvflow::SizeIntProperties);
    props.insert("Normalize", ocvflow::BooleanProperties);
    return props;
}

ocvflow::PropertiesVariant BoxFilterNode::property(const QString &property)
{
    if (!property.compare("DDepth")) return ddepth;
    return 0;
}

bool BoxFilterNode::setProperty(const QString& property, const ocvflow::PropertiesVariant& value)
{
    if (!property.compare("DDepth"))
        return ddepth == value.i;

    return true;
}

/**
 * @brief SqrBoxFilterNode::properties
 * @return
 */
QMap<QString, ocvflow::Properties> SqrBoxFilterNode::properties()
{
    QMap<QString, ocvflow::Properties> props;
    props.insert("DDepth", ocvflow::IntProperties);
    props.insert("Ksize",  ocvflow::SizeIntProperties);
    props.insert("Anchor", ocvflow::SizeIntProperties);
    props.insert("Normalize", ocvflow::BooleanProperties);
    return props;
}

ocvflow::PropertiesVariant SqrBoxFilterNode::property(const QString &property)
{
    if (!property.compare("DDepth")) return ddepth;
    return 0;
}

bool SqrBoxFilterNode::setProperty(const QString& property, const ocvflow::PropertiesVariant& value)
{
    if (!property.compare("DDepth"))
        return ddepth == value.i;

    return true;
}

/**
 * @brief BlurNode::properties
 * @return
 */
QMap<QString, ocvflow::Properties> BlurNode::properties()
{
    QMap<QString, ocvflow::Properties> props;
    props.insert("Ksize",  ocvflow::SizeIntProperties);
    props.insert("Anchor", ocvflow::SizeIntProperties);
    return props;
}

ocvflow::PropertiesVariant BlurNode::property(const QString &property)
{
    if (!property.compare("Ksize")) return ocvflow::PropertiesVariant(ksize.width, ksize.height);
    if (!property.compare("Anchor")) return ocvflow::PropertiesVariant(anchor.width, anchor.height);
    return 0;
}

bool BlurNode::setProperty(const QString& property, const ocvflow::PropertiesVariant& value)
{
    if (!property.compare("Ksize")) std::tie(ksize.width, ksize.height) = value.sizeI;
    else if (!property.compare("Anchor"))  std::tie(anchor.width, anchor.height) = value.sizeI;

    return true;
}

/**
 * @brief ScharrNode::properties
 * @return
 */
QMap<QString, ocvflow::Properties> ScharrNode::properties()
{
    QMap<QString, ocvflow::Properties> props;
    props.insert("DDepth", ocvflow::EmptyProperties);
    props.insert("DX",     ocvflow::IntProperties);
    props.insert("DY",     ocvflow::IntProperties);
    props.insert("Scale",  ocvflow::DoubleProperties);
    props.insert("Delta",  ocvflow::DoubleProperties);
    return props;
}

ocvflow::PropertiesVariant ScharrNode::property(const QString &property)
{
    if (!property.compare("DX"))    return dx;
    if (!property.compare("DY"))    return dy;
    if (!property.compare("Scale")) return scale;
    if (!property.compare("Delta")) return delta;
    return 0;
}

bool ScharrNode::setProperty(const QString& property, const ocvflow::PropertiesVariant& value)
{
    if (!property.compare("DX")) dx = value.d;
    else if (!property.compare("DY")) dy = value.d;
    else if (!property.compare("Scale")) scale = value.d;
    else if (!property.compare("Delta")) delta = value.d;

    return true;
}
