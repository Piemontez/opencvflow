#include "items.h"

#include <QPainter>
#include <QLineF>

FakeEdgeItem::FakeEdgeItem(QPointF sourcePoint)
{
    this->sourcePoint = sourcePoint;

    setAcceptedMouseButtons(0);
}

void FakeEdgeItem::setDest(QPointF destPoint)
{
    this->destPoint = destPoint;
}

void FakeEdgeItem::adjust()
{
    QLineF line(sourcePoint, destPoint);
    qreal length = line.length();

    prepareGeometryChange();

    if (length > qreal(20.)) {
        QPointF edgeOffset((line.dx() * 10) / length, (line.dy() * 10) / length);
        sourcePoint = line.p1() + edgeOffset;
        destPoint = line.p2() - edgeOffset;
    } else {
        sourcePoint = destPoint = line.p1();
    }
}

QRectF FakeEdgeItem::boundingRect() const
{
    return QRectF(sourcePoint, QSizeF(destPoint.x() - sourcePoint.x(),
                                      destPoint.y() - sourcePoint.y()))
        .normalized();
}

void FakeEdgeItem::paint(QPainter *painter, const QStyleOptionGraphicsItem *, QWidget *)
{
    if (!destPoint.x() && !destPoint.y())
        return;

    QLineF line(sourcePoint, destPoint);
    if (qFuzzyCompare(line.length(), qreal(0.)))
        return;
    // Draw the line itself
    painter->setPen(QPen(Qt::black, 1, Qt::SolidLine, Qt::RoundCap, Qt::RoundJoin));
    painter->drawLine(line);

    // Draw the arrows
    double angle = std::atan2(-line.dy(), line.dx());

    int arrowSize = 8;
//    QPointF sourceArrowP1 = sourcePoint + QPointF(sin(angle + M_PI / 3) * arrowSize,
//                                                  cos(angle + M_PI / 3) * arrowSize);
//    QPointF sourceArrowP2 = sourcePoint + QPointF(sin(angle + M_PI - M_PI / 3) * arrowSize,
//                                                  cos(angle + M_PI - M_PI / 3) * arrowSize);
    QPointF destArrowP1 = destPoint + QPointF(sin(angle - M_PI / 3) * arrowSize,
                                              cos(angle - M_PI / 3) * arrowSize);
    QPointF destArrowP2 = destPoint + QPointF(sin(angle - M_PI + M_PI / 3) * arrowSize,
                                              cos(angle - M_PI + M_PI / 3) * arrowSize);

    painter->setBrush(Qt::black);
    //painter->drawPolygon(QPolygonF() << line.p1() << sourceArrowP1 << sourceArrowP2);
    painter->drawPolygon(QPolygonF() << line.p2() << destArrowP1 << destArrowP2);
}
