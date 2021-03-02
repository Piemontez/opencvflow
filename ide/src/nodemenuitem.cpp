#include "nodemenuitem.h"
#include "items.h"
#include "window.h"

#include <QLabel>
#include <QMenuBar>
#include <QStyle>
#include <QMenu>
#include <QAction>
#include <QMouseEvent>

#include <QVBoxLayout>
#include <QChart>
#include <QChartView>
#include <QBarSeries>
#include <QBarSet>

using namespace ocvflow;
using namespace QtCharts;

//Todo:Mover para Nodes da Ide
/**
 * @brief The DilateNode class
 */
class HistogramNode : public ocvflow::NodeItem
{
    Node *node;

public:
    HistogramNode(Node *node) : NodeItem(nullptr, "Histogram"), node{node}
    {
        auto set0 = new QBarSet("Amount");
        *set0 << 1 << 2 << 3 << 4 << 5 << 6;

        auto series = new QBarSeries();
        series->append(set0);

        auto chart = new QChart;
        auto chartView = new QChartView(chart);
        chart->addSeries(series);
        chart->setAnimationOptions(QChart::SeriesAnimations);
        
        ((QVBoxLayout*)layout())->addWidget(chartView);
    };

    void paintEvent(QPaintEvent *event) override
    {
        QWidget::paintEvent(event);
    };

    void proccess(){

    };
};

NodeMenuItem::NodeMenuItem(QString title, QWidget *parent)
    : QToolBar(parent)
{
    auto titleLabel = new QLabel(title);

    auto menuBar = new QMenuBar;
    menuBar->setSizePolicy(QSizePolicy::Minimum, QSizePolicy::Expanding);
    auto menu = new QMenu(tr("..."));
    auto histAction = new QAction(tr("View histogram"));
    auto close = new QAction;
    close->setIcon(this->style()->standardIcon(QStyle::SP_TitleBarCloseButton));

    auto spacer = new QWidget;
    spacer->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);

    menu->addAction(histAction);
    menuBar->addMenu(menu);
    menuBar->addAction(close);

    this->addWidget(titleLabel);
    this->addWidget(spacer);
    this->addWidget(menuBar);

    connect(close, &QAction::triggered, this, [parent]() {
        auto nodeItem = static_cast<NodeItem *>(parent);
        if (nodeItem)
        {
            MainWindow::instance()->removeNode(nodeItem);
        }
    });
    connect(histAction, &QAction::triggered, this, [parent]() {
        auto nodeItem = static_cast<NodeItem *>(parent);
        if (nodeItem)
        {
            MainWindow::instance()->addNode(new HistogramNode(nodeItem));
        }
    });

    //installEventFilter(this);
    //setMouseTracking(true);
}

void NodeMenuItem::mousePressEvent(QMouseEvent *event)
{
    QWidget::mousePressEvent(event);

    MainWindow::instance()->nodeMenuMousePressEvent(this, event);

    event->accept();
}

void NodeMenuItem::mouseMoveEvent(QMouseEvent *event)
{
    MainWindow::instance()->nodeMenuMouseMoveEvent(this, event);

    QWidget::mouseMoveEvent(event);
}

void NodeMenuItem::mouseReleaseEvent(QMouseEvent *event)
{
    MainWindow::instance()->nodeMenuMouseReleaseEvent(this, event);

    QWidget::mouseReleaseEvent(event);
}