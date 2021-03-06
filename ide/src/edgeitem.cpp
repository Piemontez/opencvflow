#include "items.h"

#include <QPainter>
#include <QLineF>

using namespace ocvflow;

class ocvflow::EdgeItemPrivate
{
    QPointF sourcePoint;
    QPointF destPoint;

    friend class EdgeItem;
};

EdgeItem::EdgeItem(NodeItem *sourceNode, NodeItem *destNode) : Edge(sourceNode, destNode),
                                                               d_ptr(new EdgeItemPrivate)
{
    setAcceptedMouseButtons(Qt::NoButton);

    adjust();
}

NodeItem *EdgeItem::sourceNode() const
{
    return static_cast<NodeItem *>(Edge::origNode());
}

NodeItem *EdgeItem::destNode() const
{
    return static_cast<NodeItem *>(Edge::destNode());
}

void EdgeItem::adjust()
{
    if (!orig || !dest)
        return;

    auto sourceNode = static_cast<NodeItem *>(orig);
    auto destNode = static_cast<NodeItem *>(dest);

    QLineF line(sourceNode->geometry().right(), sourceNode->geometry().center().y(),
                destNode->geometry().left(), destNode->geometry().center().y());
    qreal length = line.length();

    prepareGeometryChange();

    if (length > qreal(20.))
    {
        QPointF edgeOffset((line.dx() * 10) / length, (line.dy() * 10) / length);
        d_func()->sourcePoint = line.p1() + edgeOffset;
        d_func()->destPoint = line.p2() - edgeOffset;
    }
    else
    {
        d_func()->sourcePoint = d_func()->destPoint = line.p1();
    }
}

QRectF EdgeItem::boundingRect() const
{
    if (!orig || !dest)
        return QRectF();

    qreal penWidth = 1;
    qreal extra = penWidth; //(penWidth + arrowSize) / 2.0;

    return QRectF(d_func()->sourcePoint, QSizeF(d_func()->destPoint.x() - d_func()->sourcePoint.x(),
                                                d_func()->destPoint.y() - d_func()->sourcePoint.y()))
        .normalized()
        .adjusted(-extra, -extra, extra, extra);
}

void EdgeItem::paint(QPainter *painter, const QStyleOptionGraphicsItem *, QWidget *)
{
    if (!orig || !dest)
        return;

    QLineF line(d_func()->sourcePoint, d_func()->destPoint);
    if (qFuzzyCompare(line.length(), qreal(0.)))
        return;
    // Draw the line itself
    painter->setPen(QPen(Qt::darkGray, 3, Qt::DashLine, Qt::RoundCap, Qt::RoundJoin));
    painter->drawLine(line);

    // Draw the arrows
    double angle = std::atan2(-line.dy(), line.dx());

    int arrowSize = 8;
    //    QPointF sourceArrowP1 = sourcePoint + QPointF(sin(angle + M_PI / 3) * arrowSize,
    //                                                  cos(angle + M_PI / 3) * arrowSize);
    //    QPointF sourceArrowP2 = sourcePoint + QPointF(sin(angle + M_PI - M_PI / 3) * arrowSize,
    //                                                  cos(angle + M_PI - M_PI / 3) * arrowSize);
    QPointF destArrowP1 = d_func()->destPoint + QPointF(sin(angle - M_PI / 3) * arrowSize,
                                                        cos(angle - M_PI / 3) * arrowSize);
    QPointF destArrowP2 = d_func()->destPoint + QPointF(sin(angle - M_PI + M_PI / 3) * arrowSize,
                                                        cos(angle - M_PI + M_PI / 3) * arrowSize);

    painter->setBrush(Qt::black);
    //painter->drawPolygon(QPolygonF() << line.p1() << sourceArrowP1 << sourceArrowP2);
    painter->drawPolygon(QPolygonF() << line.p2() << destArrowP1 << destArrowP2);
}
