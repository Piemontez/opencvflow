#include "opencvplugin.h"

#include "component.h"
#include "globals.h"
#include "node.h"
#include "edge.h"

#include <opencv2/opencv.hpp>

OCVFLOW_PLUGIN(OpenCVPlugin, "OpenCV 4.x.x Plugin", "0.1.1")

std::vector<Component *> OpenCVPlugin::components()
{
    std::vector<Component *> rs;

    std::cout << "........>>";

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

    rs.push_back(new ProcessorComponent(ProcessorsTB, "Sobel", [] (const std::vector<Edge *> &edges) -> std::vector<cv::Mat> {
        std::vector<cv::Mat> sources;

        cv::Mat out;

        for (auto && edge: edges)
        {
            for (auto && mat: edge->sourceNode()->sources())
            {
                cv::Sobel(mat, out, CV_8U, 1, 0, 3);
                sources.push_back(out);
            }
        }
        return sources;
    }));

    rs.push_back(new ProcessorComponent(ProcessorsTB, "Canny", [] (const std::vector<Edge *> &edges) -> std::vector<cv::Mat> {
        std::vector<cv::Mat> sources;
        cv::Mat out;

        for (auto && edge: edges)
        {
            for (auto && mat: edge->sourceNode()->sources())
            {
                cv::Canny(mat, out, 80, 170);
                sources.push_back(out);
            }
        }
        return sources;
    }));


    return rs;
}
