#ifndef OPCVF_IMGCODECS_H
#define OPCVF_IMGCODECS_H

#include "items.h"
#include "component.h"

namespace cv {
    class ImRead;
}

/**
 * @brief The ImReadNode class
 */
class ImReadNode: public ocvflow::NodeItem {
    std::string file;
public:
    ImReadNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void proccess() override;
};


class ImReadComponent: public ocvflow::ProcessorComponent
{
public:
    ImReadComponent();
    ocvflow::Node* createNode() override;
};


#endif // OPCVF_IMGCODECS_H
