#include "window.h"
#include "items.h"
#include "component.h"

#include <math.h>

#include <QGraphicsProxyWidget>
#include <QMimeData>
#include <QWidget>
#include <QKeyEvent>
#include <QWheelEvent>
#include <QDebug>

using namespace ocvflow;

class ocvflow::CentralWidgetPrivate
{
    bool moveViewPort{false};
    double mouseOriginX;
    double mouseOriginY;

    friend class CentralWidget;
    CentralWidgetPrivate() {}
};

CentralWidget::CentralWidget(QWidget *parent) : QGraphicsView(parent),
                                                d_ptr(new CentralWidgetPrivate)
{
    QGraphicsScene *scene = new QGraphicsScene(this);
    scene->setItemIndexMethod(QGraphicsScene::NoIndex);
    scene->setSceneRect(-8000, -3000, 16000, 6000);

    setScene(scene);
    setCacheMode(CacheBackground);
    setViewportUpdateMode(BoundingRectViewportUpdate);
    //setRenderHint(QPainter::Antialiasing);
    setTransformationAnchor(AnchorUnderMouse);

    setMinimumSize(640, 480);

    setAcceptDrops(true);

    setBackgroundBrush(QBrush(Qt::lightGray, Qt::SolidPattern));

    scaleView(0.8);
}

void CentralWidget::keyPressEvent(QKeyEvent *event)
{
    switch (event->key())
    {
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
    scaleView(pow((double)2, -event->angleDelta().rx() / 240.0));
}
#endif

void CentralWidget::scaleView(qreal scaleFactor)
{
    qreal factor = transform().scale(scaleFactor, scaleFactor).mapRect(QRectF(0, 0, 1, 1)).width();
    if (factor < 0.07 || factor > 2)
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

void CentralWidget::drawBackground(QPainter *painter, const QRectF &rect)
{
    QGraphicsView::drawBackground(painter, rect);

    QRectF sceneRect = this->sceneRect();

    painter->setPen(QPen(Qt::gray, 2, Qt::DashLine));
    painter->drawLine(sceneRect.left() * 2, 0, sceneRect.right() * 2, 0);
    painter->drawLine(0, sceneRect.top() * 2, 0, sceneRect.bottom() * 2);
}

void CentralWidget::dragLeaveEvent(QDragLeaveEvent *event)
{
    event->accept();
}

void CentralWidget::dragMoveEvent(QDragMoveEvent *event)
{
    if (event->mimeData()->hasFormat("nodename"))
    {
        event->setDropAction(Qt::MoveAction);
        event->accept();
    }
    else
    {
        event->ignore();
    }
}

void CentralWidget::dragEnterEvent(QDragEnterEvent *event)
{
    if (event->mimeData()->hasFormat("nodename"))
    {
        event->acceptProposedAction();
        event->accept();
    }
    else
        event->ignore();
}

#include <QLabel>

void CentralWidget::dropEvent(QDropEvent *event)
{
    if (event->mimeData()->hasFormat("nodename"))
    {
        //Verifica se o componente foi registrado
        auto component = MainWindow::instance()->component(event->mimeData()->data("nodename").toStdString());
        if (component)
        {
            //Solicita a criação do nodeitem pelo componente
            auto nodeitem = static_cast<NodeItem *>(component->createNode());
            if (nodeitem)
            {
                //coleta a posição ao soltar o mouse
                QGraphicsProxyWidget *proxy = scene()->addWidget(nodeitem);
                nodeitem->setProxyWidget(proxy);
                proxy->setPos(this->mapToScene(event->pos()));
            }
        }
        event->setDropAction(Qt::MoveAction);
        event->accept();
    }
    else
        event->ignore();
}

void CentralWidget::mousePressEvent(QMouseEvent *event)
{
    if (event->button() == Qt::LeftButton)
    {
        d_func()->moveViewPort = !itemAt(event->pos());

        d_func()->mouseOriginX = event->x();
        d_func()->mouseOriginY = event->y();
    }
    QGraphicsView::mousePressEvent(event);
}

void CentralWidget::mouseMoveEvent(QMouseEvent *event)
{
    if (d_func()->moveViewPort)
    {
        QPointF oldp = mapToScene(d_func()->mouseOriginX, d_func()->mouseOriginY);
        QPointF newp = mapToScene(event->pos());
        QPointF translation = newp - oldp;

        translate(translation.x(), translation.y());

        d_func()->mouseOriginX = event->x();
        d_func()->mouseOriginY = event->y();
    }
    QGraphicsView::mouseMoveEvent(event);
}

void CentralWidget::mouseReleaseEvent(QMouseEvent *event)
{
    d_func()->moveViewPort = false;

    QGraphicsView::mouseReleaseEvent(event);
}
