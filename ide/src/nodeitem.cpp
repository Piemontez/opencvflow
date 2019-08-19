#include "node.h"
#include "edge.h"

class NodeItemPrivate {
    CentralWidget *centralWidget;
}

NodeItem::NodeItem(CentralWidget *centralWidget)
    : d_ptr(mew NodeItemPrivate)
{
    d_func()->centralWidget = centralWidget;

    setFlag(ItemIsMovable);
    setFlag(ItemSendsGeometryChanges);
    setCacheMode(DeviceCoordinateCache);
    setZValue(-1);

    setAcceptHoverEvents(true);
}

QString NodeItem::title()
{
   return "Empty Node";
}

void NodeItem::addEdge(Edge *edge)
{
    NodeItem::addEdge(edge);
    
    edge->adjust();
}

QRectF NodeItem::boundingRect() const
{
    return QRectF(-20, -20, 220 , 130);
}
//! [8]

//! [9]
QPainterPath NodeItem::shape() const
{
    QPainterPath path;
    path.addRect(-20, -20, 220 , 130);
    return path;
}
//! [9]

//! [10]
void NodeItem::paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *wid)
{
    QRadialGradient gradient(0 , 0, 24);
    gradient.setColorAt(0, Qt::yellow);
    gradient.setColorAt(1, Qt::darkYellow);
    painter->setPen(QPen(Qt::black, 0));
    painter->setBrush(gradient);
    painter->drawRect(0, -20, 180 , 130);

    QFont font = painter->font();
    font.setPointSize(14);
    painter->setFont(font);

    painter->setPen(QPen(Qt::black, 0));
    painter->drawText(2, -6, title());

    contentPaint(QSize(180, 110), painter, option, wid);

    painter->setBrush(Qt::NoBrush);
    painter->drawLine(0, -0, 180 , -0);

    painter->setBrush(Qt::SolidPattern);
    painter->drawEllipse(188, 50, 10 , 10);

    painter->setBrush(Qt::SolidPattern);
    painter->drawEllipse(-20, 50, 10 , 10);
}

void NodeItem::contentPaint(const QSize &size, QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget)
{
    cv::Mat out;
    for (auto && mat: sources)
    {
        cv::resize(mat, out, cv::Size(size.width(), size.height()));
        painter->drawImage(0, 0, cvMatToQImage(out));
    }
}

//! [10]

//! [11]
QVariant NodeItem::itemChange(GraphicsItemChange change, const QVariant &value)
{
    switch (change) {
    case ItemPositionHasChanged:
        foreach (Edge *edge, edgeList)
            edge->adjust();
        graph->itemMoved();
        break;
    default:
        break;
    };

    return QGraphicsItem::itemChange(change, value);
}
//! [11]

//! [12]
void NodeItem::mousePressEvent(QGraphicsSceneMouseEvent *event)
{
    update();
    QGraphicsItem::mousePressEvent(event);
}

void NodeItem::mouseReleaseEvent(QGraphicsSceneMouseEvent *event)
{
    update();
    QGraphicsItem::mouseReleaseEvent(event);
}

void NodeItem::hoverEnterEvent(QGraphicsSceneHoverEvent *event)
{

}

void NodeItem::hoverLeaveEvent(QGraphicsSceneHoverEvent *event)
{

}

void NodeItem::contextMenuEvent(QGraphicsSceneContextMenuEvent *event)
{
    QMenu *menu = new QMenu;
    QAction *action = new QAction("Connect");
    action->setData(QVariant::fromValue((void*)this));

    QObject::connect(action, &QAction::triggered, graph, &GraphWidget::connectNode);

    menu->addAction(action);
    menu->popup(event->screenPos());
}