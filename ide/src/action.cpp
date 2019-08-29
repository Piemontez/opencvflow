#include "action.h"

#include <QMouseEvent>
#include <QPixmap>
#include <QDrag>
#include <QMimeData>
#include <QPainter>

FlowAction::FlowAction(const std::string &nodeName, const QString &text, QWidget *parent, Qt::WindowFlags f)
    : QLabel(text, parent,f)
{
    this->setProperty("nodename", QString::fromStdString(nodeName));

    setAcceptDrops(true);
}

const QRect FlowAction::targetSquare(const QPoint &position) const {
    return QRect(position, QSize(30, 30));
}

void FlowAction::dragEnterEvent(QDragEnterEvent *event) {
    if (event->source() == this) {
        event->setDropAction(Qt::MoveAction);
        event->accept();
    } else {
        event->acceptProposedAction();
    }
}

void FlowAction::dragMoveEvent(QDragMoveEvent *event) {
    if (event->source() == this) {
        event->setDropAction(Qt::MoveAction);
        event->accept();
    } else {
        event->acceptProposedAction();
    }

}

void FlowAction::dropEvent(QDropEvent *event) {
    event->ignore();
}

void FlowAction::mousePressEvent(QMouseEvent *event) {
    QPixmap pixmap = this->grab();

    auto mimeData = new QMimeData;
    mimeData->setData("nodename", QByteArray::fromStdString(this->nodeName()));

    QDrag *drag = new QDrag(this);
    drag->setMimeData(mimeData);
    drag->setPixmap(pixmap);
    drag->setHotSpot(event->pos() - this->pos());

    QPixmap tempPixmap = pixmap;
    QPainter painter;
    painter.begin(&tempPixmap);
    painter.fillRect(pixmap.rect(), QColor(127, 127, 127, 127));
    painter.end();

    if (drag->exec(Qt::CopyAction | Qt::MoveAction, Qt::CopyAction) == Qt::MoveAction) {
        this->close();
    } else {
        this->show();
    }
}

std::string FlowAction::nodeName() { return this->property("nodename").toString().toStdString(); }
