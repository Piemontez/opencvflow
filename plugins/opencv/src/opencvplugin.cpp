#include "opencvplugin.h"

#include "component.h"
#include "globals.h"
#include "node.h"
#include "edge.h"

#include "imgproc.h"

#include <opencv2/opencv.hpp>

OCVFLOW_PLUGIN(OpenCVPlugin, "OpenCV 4.x.x Plugin", "0.1.1")

std::vector<Component *> OpenCVPlugin::components()
{
    std::vector<Component *> rs;

    auto cap = new cv::VideoCapture(0);

    rs.push_back(new ProcessorComponent(SourcesTB, "Video Stream", [cap] (const std::vector<Edge *> &) -> std::vector<cv::Mat> {
        std::vector<cv::Mat> sources;

        if(!cap->isOpened())  // check if we succeeded
            return sources;

        cv::Mat frame;
        *cap >> frame; // get a new frame from camera

        sources.clear();
        sources.push_back(frame);

        return sources;
    }));

    rs.push_back(new SobelComponent);
    rs.push_back(new CannyComponent);
    rs.push_back(new LaplacianComponent);

    return rs;
}
