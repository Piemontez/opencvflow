#include "nodetools.hpp"
#include "nodemenuitem.h"

#include <QtCharts>
#include <QtDataVisualization>
#include <QBarDataRow>
#include <QGraphicsLayout>
#include <QMetaType>
#include <QVBoxLayout>

using namespace QtCharts;
using namespace QtDataVisualization;

Q_DECLARE_METATYPE(cv::Mat);

HistogramNode::HistogramNode() : NodeItem(nullptr, "Histogram"), chart3D{0}
{
    this->setFixedSize(840, 250);

    lastProcess = std::clock();

    auto menu = this->menuBar();
    if (menu)
    {
        auto chart3DAction = new QAction("3D");
        menu->addAction(chart3DAction);

        connect(chart3DAction, &QAction::triggered, this, [this]() {
            if (chart3D)
            {
                return;
            }
            this->chart3D = new Q3DBars;
            if (!chart3D->hasContext())
            {
                QMessageBox msgBox;
                msgBox.setText("Couldn't initialize the OpenGL context for Q3DBars.");
                msgBox.exec();
            }
            else
            {

                this->chart3D->raise();
                this->chart3D->setBarThickness(1.0f);
                this->chart3D->setBarSpacing(QSizeF(0.2, 0.2));
                this->chart3D->setFlags(this->chart3D->flags() ^ Qt::FramelessWindowHint);
                this->chart3D->rowAxis()->setRange(0, 3);
                this->chart3D->columnAxis()->setRange(0, 255);
                this->chart3D->scene()->activeCamera()->setCameraPosition(10, 30);
                this->chart3D->show();

                this->chart3D->connect(chart3D, &QWindow::destroy, this, [this] {
                    delete this->chart3D;
                    this->chart3D = nullptr;
                });
            }
        });
    }

    series = new QBarSeries();
    chart = new QChart;
    chart->legend()->hide();
    chart->layout()->setContentsMargins(0, 0, 0, 0);
    chart->setBackgroundRoundness(0);

    auto chartView = new QChartView(chart);
    chartView->setRenderHint(QPainter::Antialiasing);
    ((QVBoxLayout *)layout())->addWidget(chartView);

    connect(this, &HistogramNode::newSeries, this, &HistogramNode::updateHistogram, Qt::QueuedConnection);
};

void HistogramNode::paintEvent(QPaintEvent *event)
{
    QWidget::paintEvent(event);
};

void HistogramNode::updateHistogram(const std::vector<cv::Mat> histograms)
{
    if (series->barSets().size())
        chart->removeSeries(series);
    series->clear();

    int pos;
    //chart 2D
    if (chart)
    {
        int pos = 0;
        for (auto &hist : histograms)
        {
            auto set = new QBarSet("");
            if (histograms.size() == 1)
            {
                set->setColor("black");
                set->setBorderColor("black");
            }
            else
            {
                switch (pos)
                {
                case 0:
                    set->setColor("blue");
                    set->setBorderColor("blue");
                    break;
                case 1:
                    set->setColor("green");
                    set->setBorderColor("green");
                    break;
                case 2:
                    set->setColor("red");
                    set->setBorderColor("red");
                    break;
                default:
                    set->setColor("black");
                    set->setBorderColor("black");
                    break;
                }
            }

            for (int i = 1; i < 255; i++)
            {
                *set << (hist.at<float>(0, i));
            }

            series->append(set);
            pos++;
        }
        chart->addSeries(series);
    }

    //Chart 3D
    if (chart3D)
    {
        pos = 0;
        for (auto &hist : histograms)
        {
            QBar3DSeries *series;
            if (chart3D->seriesList().size() > pos)
            {
                series = chart3D->seriesList().at(pos);
            }
            else
            {
                series = new QBar3DSeries;
                chart3D->addSeries(series);
            }

            auto data = new QBarDataRow;
            if (histograms.size() == 1)
            {
                series->setBaseColor("black");
            }
            else
            {
                switch (pos)
                {
                case 0:
                    series->setBaseColor("blue");
                    break;
                case 1:
                    series->setBaseColor("green");
                    break;
                case 2:
                    series->setBaseColor("red");
                    break;

                default:
                    break;
                }
            }

            float max = 0;
            for (int i = 1; i < 255; i++)
            {
                float value = hist.at<float>(0, i);
                *data << value;
                if (max < value)
                    max = value;
            }

            chart3D->valueAxis()->setRange(0, max);
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
    }
    lastProcess = std::clock();
}

void HistogramNode::proccess()
{
    std::clock_t now = std::clock();
    if ((now - lastProcess) < 130000)
    {
        return;
    }

    int histSize = 256;
    float range[] = {0, 256};
    const float *histRange = {range};
    bool uniform = true, accumulate = false;

    for (auto &&edge : _edges)
    {
        for (auto &&src : edge->origNode()->sources())
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
    }
};
