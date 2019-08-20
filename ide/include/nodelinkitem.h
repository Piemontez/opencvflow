#ifndef NODELINKITEM_H
#define NODELINKITEM_H

#include <QGraphicsItem>

#include "edge.h"

class FakeEdgeItem;
/**
 * @brief The NodeLinkItem;
 */
class NodeLinkItem : public QGraphicsItem
{
    NodeItem* nodeItem;
    FakeEdgeItem* faceEdgeItem{0};
public:
    explicit NodeLinkItem(NodeItem*);

    enum { Type = UserType + 3 };
    int type() const override { return Type; }

    QRectF boundingRect() const override;
    QPainterPath shape() const override;
    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget) override;

protected:
    void mousePressEvent(QGraphicsSceneMouseEvent *event) override;
    void mouseMoveEvent(QGraphicsSceneMouseEvent *event) override;
    void mouseReleaseEvent(QGraphicsSceneMouseEvent *event) override;
};
#endif // NODELINKITEM_H
