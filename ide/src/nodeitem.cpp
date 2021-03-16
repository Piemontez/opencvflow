#include "node.h"
#include "edge.h"
#include "items.h"
#include "nodemenuitem.h"
#include "window.h"
#include "utils.h"

#include <QPainter>
#include <QGraphicsProxyWidget>
#include <QStyleOptionGraphicsItem>
#include <QGraphicsSceneContextMenuEvent>
#include <QMouseEvent>
#include <QWidget>
#include <QGridLayout>
#include <QLabel>
#include <QSpinBox>
#include <QDoubleSpinBox>
#include <QCheckBox>
#include <QPushButton>

using namespace ocvflow;

class ocvflow::NodeItemPrivate
{
    QGraphicsProxyWidget *proxyWidget{nullptr};

    QString title;           //título do widget
    QString error;           //Mensagem de erro ao realizar processamento
    QImage contentViewCache; //cache da última imagem processada
    float lastUpdateCall;    //último processamento
    float lastViewUpdated;   //última atualização da imagem visualizada
    bool resize{false};           //título do widget

    friend class NodeItem;
};

NodeItem::NodeItem(QWidget *parent)
    : QWidget(parent),
      d_ptr(new NodeItemPrivate)
{
}

NodeItem::NodeItem(CentralWidget *centralWidget, QString title, QWidget *parent)
    : NodeItem(parent)
{
    d_func()->lastViewUpdated = 0;

    this->setMinimumSize(240, 100);
    this->setFixedSize(540, 400);

    auto nodeMenuItem = new NodeMenuItem(title, this);
    auto resizerButton = new QPushButton(this);
    resizerButton->setFlat(true);
    resizerButton->setFixedSize(20, 20);
    resizerButton->setCursor(Qt::SizeFDiagCursor);
    resizerButton->setStyleSheet("QPushButton { background-color: transparent; border: 0px }");

    auto dockLayout = new QVBoxLayout();
    dockLayout->setMargin(0);
    dockLayout->setSpacing(0);
    dockLayout->setMenuBar(nodeMenuItem);
    dockLayout->addWidget(resizerButton, 0, Qt::AlignRight | Qt::AlignBottom);

    this->setLayout(dockLayout);

    d_func()->title = title.isEmpty()
                          ? "Empty Node"
                          : title;


    //dockLayout->installEventFilter(this);
    dockLayout->connect(resizerButton, &QPushButton::pressed, dockLayout, [this] {
        d_func()->resize = true;
    });
    dockLayout->connect(resizerButton, &QPushButton::released, dockLayout, [this] {
        d_func()->resize = false;
    });
}

NodeItem::~NodeItem()
{
}

void NodeItem::setError(const QString &error)
{
    d_func()->error = error;
}

void NodeItem::setLastUpdateCall(const float &lastUpdateCall)
{
    d_func()->lastUpdateCall = lastUpdateCall;
}

QString NodeItem::title()
{
    return d_func()->title;
}

QMap<QString, Properties> NodeItem::properties()
{
    QMap<QString, Properties> props;

    return props;
}

PropertiesVariant NodeItem::property(const QString &property)
{
    return {0};
}

bool NodeItem::setProperty(const QString &property, const PropertiesVariant &value)
{
    return true;
}

/**
 * Cria menu de propriedades conforme especificações do nó
 */
