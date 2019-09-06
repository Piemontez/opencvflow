#ifndef ITEMS_H
#define ITEMS_H

#include "edge.h"
#include "node.h"

#include <QGraphicsItemGroup>
#include <QList>
#include <QGraphicsItem>

QT_BEGIN_NAMESPACE
class QGraphicsSceneMouseEvent;
QT_END_NAMESPACE
class QWidget;

/**
 * @brief The NodeItem;
 */
class NodeItemPrivate;
class NodeItem : public Node, public QGraphicsItemGroup
{
    //Q_OBJECT

    NodeItemPrivate* d_ptr;
    Q_DECLARE_PRIVATE(NodeItem)
public:
    explicit NodeItem(CentralWidget *centralWidget, QString title = "");

    enum { Type = UserType + 1 };
    int type() const override { return Type; }

    void addEdge(EdgeItem *edge);
    virtual QString title();
    virtual QWidget* createPropertiesWidget(QWidget* parent);

    QRect contentRegion();
    virtual void contentPaint(const QRect &region, QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget);

    QRectF boundingRect() const override;
    QPainterPath shape() const override;
    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget) override;
//    void contextMenuEvent(QGraphicsSceneContextMenuEvent *event) override;

protected:
    QVariant itemChange(GraphicsItemChange change, const QVariant &value) override;

    void mousePressEvent(QGraphicsSceneMouseEvent *event) override;
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

    EdgeItemPrivate* d_ptr;
    Q_DECLARE_PRIVATE(EdgeItem)
public:
    explicit EdgeItem(NodeItem *sourceNode, NodeItem *destNode);

    NodeItem *sourceNode() const;
    NodeItem *destNode() const;

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
