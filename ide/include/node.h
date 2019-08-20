#ifndef NODE_H
#define NODE_H

#include <QScopedPointer>
#include <QGraphicsItemGroup>
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
class Node
{
public:
    explicit Node();

    void addEdge(Edge *edge);
    QList<Edge *> edges() const;
    std::vector<cv::Mat> sources() const;

    virtual void proccess() {};

protected:
    QList<Edge *> _edges;
    std::vector<cv::Mat> _sources;
};

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

#endif // NODE_H
