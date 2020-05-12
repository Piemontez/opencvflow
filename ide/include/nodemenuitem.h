#ifndef NODEMENUITEM_H
#define NODEMENUITEM_H

#include <QToolBar>

namespace ocvflow {

class NodeMenuItem : public QToolBar
{
public:
    explicit NodeMenuItem(QString title);
};

}
#endif // NODEMENUITEM_H
