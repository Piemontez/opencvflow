#ifndef ITEMS_H
#define ITEMS_H

#include "edge.h"
#include "node.h"

#include <QScopedPointer>
#include <QGraphicsItemGroup>
#include <QList>
#include <QGraphicsItem>

QT_BEGIN_NAMESPACE
class QGraphicsSceneMouseEvent;
QT_END_NAMESPACE

/**
 * @brief The NodeItem;
 */
class NodeItemPrivate;
class NodeItem : public Node, public QGraphicsItemGroup
{
    //Q_OBJECT

    QScopedPointer<NodeItemPrivate> d_ptr;
    Q_DECLARE_PRIVATE(NodeItem)
public:
    explicit NodeItem(CentralWidget *centralWidget);

    enum { Type = UserType + 1 };
    int type() const override { return Type; }

    void addEdge(EdgeItem *edge);

    virtual QString title();
    QRect contentRegion();
    virtual void contentPaint(const QRect &region, QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget);

    QRectF boundingRect() const override;
    QPainterPath shape() const override;
    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget) override;
    //void contextMenuEvent(QGraphicsSceneContextMenuEvent *event) override;

protected:
    QVariant itemChange(GraphicsItemChange change, const QVariant &value) override;

//    void mousePressEvent(QGraphicsSceneMouseEvent *event) override;
//    void mouseReleaseEvent(QGraphicsSceneMouseEvent *event) override;

//    void hoverEnterEvent(QGraphicsSceneHoverEvent *event) override;
//    //virtual void hoverMoveEvent(QGraphicsSceneHoverEvent *event);
//    void hoverLeaveEvent(QGraphicsSceneHoverEvent *event) override;
};

/**
 * @brief The EdgeItem;
 */
class EdgeItemPrivate;
class EdgeItem : public Edge, public QGraphicsItem
{
    //Q_OBJECT

    QScopedPointer<EdgeItemPrivate> d_ptr;
    Q_DECLARE_PRIVATE(EdgeItem)
public:
    explicit EdgeItem(NodeItem *sourceNode, NodeItem *destNode);

    Node *sourceNode() const;
    Node *destNode() const;

    void adjust();

    enum { Type = UserType + 2 };
    int type() const override { return Type; }

protected:
    QRectF boundingRect() const override;
    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget) override;
};


/**
 * @brief The FakeEdgeItem;
 */
class FakeEdgeItem : public QGraphicsItem
{
    QPointF sourcePoint;
    QPointF destPoint;
public:
    explicit FakeEdgeItem(QPointF sourcePoint);

    void setDest(QPointF destPoint);
    void adjust();

    enum { Type = UserType + 4 };
    int type() const override { return Type; }

protected:
    QRectF boundingRect() const override;
    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget) override;
};
#endif // EDGE_H
