#ifndef NODE_H
#define NODE_H

#include <QGraphicsItem>
#include <QList>

#include "opencv2/opencv.hpp"

class Edge;
class EdgeItem;
class CentralWidget;
QT_BEGIN_NAMESPACE
class QGraphicsSceneMouseEvent;
QT_END_NAMESPACE

namespace cv {
    class VideoCapture;
    class Mat;
}

/**
 * @brief The Node;
 */
class NodePrivate;
class Node
{
    QScopedPointer<NodePrivate> d_ptr;
    Q_DECLARE_PRIVATE(Node)
public:
    explicit Node();

    void addEdge(Edge *edge);
    QList<Edge *> edges() const;
    std::vector<cv::Mat> sources() const;

    virtual void proccess() = 0;
};

/**
 * @brief The NodeItem;
 */
class NodeItemPrivate;
class NodeItem : public Node, QGraphicsItem
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
    void contextMenuEvent(QGraphicsSceneContextMenuEvent *event) override;

    QRectF boundingRect() const override;
    QPainterPath shape() const override;
    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget) override;
    virtual void contentPaint(const QSize &size, QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget);
protected:
    QVariant itemChange(GraphicsItemChange change, const QVariant &value) override;

    void mousePressEvent(QGraphicsSceneMouseEvent *event) override;
    void mouseReleaseEvent(QGraphicsSceneMouseEvent *event) override;

    void hoverEnterEvent(QGraphicsSceneHoverEvent *event) override;
    //virtual void hoverMoveEvent(QGraphicsSceneHoverEvent *event);
    void hoverLeaveEvent(QGraphicsSceneHoverEvent *event) override;
};

#endif // NODE_H