QWidget *NodeItem::createPropertiesWidget(QWidget *parent)
{
    QMap<QString, Properties> props = this->properties();

    if (props.size() == 0)
        return nullptr;

    auto widget = new QWidget(parent);
    auto layout = new QGridLayout(widget);
    layout->setHorizontalSpacing(4);
    layout->setVerticalSpacing(0);
    widget->setLayout(layout);

    int pos = 0;
    for (auto &&entry : props.toStdMap())
    {
        switch (entry.second)
        {
        case ocvflow::IntProperties:
        {
            auto spinBox = new QSpinBox();
            spinBox->setMaximum(std::numeric_limits<int>::max());
            spinBox->setValue(this->property(entry.first).i);
            spinBox->connect(spinBox, static_cast<void (QSpinBox::*)(int)>(&QSpinBox::valueChanged), spinBox, [this, spinBox, entry](int value) {
                if (!this->setProperty(entry.first, value))
                {
                    spinBox->setValue(this->property(entry.first).i);
                }
            });

            layout->addWidget(new QLabel(entry.first, widget), pos, 0, 1, 1);
            layout->addWidget(spinBox, pos, 1, 1, 1);
            break;
        }
        case ocvflow::FloatProperties:
        case ocvflow::DoubleProperties:
        {
            auto doubleSpinBox = new QDoubleSpinBox();
            doubleSpinBox->setMaximum(std::numeric_limits<double>::max());
            doubleSpinBox->setValue(this->property(entry.first).d);
            doubleSpinBox->connect(doubleSpinBox, static_cast<void (QDoubleSpinBox::*)(double)>(&QDoubleSpinBox::valueChanged), doubleSpinBox, [this, doubleSpinBox, entry](double value) {
                switch (entry.second)
                {
                case ocvflow::FloatProperties:
                    if (!this->setProperty(entry.first, (float)value))
                    {
                        doubleSpinBox->setValue(this->property(entry.first).i);
                    }
                case ocvflow::DoubleProperties:
                default:
                    if (!this->setProperty(entry.first, value))
                    {
                        doubleSpinBox->setValue(this->property(entry.first).i);
                    }
                }
            });

            layout->addWidget(new QLabel(entry.first, widget), pos, 0, 1, 1);
            layout->addWidget(doubleSpinBox, pos, 1, 1, 1);
        }
        case ocvflow::SizeIntProperties:
        {
            auto spinBoxl = new QSpinBox();
            spinBoxl->setMaximum(std::numeric_limits<int>::max());
            spinBoxl->setValue(std::get<0>(this->property(entry.first).sizeI));

            auto spinBoxr = new QSpinBox();
            spinBoxr->setMaximum(std::numeric_limits<int>::max());
            spinBoxr->setValue(std::get<1>(this->property(entry.first).sizeI));

            auto func = [this, spinBoxl, spinBoxr, entry](int /*value*/) {
                if (!this->setProperty(entry.first, ocvflow::PropertiesVariant(spinBoxl->value(), spinBoxr->value())))
                {
                    spinBoxl->setValue(std::get<0>(this->property(entry.first).sizeI));
                    spinBoxr->setValue(std::get<1>(this->property(entry.first).sizeI));
                }
            };

            spinBoxl->connect(spinBoxl, static_cast<void (QSpinBox::*)(int)>(&QSpinBox::valueChanged), spinBoxl, func);
            spinBoxr->connect(spinBoxr, static_cast<void (QSpinBox::*)(int)>(&QSpinBox::valueChanged), spinBoxr, func);

            layout->addWidget(new QLabel(entry.first, widget), pos, 0, 1, 1);
            layout->addWidget(spinBoxl, pos, 1, 1, 1);
            layout->addWidget(spinBoxr, pos, 2, 1, 1);
            break;
        }
        case ocvflow::BooleanProperties:
        {
            auto checkbox = new QCheckBox();
            checkbox->setChecked(this->property(entry.first).b);

            checkbox->connect(checkbox, static_cast<void (QCheckBox::*)(int)>(&QCheckBox::stateChanged), checkbox, [this, checkbox, entry](int value) {
                if (!this->setProperty(entry.first, checkbox->isChecked()))
                {
                    checkbox->setChecked(this->property(entry.first).b);
                }
            });

            layout->addWidget(checkbox, pos, 0, 1, 1);
            layout->addWidget(new QLabel(entry.first, widget), pos, 1, 1, 1);
            break;
        }
        case ocvflow::IntTableProperties:
        {
            auto sizeX = new QSpinBox();
            sizeX->setMaximum(std::numeric_limits<int>::max());
            sizeX->setValue(3);

            auto sizeY = new QSpinBox();
            sizeY->setMaximum(std::numeric_limits<int>::max());
            sizeY->setValue(3);

            layout->addWidget(new QLabel(entry.first, widget), pos, 0, 1, 1);
            layout->addWidget(sizeX, pos, 1, 1, 1);
            layout->addWidget(sizeY, pos, 2, 1, 1);

            pos++;

            auto gridW = new QWidget(parent);
            auto gridL = new QGridLayout(gridW);
            gridL->setHorizontalSpacing(4);
            gridL->setVerticalSpacing(0);
            gridW->setLayout(gridL);

            layout->addWidget(gridW, pos, 0, 1, 3);

            auto func = [this, gridL, sizeX, sizeY, entry](int /*value*/) {
                //removes excess widgets
                for (int j = sizeX->value(); j < gridL->columnCount(); j++)
                {
                    for (int k = sizeY->value(); k < gridL->rowCount(); k++)
                    {
                        auto item = gridL->itemAtPosition(k, j);
                        if (item)
                        {
                            gridL->removeItem(item);
                            delete item;
                        }
                    }
                }
                //add new widgets
                for (int j = 0; j < sizeX->value(); j++)
                {
                    for (int k = 0; k < sizeY->value(); k++)
                    {
                        if (!gridL->itemAtPosition(k, j))
                            gridL->addWidget(new QSpinBox(), k, j, 1, 1);
                    }
                }
            };

            sizeX->connect(sizeX, static_cast<void (QSpinBox::*)(int)>(&QSpinBox::valueChanged), sizeX, func);
            sizeY->connect(sizeY, static_cast<void (QSpinBox::*)(int)>(&QSpinBox::valueChanged), sizeY, func);

            func(0);

            break;
        }
        case ocvflow::OneZeroTableProperties:
        {
            //Quantidade X de posições
            auto sizeX = new QSpinBox();
            sizeX->setMaximum(std::numeric_limits<int>::max());
            sizeX->setValue(3);

            //Quantidade Y de posições
            auto sizeY = new QSpinBox();
            sizeY->setMaximum(std::numeric_limits<int>::max());
            sizeY->setValue(3);

            layout->addWidget(new QLabel(entry.first, widget), pos, 0, 1, 1);
            layout->addWidget(sizeX, pos, 1, 1, 1);
            layout->addWidget(sizeY, pos, 2, 1, 1);

            pos++;

            auto gridW = new QWidget(parent);
            auto gridL = new QGridLayout(gridW);
            gridL->setHorizontalSpacing(4);
            gridL->setVerticalSpacing(0);
            gridW->setLayout(gridL);

            layout->addWidget(gridW, pos, 0, 1, 3);

            auto func = [this, gridL, sizeX, sizeY, entry](int /*value*/) {
                //cv::Mat mat = cv::getStructuringElement(cv::MORPH_ELLIPSE, cv::Point(sizeX->value(), sizeY->value()));
                cv::Mat mat = this->property(entry.first).mat;

                this->setProperty(entry.first, mat);

                for (int j = sizeX->value(); j < gridL->columnCount(); j++)
                {
                    for (int k = sizeY->value(); k < gridL->rowCount(); k++)
                    {
                        auto item = gridL->itemAtPosition(k, j);
                        if (item)
                        {
                            gridL->removeItem(item);
                            delete item;
                        }
                    }
                }
                //add new widgets
                for (int j = 0; j < sizeX->value(); j++)
                {
                    for (int k = 0; k < sizeY->value(); k++)
                    {
                        if (!gridL->itemAtPosition(k, j))
                        {
                            auto checkbox = new QCheckBox();
                            checkbox->setChecked(this->property(entry.first).mat.at<int>(j, k));
                            checkbox->connect(checkbox, static_cast<void (QCheckBox::*)(int)>(&QCheckBox::stateChanged), checkbox, [this, checkbox, j, k, entry](int value) {
                                auto isChecked = value == Qt::Checked;

                                auto mat = this->property(entry.first).mat;
                                mat.at<int>(j, k) = isChecked ? 1 : 0;

                                if (!this->setProperty(entry.first, mat))
                                {
                                    checkbox->setChecked(this->property(entry.first).mat.at<int>(j, k));
                                }
                            });

                            gridL->addWidget(checkbox, k, j, 1, 1);
                        }
                    }
                }
            };

            sizeX->connect(sizeX, static_cast<void (QSpinBox::*)(int)>(&QSpinBox::valueChanged), sizeX, func);
            sizeY->connect(sizeY, static_cast<void (QSpinBox::*)(int)>(&QSpinBox::valueChanged), sizeY, func);

            func(0);

            break;
        }
        case ocvflow::EmptyProperties:
        case ocvflow::DoubleTableProperties:
        default:
        {
            layout->addWidget(new QLabel(entry.first, widget), pos, 0, 1, 1);
            break;
        }
        }
        pos++;
    }

    layout->addItem(new QSpacerItem(40, 20, QSizePolicy::Preferred, QSizePolicy::MinimumExpanding), 6, 0, 1, 1);
    return widget;
}

