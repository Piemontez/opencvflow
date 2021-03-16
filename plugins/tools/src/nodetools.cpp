#include "nodetools.hpp"

#include <QtCharts>
#include <QtDataVisualization>
#include <QBarDataRow>
#include <QGraphicsLayout>
#include <QMetaType>
#include <QVBoxLayout>

using namespace QtCharts;
using namespace QtDataVisualization;

Q_DECLARE_METATYPE(cv::Mat);

HistogramNode::HistogramNode(Node *node) : NodeItem(nullptr, "Histogram"), node{node}
{
    this->setFixedSize(840, 250);

    lastProcess = std::clock();

    bars = new Q3DBars;
    bars->setFlags(bars->flags() ^ Qt::FramelessWindowHint);
    bars->rowAxis()->setRange(0, 3);
    bars->columnAxis()->setRange(0, 255);
    bars->scene()->activeCamera()->setCameraPosition(10, 30);
    auto barsWidget = (QWidget::createWindowContainer(bars));

    //((QVBoxLayout *)layout())->addWidget(barsWidget, 1);

    barsWidget->show();

    /*
    series = new QBarSeries();
    chart = new QChart;
    chart->legend()->hide();
    chart->layout()->setContentsMargins(0, 0, 0, 0);
    chart->setBackgroundRoundness(0);

    chartView = new QChartView(chart);
    chartView->setRenderHint(QPainter::Antialiasing);
    //chart->legend()->markers(series).first()->setVisible(false);
    //chart->setAnimationOptions(QChart::SeriesAnimations);
    ((QVBoxLayout *)layout())->addWidget(chartView);
    */

    connect(this, &HistogramNode::newSeries, this, &HistogramNode::updateHistogram, Qt::QueuedConnection);
};

void HistogramNode::paintEvent(QPaintEvent *event)
{
    QWidget::paintEvent(event);
};

void HistogramNode::updateHistogram(const std::vector<cv::Mat> histograms)
{
    /*
    if (series->barSets().size())
        chart->removeSeries(series);
    series->clear();
    */

    //Verificar necessidade de normalização (cv::normalize) do histograma
    int pos = 0;
    for (auto &hist : histograms)
    {
        //auto set = new QBarSet("");
        QBar3DSeries *series;
        if (bars->seriesList().size() > pos)
        {
            series = bars->seriesList().at(pos);
        }
        else
        {
            series = new QBar3DSeries;
            bars->addSeries(series);
        }

        auto data = new QBarDataRow;
        if (histograms.size() == 1)
        {
            series->setBaseColor("black");
            //set->setColor("black");
        }
        else
        {
            switch (pos)
            {
            case 0:
                series->setBaseColor("blue");
                //set->setColor("blue");
                break;
            case 1:
                series->setBaseColor("green");
                //set->setColor("green");
                break;
            case 2:
                series->setBaseColor("red");
                //set->setColor("red");
                break;

            default:
                break;
            }
        }

        float max = 0;
        for (int i = 1; i < 255; i++)
        {
            float value = hist.at<float>(0, i);
            //*set << (hist.at<float>(0, i));
            *data << value;
            if (max < value)
                max = value;
        }

        bars->valueAxis()->setRange(0, max);
        //series->append(set);
        if (series->dataProxy()->rowCount() > 0)
        {
            series->dataProxy()->setRow(0, data);
        }
        else
        {
            series->dataProxy()->addRow(data);
        }
        pos++;
    }

    //chart->addSeries(series);
    lastProcess = std::clock();
}

void HistogramNode::proccess()
{
    std::clock_t now = std::clock();
    if ((now - lastProcess) < 100000)
    {
        return;
    }

    int histSize = 256;
    float range[] = {0, 256};
    const float *histRange = {range};
    bool uniform = true, accumulate = false;

    for (auto &&src : node->sources())
    {
        std::vector<cv::Mat> planes;
        std::vector<cv::Mat> histograms;

        cv::split(src, planes);
        for (auto &plane : planes)
        {
            cv::Mat hist;
            cv::calcHist(&plane, 1, 0, cv::Mat(), hist, 1, &histSize, &histRange, uniform, accumulate);
            histograms.push_back(hist);
        }

        emit newSeries(histograms);
    }
};
