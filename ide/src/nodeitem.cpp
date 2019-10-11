#include "node.h"
#include "edge.h"
#include "items.h"
#include "nodemenuitem.h"
#include "nodelinkitem.h"
#include "window.h"
#include "utils.h"

#include <QPainter>
#include <QStyleOptionGraphicsItem>
#include <QGraphicsSceneContextMenuEvent>
#include <QWidget>
#include <QGridLayout>
#include <QLabel>
#include <QSpinBox>
#include <QDoubleSpinBox>

using namespace ocvflow;

class ocvflow::NodeItemPrivate {
    CentralWidget *centralWidget;
    QRect contentSize;
    QString title;

    friend class NodeItem;
};

NodeItem::NodeItem(CentralWidget *centralWidget, QString title)
    : d_ptr(new NodeItemPrivate)
{
    d_func()->centralWidget = centralWidget;
    d_func()->contentSize = QRect(0, 0, 480, 200);

    setFlag(ItemIsMovable);
    setFlag(ItemSendsGeometryChanges);
    setCacheMode(DeviceCoordinateCache);
    setZValue(-1);

    addToGroup(new NodeMenuItem(this));

    addToGroup(new NodeLinkItem(this));

    setHandlesChildEvents(false);
    setAcceptHoverEvents(true);

    d_func()->title = title.isEmpty()
            ? "Empty Node"
            : title;
}

QString NodeItem::title()
{
    return d_func()->title;
}

QMap<QString, Properties> NodeItem::properties()
{
    QMap<QString, Properties> props;

    return props;
}

PropertiesVariant NodeItem::property(const QString &property)
{
    return {0};
}

bool NodeItem::setProperty(const QString& property, const PropertiesVariant& value)
{
    return true;
}

QWidget *NodeItem::createPropertiesWidget(QWidget *parent)
{
    QMap<QString, Properties> props = this->properties();

    if (props.size() == 0)
        return nullptr;


    auto widget = new QWidget(parent);
    auto layout = new QGridLayout(widget);
    layout->setHorizontalSpacing(4);
    layout->setVerticalSpacing(0);
    widget->setLayout(layout);

    int pos = 0;
    for(auto && entry: props.toStdMap()) {
        switch (entry.second) {
        case ocvflow::EmptyProperties:
        {
            layout->addWidget(new QLabel(entry.first, widget), pos, 0, 1, 1);
            break;
        }
        case ocvflow::IntProperties:
        {
            auto spinBox = new QSpinBox();
            spinBox->setMaximum(std::numeric_limits<int>::max());
            spinBox->setValue(this->property(entry.first).i);
            spinBox->connect(spinBox, static_cast< void (QSpinBox::*) (int) >(&QSpinBox::valueChanged), spinBox, [this, spinBox, entry] (int value) {
                if (!this->setProperty(entry.first, value)) {
                    spinBox->setValue(this->property(entry.first).i);
                }
            });

            layout->addWidget(new QLabel(entry.first, widget), pos, 0, 1, 1);
            layout->addWidget(spinBox, pos, 1, 1, 1);
            break;
        }
        case ocvflow::FloatProperties:
        case ocvflow::DoubleProperties:
        {
            auto doubleSpinBox = new QDoubleSpinBox();
            doubleSpinBox->setMaximum(std::numeric_limits<double>::max());
            doubleSpinBox->setValue(this->property(entry.first).d);
            doubleSpinBox->connect(doubleSpinBox, static_cast< void (QDoubleSpinBox::*) (double) >(&QDoubleSpinBox::valueChanged), doubleSpinBox, [this, doubleSpinBox, entry] (double value) {
                if (!this->setProperty(entry.first, value)) {
                    doubleSpinBox->setValue(this->property(entry.first).i);
                }
            });

            layout->addWidget(new QLabel(entry.first, widget), pos, 0, 1, 1);
            layout->addWidget(doubleSpinBox, pos, 1, 1, 1);
        }
        }
        pos++;
    }


    layout->addItem(new QSpacerItem(40, 20, QSizePolicy::Preferred, QSizePolicy::MinimumExpanding), 6, 0, 1, 1);
    return widget;
}

