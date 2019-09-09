#include "opencvplugin.h"

#include "component.h"
#include "globals.h"
#include "node.h"
#include "edge.h"

#include "imgproc.h"
#include "videoio.h"

#include <opencv2/opencv.hpp>

OCVFLOW_PLUGIN(OpenCVPlugin, "OpenCV 4.x.x Plugin", "0.1.1")

std::vector<ocvflow::Component *> OpenCVPlugin::components()
{
    std::vector<ocvflow::Component *> rs;

    //videoio
    rs.push_back(new VideoCaptureComponent);

    //imgproc
    rs.push_back(new SobelComponent);
    rs.push_back(new CannyComponent);
    rs.push_back(new LaplacianComponent);

    return rs;
}
