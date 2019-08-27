#include "items.h"
#include "nodelinkitem.h"
#include "window.h"

#include <QDebug>
#include <QPainter>
#include <QGraphicsScene>
#include <QRadialGradient>
#include <QGraphicsSceneMouseEvent>

NodeLinkItem::NodeLinkItem(NodeItem *nodeItem) :
    nodeItem(nodeItem)
{
    setFlag(ItemIsSelectable);

    setAcceptHoverEvents(true);
}

QRectF NodeLinkItem::boundingRect() const
{
    QRect region = nodeItem->contentRegion();
    return QRectF(region.left() -20, region.top() - 20, region.width() + 40, region.height() + 40);
}


QPainterPath NodeLinkItem::shape() const
{
    QRect region = nodeItem->contentRegion();

    QPainterPath path;
    //path.addRect(region.left() -20, region.top() - 20, region.width() + 40, region.height() + 40);
    path.addRect(region.left() -20, region.top() - 20, 20, region.height() + 40);
    path.addRect(region.right(), region.top() - 20, 20, region.height() + 40);
    return path;
}

void NodeLinkItem::paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget)
{
    if (!hover)
        return;

    QRect region = nodeItem->contentRegion();

    painter->setPen(QPen(Qt::darkGray, 0));
    painter->setBrush(QBrush(Qt::darkGray));

    painter->drawEllipse(region.left()  -20, region.center().y(), 10, 10);
    painter->drawEllipse(region.right() +10, region.center().y(), 10, 10);
}

void NodeLinkItem::hoverEnterEvent(QGraphicsSceneHoverEvent *event)
{
    hover = true;
}

void NodeLinkItem::hoverLeaveEvent(QGraphicsSceneHoverEvent *event)
{
    hover = false;
}

void NodeLinkItem::mousePressEvent(QGraphicsSceneMouseEvent *event)
{
    faceEdgeItem = new FakeEdgeItem(mapToScene(event->pos()));

    scene()->addItem(faceEdgeItem);

    QGraphicsItem::mousePressEvent(event);
}

void NodeLinkItem::mouseMoveEvent(QGraphicsSceneMouseEvent *event)
{
    faceEdgeItem->setDest(mapToScene(event->pos()));
    faceEdgeItem->update();

    QGraphicsItem::mouseMoveEvent(event);
}

void NodeLinkItem::mouseReleaseEvent(QGraphicsSceneMouseEvent *event)
{
//    scene()->removeItem(faceEdgeItem);
    delete faceEdgeItem;
//    faceEdgeItem = nullptr;

    auto item = scene()->itemAt(mapToScene(event->pos()), this->transform());
    if (item && item->type() == this->type()) {
        auto linkItem = static_cast<NodeLinkItem *>(item);
        MainWindow::instance()->connectNode(this->nodeItem, linkItem->nodeItem);
    }

    QGraphicsItem::mouseReleaseEvent(event);
}
