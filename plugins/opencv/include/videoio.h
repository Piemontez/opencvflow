#ifndef OPCVF_VIDEOIO_H
#define OPCVF_VIDEOIO_H

#include "items.h"
#include "component.h"

namespace cv {
    class VideoCapture;
}

/**
 * @brief The VideoCaptureNode class
 */
class VideoCaptureNode: public ocvflow::NodeItem {
    cv::VideoCapture* cap;
    int index{0};
public:
    VideoCaptureNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void start() override;
    void proccess() override;
    void stop() override;
};


class VideoCaptureComponent: public ocvflow::ProcessorComponent
{
public:
    VideoCaptureComponent();
    ocvflow::Node* createNode() override;
};


#endif // OPCVF_VIDEOIO_H