QRect NodeItem::contentRegion()
{
    return d_func()->contentSize;
}

void NodeItem::addEdge(EdgeItem *edge)
{
    NodeItem::addEdge(edge);
    
    edge->adjust();
}

QRectF NodeItem::boundingRect() const
{
    return QRectF(-20, -25, d_func()->contentSize.width() + 40, d_func()->contentSize.height() + 25);
}

QPainterPath NodeItem::shape() const
{
    QPainterPath path;
    path.addRect(d_func()->contentSize);
    return path;
}

void NodeItem::paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *wid)
{
    painter->setBrush(QBrush(Qt::darkGray, Qt::SolidPattern));
    painter->setPen(Qt::NoBrush);
    painter->drawRect(d_func()->contentSize);

    contentPaint(d_func()->contentSize, painter, option, wid);

    painter->setBrush(Qt::NoBrush);
    painter->setPen(QPen(Qt::lightGray, 0));
    painter->drawRect(d_func()->contentSize);
}

void NodeItem::contentPaint(const QRect &region, QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget)
{
    acquire();
    if (data(ErrorData).isValid())
    {
        painter->setPen(QPen(Qt::white, 4));
        painter->drawLine(region.left(), region.top(), region.right(), region.bottom());
        painter->drawLine(region.right(), region.top(), region.left(), region.bottom());
    } else {
        if (this->data(LastViewUpdated).isNull() || this->data(LastUpdateCall).isNull()
                || this->data(LastViewUpdated).toFloat() != this->data(LastUpdateCall).toFloat())
        {
            this->setData(LastViewUpdated, this->data(LastUpdateCall));

            cv::Mat out;
            for (auto && mat: sources())
            {
                try {
                    cv::resize(mat, out, cv::Size(region.width(), region.height()));
                    auto image = cvMatToQImage(out);

                    setData(ContentViewCache, image);
                    painter->drawImage(region.left(), region.top(), image);
                } catch (...) {}
            }
        } else {
            painter->drawImage(region.left(), region.top(), data(ContentViewCache).value<QImage>());
        }
    }

    release();
}

QVariant NodeItem::itemChange(GraphicsItemChange change, const QVariant &value)
{
    switch (change) {
    case ItemPositionHasChanged:
        foreach (Edge *edge, edges())
            static_cast<EdgeItem *>(edge)->adjust();
        break;
    default:
        break;
    };

    return QGraphicsItem::itemChange(change, value);
}

void NodeItem::mousePressEvent(QGraphicsSceneMouseEvent *event)
{
    QGraphicsItem::mousePressEvent(event);
    if(event->button() == Qt::LeftButton) {
        if(event->modifiers() == Qt::ShiftModifier || event->modifiers() == Qt::AltModifier) {

        } else {
            MainWindow::instance()->nodeClicked(this);
        }
    }
}

void NodeItem::mouseReleaseEvent(QGraphicsSceneMouseEvent *event)
{
    MainWindow::instance()->update();

    QGraphicsItem::mouseReleaseEvent(event);
}

/*
void NodeItem::hoverEnterEvent(QGraphicsSceneHoverEvent *event)
{

}

void NodeItem::hoverLeaveEvent(QGraphicsSceneHoverEvent *event)
{

}*/

/*
void NodeItem::contextMenuEvent(QGraphicsSceneContextMenuEvent *event)
{
    QMenu *menu = new QMenu;
    QAction *action = new QAction("Connect");
    action->setData(QVariant::fromValue((void*)this));

    QObject::connect(action, &QAction::triggered, d_func()->centralWidget, &CentralWidget::connectNode);

    menu->addAction(action);
    menu->popup(event->screenPos());
}
*/
