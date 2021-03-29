#ifndef TOOLS_NODE_H
#define TOOLS_NODE_H

#include <chrono>
#include "opencv2/core/mat.hpp"
#include <QObject>

#include "items.h"


namespace QtCharts
{
    class QChart;
    class QChartView;
    class QBarSeries;
    class QBarSet;
} // namespace QtCharts
namespace QtDataVisualization
{
    class Q3DBars;
}

class HistogramNode : public ocvflow::NodeItem
{
    Q_OBJECT

    QtDataVisualization::Q3DBars *bars;
    /*
        QtCharts::QBarSeries *series;
        QtCharts::QChart *chart;
        QtCharts::QChartView *chartView;
        */
    std::clock_t lastProcess;

public:
    HistogramNode();

    void paintEvent(QPaintEvent *event) override;
    void updateHistogram(const std::vector<cv::Mat> histograms);
    void proccess();

Q_SIGNALS:
    void newSeries(const std::vector<cv::Mat> histograms);
}; // namespace ocvflow

#endif //TOOLS_NODE_H