void NodeItem::addEdge(EdgeItem *edge)
{
    NodeItem::addEdge(edge);

    edge->adjust();
}

void NodeItem::paintEvent(QPaintEvent *event)
{
    QPainter painter;
    painter.begin(this);

    contentPaint(event->rect(), &painter);
    //contentPaint(d_func()->contentSize, &painter);

    painter.end();
}

void NodeItem::contentPaint(const QRect &region, QPainter *painter)
{
    acquire();
    if (!d_func()->error.isEmpty())
    {
        painter->setPen(QPen(Qt::white, 4));
        painter->drawLine(region.left(), region.top(), region.right(), region.bottom());
        painter->drawLine(region.right(), region.top(), region.left(), region.bottom());
    }
    else
    {
        //Verifica se teve modificação 
        if (!d_func()->lastViewUpdated || !d_func()->lastUpdateCall || d_func()->lastViewUpdated != d_func()->lastUpdateCall)
        {
            d_func()->lastViewUpdated = d_func()->lastUpdateCall;

            cv::Mat out;
            for (auto &&mat : sources())
            {
                try
                {
                    //Redimenciona a imagem para o tamanho do widget
                    cv::resize(mat, out, cv::Size(region.width(), region.height()));
                    auto image = cvMatToQImage(out);

                    d_func()->contentViewCache = image;

                    painter->drawImage(region.left(), region.top(), image);
                }
                catch (...)
                {
                }
            }
        }
        else
        {
            painter->drawImage(region.left(), region.top(), d_func()->contentViewCache);
        }
    }

    release();
}

