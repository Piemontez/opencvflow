#ifndef NODEMENUITEM_H
#define NODEMENUITEM_H

#include <QToolBar>

#include "items.h"

class QMouseEvent;

namespace ocvflow
{

    class NodeMenuItem : public QToolBar
    {
    public:
        explicit NodeMenuItem(QString title, QWidget *parent = nullptr);

    protected:
        //QVariant itemChange(GraphicsItemChange change, const QVariant &value);

        void mousePressEvent(QMouseEvent *event) override;
        void mouseMoveEvent(QMouseEvent *event) override;
        void mouseReleaseEvent(QMouseEvent *event) override;
    };
} // namespace ocvflow
#endif // NODEMENUITEM_H
