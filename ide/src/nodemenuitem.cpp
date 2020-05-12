#include "nodemenuitem.h"

#include <QLabel>

using namespace ocvflow;

NodeMenuItem::NodeMenuItem(QString title)
{
    this->addWidget(new QLabel(title));
}
