#include "items.h"
#include "nodemenuitem.h"

#include <QPainter>
#include <QFont>
#include <QRadialGradient>

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

    painter->drawRect(region.left(), region.top() - 25, region.width(), 24);

    QFont font = painter->font();
    font.setPointSize(14);
    painter->setFont(font);

    painter->setBrush(Qt::NoBrush);

    painter->drawText(region.left() +2, region.top() -6, nodeItem->title());

}
