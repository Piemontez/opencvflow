#include "window.h"
#include "node.h"
#include "edge.h"

#include <math.h>

#include <QMimeData>
#include <QWidget>
#include <QKeyEvent>
#include <QWheelEvent>

class CentralWidgetPrivate {
    //Node *centerNode;

    friend class CentralWidget;
    CentralWidgetPrivate() {}
};

CentralWidget::CentralWidget(QWidget *parent):
    QGraphicsView(parent),
    d_ptr(new CentralWidgetPrivate)
{
    QGraphicsScene *scene = new QGraphicsScene(this);
    scene->setItemIndexMethod(QGraphicsScene::NoIndex);
    scene->setSceneRect(-200, -200, 800, 600);
    setScene(scene);
    setCacheMode(CacheBackground);
    setViewportUpdateMode(BoundingRectViewportUpdate);
    setRenderHint(QPainter::Antialiasing);
    setTransformationAnchor(AnchorUnderMouse);
    scale(qreal(0.8), qreal(0.8));
    setMinimumSize(800, 600);
    setWindowTitle(tr("Elastic Nodes"));

    setAcceptDrops(true);

    //scene->addItem(new NodeItem(this));
    //scene->addItem(new NodeItem(this));

    /*
    QThread *th = QThread::create([this] {
        std::clock_t last = std::clock();
        forever {
            for (auto && item: this->items())
            {
                if (Node::Type != item->type())
                    continue;

                static_cast<Node*>(item)->proccess();

                if (float( std::clock () - last ) > 42) {
                    last = std::clock();
                    static_cast<Node*>(item)->update();
                }
            }
        }
    });
    th->setPriority(QThread::LowestPriority);
    th->start();
    */
}

void CentralWidget::keyPressEvent(QKeyEvent *event)
{
    switch (event->key()) {
 /*   case Qt::Key_Up:
        centerNode->moveBy(0, -20);
        break;
    case Qt::Key_Down:
        centerNode->moveBy(0, 20);
        break;
    case Qt::Key_Left:
        centerNode->moveBy(-20, 0);
        break;
    case Qt::Key_Right:
        centerNode->moveBy(20, 0);
        break;*/
    case Qt::Key_Plus:
        zoomIn();
        break;
    case Qt::Key_Minus:
        zoomOut();
        break;
    default:
        QGraphicsView::keyPressEvent(event);
    }
}

#if QT_CONFIG(wheelevent)
void CentralWidget::wheelEvent(QWheelEvent *event)
{
    scaleView(pow((double)2, -event->delta() / 240.0));
}
#endif

void CentralWidget::drawBackground(QPainter *painter, const QRectF &rect)
{
    Q_UNUSED(rect);

    QRectF sceneRect = this->sceneRect();

    painter->setPen(QPen(Qt::lightGray, 0));
    painter->drawLine(sceneRect.left() * 4, 0, sceneRect.right() * 4, 0);
    painter->drawLine(0, sceneRect.top() * 4, 0, sceneRect.bottom() * 4);
}

void CentralWidget::scaleView(qreal scaleFactor)
{
    qreal factor = transform().scale(scaleFactor, scaleFactor).mapRect(QRectF(0, 0, 1, 1)).width();
    if (factor < 0.07 || factor > 100)
        return;

    scale(scaleFactor, scaleFactor);
}

void CentralWidget::zoomIn()
{
    scaleView(qreal(1.2));
}

void CentralWidget::zoomOut()
{
    scaleView(1 / qreal(1.2));
}

void CentralWidget::dragLeaveEvent(QDragLeaveEvent *event)
{
    event->accept();
}

void CentralWidget::dragMoveEvent(QDragMoveEvent *event)
{
    if (event->mimeData()->hasFormat("application/x-dnditemdata")) {
        event->setDropAction(Qt::MoveAction);
        event->accept();
    } else {
        event->ignore();
    }
}

void CentralWidget::dragEnterEvent(QDragEnterEvent *event)
{
    if (event->mimeData()->hasFormat("application/x-dnditemdata")) {
        event->acceptProposedAction();
        event->accept();
    } else
        event->ignore();
}

void CentralWidget::dropEvent(QDropEvent *event)
{
    if (event->mimeData()->hasFormat("application/x-dnditemdata")) {

        /*Node *node = nullptr;
        if (event->mimeData()->data("nodename").compare("videocapture") == 0) {
            node = new VideoCapture(this);
        }
        if (node) {
            node->setPos(event->pos());
            scene()->addItem(node);
        }*/

        event->setDropAction(Qt::MoveAction);
        event->accept();
    } else
        event->ignore();
}

void CentralWidget::mousePressEvent(QMouseEvent *event)
{
    QGraphicsView::mousePressEvent(event);
}

void CentralWidget::connectNode(NodeItem *source, NodeItem *dest)
{
    scene()->addItem(new EdgeItem(source, dest));
}