void NodeItem::mousePressEvent(QMouseEvent *event)
{
    QWidget::mousePressEvent(event);

    MainWindow::instance()->nodeMousePressEvent(this, event);

    event->accept();
}

void NodeItem::mouseMoveEvent(QMouseEvent *event)
{
    MainWindow::instance()->nodeMouseMoveEvent(this, event);

    QWidget::mouseMoveEvent(event);
}

void NodeItem::mouseReleaseEvent(QMouseEvent *event)
{
    MainWindow::instance()->nodeMouseReleaseEvent(this, event);

    QWidget::mouseReleaseEvent(event);
}

QGraphicsProxyWidget *NodeItem::proxyWidget()
{
    return d_func()->proxyWidget;
}

void NodeItem::setProxyWidget(QGraphicsProxyWidget *proxyWidget)
{
    d_func()->proxyWidget = proxyWidget;
}

/*
void NodeItem::hoverEnterEvent(QGraphicsSceneHoverEvent *event)
{

}

void NodeItem::hoverLeaveEvent(QGraphicsSceneHoverEvent *event)
{

}*/

/*
void NodeItem::contextMenuEvent(QGraphicsSceneContextMenuEvent *event)
{
    QMenu *menu = new QMenu;
    QAction *action = new QAction("Connect");
    action->setData(QVariant::fromValue((void*)this));

    QObject::connect(action, &QAction::triggered, d_func()->centralWidget, &CentralWidget::connectNode);

    menu->addAction(action);
    menu->popup(event->screenPos());
}
*/
