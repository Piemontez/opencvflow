#ifndef ITEMS_H
#define ITEMS_H

#include "globals.h"
#include "edge.h"
#include "node.h"

#include <QWidget>
#include <QGraphicsItemGroup>
#include <QList>
#include <QGraphicsItem>

class QMouseEvent;
class QWidget;
class QGraphicsProxyWidget;

namespace ocvflow
{
    /**
    * @brief The NodeItem;
    */
    class NodeItemPrivate;
    class NodeItem : public Node, public QWidget
    {
        NodeItemPrivate *d_ptr;
        Q_DECLARE_PRIVATE(NodeItem)
    public:
        NodeItem(QWidget *parent = nullptr);
        NodeItem(CentralWidget *centralWidget, QString title = "", QWidget *parent = nullptr);
        ~NodeItem();

        void setError(const QString &error);
        void setLastUpdateCall(const float &lastUpdateCall);

        void addEdge(EdgeItem *edge);
        virtual QString title();

        virtual QMap<QString, ocvflow::Properties> properties();
        virtual PropertiesVariant property(const QString &property);
        virtual bool /*acepted*/ setProperty(const QString &property, const PropertiesVariant &value);

        /**
         * Criar um widget gerenciador de propriedades
         * conforme as propriedades descritas na função properties
         */
        virtual QWidget *createPropertiesWidget(QWidget *parent);

        void paintEvent(QPaintEvent *event) override;

        virtual void contentPaint(const QRect &region, QPainter *painter);

        ////    void contextMenuEvent(QGraphicsSceneContextMenuEvent *event) override;

    protected:
        bool eventFilter(QObject *obj, QEvent *event) override;
        //QVariant itemChange(GraphicsItemChange change, const QVariant &value);

        void mousePressEvent(QMouseEvent *event) override;
        void mouseMoveEvent(QMouseEvent *event) override;
        void mouseReleaseEvent(QMouseEvent *event) override;

        QGraphicsProxyWidget * proxyWidget();
        void setProxyWidget(QGraphicsProxyWidget *proxyWidget);

        ////    void hoverEnterEvent(QGraphicsSceneHoverEvent *event) override;
        ////    //virtual void hoverMoveEvent(QGraphicsSceneHoverEvent *event);
        ////    void hoverLeaveEvent(QGraphicsSceneHoverEvent *event) override;

        friend class CentralWidget;
        friend class MainWindow;
    };

    /**
    * @brief The EdgeItem;
    */
    class EdgeItemPrivate;
    class EdgeItem : public Edge, public QGraphicsItem
    {
        //Q_OBJECT

        EdgeItemPrivate *d_ptr;
        Q_DECLARE_PRIVATE(EdgeItem)
    public:
        explicit EdgeItem(NodeItem *sourceNode, NodeItem *destNode);

        NodeItem *sourceNode() const;
        NodeItem *destNode() const;

        void adjust();

        enum
        {
            Type = UserType + 2
        };
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

        enum
        {
            Type = UserType + 4
        };
        int type() const override { return Type; }

    protected:
        QRectF boundingRect() const override;
        void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget) override;
    };

} // namespace ocvflow

#endif // EDGE_H
