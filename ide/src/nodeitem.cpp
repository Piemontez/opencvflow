#include "node.h"
#include "nodemenuitem.h"
#include "nodelinkitem.h"
#include "edge.h"
#include "window.h"
#include "utils.h"

#include <QDebug>
#include <QPainter>
#include <QStyleOptionGraphicsItem>
#include <QGraphicsSceneContextMenuEvent>
#include <QWidget>

class NodeItemPrivate {
    CentralWidget *centralWidget;
    QRect contentSize;

    friend class NodeItem;
};

NodeItem::NodeItem(CentralWidget *centralWidget)
    : d_ptr(new NodeItemPrivate)
{
    d_func()->centralWidget = centralWidget;
    d_func()->contentSize = QRect(0, 0, 220, 100);

    setFlag(ItemIsMovable);
    setFlag(ItemSendsGeometryChanges);
    setCacheMode(DeviceCoordinateCache);
    setZValue(-1);

    addToGroup(new NodeMenuItem(this));

    addToGroup(new NodeLinkItem(this));

    setHandlesChildEvents(false);
    setAcceptHoverEvents(true);
}

QString NodeItem::title()
{
    return "Empty Node";
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
    QRect region = d_func()->contentSize;
    region.setTop(-25);
    return region;
}

QPainterPath NodeItem::shape() const
{
    QPainterPath path;
    path.addRect(d_func()->contentSize);
    return path;
}

void NodeItem::paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *wid)
{
    painter->setBrush(Qt::CrossPattern);
    painter->setPen(QPen(Qt::lightGray, 0));
    painter->drawRect(d_func()->contentSize);

    contentPaint(d_func()->contentSize, painter, option, wid);

    painter->setBrush(Qt::NoBrush);
    painter->setPen(QPen(Qt::black, 0));
    painter->drawRect(d_func()->contentSize);
}

void NodeItem::contentPaint(const QRect &region, QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget)
{
    cv::Mat out;
    for (auto && mat: sources())
    {
        cv::resize(mat, out, cv::Size(region.width(), region.height()));
        painter->drawImage(region.left(), region.top(), cvMatToQImage(out));
    }
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
/*
void NodeItem::mousePressEvent(QGraphicsSceneMouseEvent *event)
{
    update();
    QGraphicsItem::mousePressEvent(event);
}

void NodeItem::mouseReleaseEvent(QGraphicsSceneMouseEvent *event)
{
    update();
    QGraphicsItem::mouseReleaseEvent(event);
}

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
