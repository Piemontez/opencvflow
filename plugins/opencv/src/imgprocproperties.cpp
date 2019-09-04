#include "imgproc.h"

#include <QWidget>
#include <QLabel>
#include <QGridLayout>
#include <QSpacerItem>
#include <QDoubleSpinBox>
#include <QSpinBox>

QWidget *SobelNode::createPropertiesWidget(QWidget *parent)
{
    auto widget = new QWidget(parent);
    auto layout = new QGridLayout(widget);
    layout->setHorizontalSpacing(4);
    layout->setVerticalSpacing(0);
    widget->setLayout(layout);

    layout->addWidget(new QLabel("DDepth", widget), 0, 0, 1, 1);
    /*auto spinBox = new QSpinBox();
    spinBox->setValue(ddepth);
    spinBox->connect(spinBox, static_cast< void (QSpinBox::*) (int) >(&QSpinBox::valueChanged), spinBox, [this] (int value) {
        ddepth = value;
    });
    layout->addWidget(spinBox, 0, 1, 1, 1);*/

    layout->addWidget(new QLabel("dx", widget), 1, 0, 1, 1);
    auto spinBox = new QSpinBox();
    spinBox->setValue(dx);
    spinBox->connect(spinBox, static_cast< void (QSpinBox::*) (int) >(&QSpinBox::valueChanged), spinBox, [this] (int value) {
        dx = value;
    });
    layout->addWidget(spinBox, 1, 1, 1, 1);

    layout->addWidget(new QLabel("dy", widget), 2, 0, 1, 1);
    spinBox = new QSpinBox();
    spinBox->setValue(dy);
    spinBox->connect(spinBox, static_cast< void (QSpinBox::*) (int) >(&QSpinBox::valueChanged), spinBox, [this] (int value) {
        dy = value;
    });
    layout->addWidget(spinBox, 2, 1, 1, 1);

    layout->addWidget(new QLabel("ksize", widget), 3, 0, 1, 1);
    spinBox = new QSpinBox();
    spinBox->setValue(ksize);
    spinBox->connect(spinBox, static_cast< void (QSpinBox::*) (int) >(&QSpinBox::valueChanged), spinBox, [this, spinBox] (int value) {
        if (ksize < value) {
            ksize = value + 1;
        } else if (ksize > value) {
            ksize = value - 1;
        }
        if (ksize != value)
            spinBox->setValue(ksize);
    });
    layout->addWidget(spinBox, 3, 1, 1, 1);

    layout->addWidget(new QLabel("scale", widget), 4, 0, 1, 1);
    auto dbSpinBox = new QDoubleSpinBox();
    dbSpinBox->setValue(scale);
    dbSpinBox->connect(dbSpinBox, static_cast< void (QDoubleSpinBox::*) (double) >(&QDoubleSpinBox::valueChanged), spinBox, [this] (double value) {
        scale = value;
    });
    layout->addWidget(dbSpinBox, 4, 1, 1, 1);

    layout->addWidget(new QLabel("delta", widget), 5, 0, 1, 1);
    dbSpinBox = new QDoubleSpinBox();
    dbSpinBox->setValue(delta);
    dbSpinBox->connect(dbSpinBox, static_cast< void (QDoubleSpinBox::*) (double) >(&QDoubleSpinBox::valueChanged), spinBox, [this] (double value) {
        delta = value;
    });
    layout->addWidget(dbSpinBox, 5, 1, 1, 1);

    layout->addItem(new QSpacerItem(40, 20, QSizePolicy::Preferred, QSizePolicy::MinimumExpanding), 6, 0, 1, 1);


    return widget;
}

