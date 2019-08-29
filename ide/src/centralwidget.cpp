#include "window.h"
#include "items.h"
#include "component.h"

#include <math.h>

#include <QMimeData>
#include <QWidget>
#include <QKeyEvent>
#include <QWheelEvent>
#include <QDebug>

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
    scene->setSceneRect(-300, -240, 600, 480);
    setScene(scene);
    setCacheMode(CacheBackground);
    setViewportUpdateMode(BoundingRectViewportUpdate);
    setRenderHint(QPainter::Antialiasing);
    setTransformationAnchor(AnchorUnderMouse);
    scale(qreal(0.8), qreal(0.8));
    setMinimumSize(600, 480);

    setAcceptDrops(true);

    setBackgroundBrush(QBrush(Qt::lightGray, Qt::SolidPattern));
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
    QGraphicsView::drawBackground(painter, rect);

    QRectF sceneRect = this->sceneRect();

    painter->setPen(QPen(Qt::gray, Qt::SolidPattern));
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
    if (event->mimeData()->hasFormat("nodename")) {
        event->setDropAction(Qt::MoveAction);
        event->accept();
    } else {
        event->ignore();
    }
}

void CentralWidget::dragEnterEvent(QDragEnterEvent *event)
{
    if (event->mimeData()->hasFormat("nodename")) {
        event->acceptProposedAction();
        event->accept();
    } else
        event->ignore();
}

#include <QLabel>


void CentralWidget::dropEvent(QDropEvent *event)
{
    if (event->mimeData()->hasFormat("nodename")) {
        //Verifica se o componente foi registrado
        auto component = MainWindow::instance()->component(event->mimeData()->data("nodename").toStdString());
        if (component) {
            //Solicita a criação do nodeitem pelo componente
            auto nodeitem = static_cast< NodeItem* >(component->createNode());
            if (nodeitem) {
                //coleta a posição ao soltar o mouse

                nodeitem->setPos(MainWindow::instance()->centralWidget()->mapToScene(event->pos()));
                scene()->addItem(nodeitem);
            }
        }
        event->setDropAction(Qt::MoveAction);
        event->accept();
    } else
        event->ignore();
}

void CentralWidget::mousePressEvent(QMouseEvent *event)
{
    QGraphicsView::mousePressEvent(event);
}
