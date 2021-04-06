#include "opencvplugin.h"

#include "component.h"
#include "globals.h"
#include "node.h"
#include "edge.h"

#include "imgproc.h"
#include "imgcodecs.h"
#include "videoio.h"

#include <opencv2/opencv.hpp>

OCVFLOW_PLUGIN(OpenCVPlugin, "OpenCV 4.x.x Plugin", "0.1.1")

std::vector<ocvflow::Component *> OpenCVPlugin::components()
{
    std::vector<ocvflow::Component *> rs;

    //videoio
    rs.push_back(new VideoCaptureComponent);
    //imgcodecs
    rs.push_back(new ImReadComponent);

    //imgproc
    rs.push_back(new BlurComponent);
    rs.push_back(new MedianBlurComponent);
    rs.push_back(new GaussianBlurComponent);
    
    rs.push_back(new LaplacianComponent);
    
    rs.push_back(new SobelComponent);
    rs.push_back(new CannyComponent);

    rs.push_back(new DilateComponent);
    rs.push_back(new ErodeComponent);
    
    rs.push_back(new ScharrComponent);
    rs.push_back(new SqrBoxFilterComponent);
    rs.push_back(new BilateralFilterComponent);
    rs.push_back(new BoxFilterComponent);

    rs.push_back(new CvtColorComponent);

    return rs;
}
