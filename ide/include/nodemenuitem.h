#ifndef NODEMENUITEM_H
#define NODEMENUITEM_H

#include <QToolBar>

#include <chrono>
#include "opencv2/core/mat.hpp"
#include "items.h"

class QMouseEvent;

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


namespace ocvflow
{

    class NodeMenuItem : public QToolBar
    {
    public:
        explicit NodeMenuItem(QString title, QWidget *parent = nullptr);

    protected:
        //QVariant itemChange(GraphicsItemChange change, const QVariant &value);

        void mousePressEvent(QMouseEvent *event) override;
        void mouseMoveEvent(QMouseEvent *event) override;
        void mouseReleaseEvent(QMouseEvent *event) override;
    };

    class HistogramNode : public ocvflow::NodeItem
    {
        Q_OBJECT

        Node *node;
        QtDataVisualization::Q3DBars *bars;
        /*
        QtCharts::QBarSeries *series;
        QtCharts::QChart *chart;
        QtCharts::QChartView *chartView;
        */
        std::clock_t lastProcess;

    public:
        HistogramNode(Node *node);

        void paintEvent(QPaintEvent *event) override;
        void updateHistogram(const std::vector<cv::Mat> histograms);
        void proccess();

    Q_SIGNALS:
        void newSeries(const std::vector<cv::Mat> histograms);
    }; // namespace ocvflow
} // namespace ocvflow
#endif // NODEMENUITEM_H
