#include "items.h"
#include "nodemenuitem.h"

#include <QPainter>
#include <QFont>
#include <QRadialGradient>

using namespace ocvflow;

NodeMenuItem::NodeMenuItem(NodeItem *nodeItem) :
    nodeItem(nodeItem)
{

}

QRectF NodeMenuItem::boundingRect() const
{
    return QRectF(0, 0, 0, 0);
}

/*
QPainterPath NodeMenuItem::shape() const
{
    QRect region = nodeItem->contentRegion();

    QPainterPath path;
    path.addRect(region.left(), region.top() - 25, 0, 0);
    return path;
}*/

void NodeMenuItem::paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget)
{
    QRect region = nodeItem->contentRegion();

    painter->setPen(QPen(Qt::darkGray, 0));
    painter->setBrush(QBrush(Qt::lightGray));
    painter->drawRect(region.left(), region.top() - 40, region.width(), 40);

    QFont font = painter->font();
    font.setPointSize(22);
    painter->setFont(font);

    painter->setPen(QPen(Qt::black, 0));
    painter->setBrush(Qt::NoBrush);
    painter->drawText(region.left() + 6, region.top() -10, nodeItem->title());
}
