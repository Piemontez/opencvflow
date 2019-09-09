#ifndef NODEMENUITEM_H
#define NODEMENUITEM_H

#include <QGraphicsItem>

namespace ocvflow {

class NodeItem;

class NodeMenuItem : public QGraphicsItem
{
    NodeItem* nodeItem;
public:
    explicit NodeMenuItem(NodeItem*);

    enum { Type = UserType + 4 };
    int type() const override { return Type; }

    QRectF boundingRect() const override;
    //QPainterPath shape() const override;
    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget) override;
};

}
#endif // NODEMENUITEM_H
