#include "window.h"
#include "items.h"
#include "component.h"

#include <QMenuBar>
#include <QToolBar>
#include <QThread>

class MainWindowPrivate {
    QMap<MainWindow::ToolBarNames, QToolBar*> toolbars;
    QMap<QString, Component *> components;

    bool runing{false};
    friend class MainWindow;
};

MainWindow::MainWindow(QWidget *parent) :
        d_ptr(new MainWindowPrivate)
{
    makeToolbar();
    makeActions();
    loadPlugins();
}

MainWindow::~MainWindow()
{

}

MainWindow *MainWindow::inst = nullptr;
MainWindow *MainWindow::instance()
{
    if (!inst) inst = new MainWindow();
    return inst;
}

CentralWidget *MainWindow::centralWidget() const
{
    return static_cast<CentralWidget *>(QMainWindow::centralWidget());
}

QToolBar *MainWindow::toolbar(const MainWindow::ToolBarNames &name)
{
    return d_func()->toolbars[name];
}

Component *MainWindow::component(const std::string &name)
{
    if (d_func()->components.contains(QString::fromStdString(name)))
        return d_func()->components[QString::fromStdString(name)];
    return nullptr;
}

void MainWindow::addNode(NodeItem *node)
{
    centralWidget()->scene()->addItem(node);
}

void MainWindow::connectNode(NodeItem *source, NodeItem *dest)
{
    centralWidget()->scene()->addItem(new EdgeItem(source, dest));
}

void MainWindow::makeToolbar()
{
    setMenuBar(new QMenuBar);

    d_func()->toolbars.insert(FilesTB, new QToolBar);
    d_func()->toolbars.insert(SourcesTB, new QToolBar);
    d_func()->toolbars.insert(ProcessorsTB, new QToolBar);
    d_func()->toolbars.insert(ConnectorsTB, new QToolBar);
    d_func()->toolbars.insert(BuildTB, new QToolBar);

    for (auto && tb: d_func()->toolbars.values())
    {
        tb->hide();
        tb->setMovable(false);

        this->addToolBar(tb);
    }

    auto act = new QAction("Files");
    act->setData(FilesTB);
    connect(act, &QAction::hovered, this, &MainWindow::showToolBar);
    menuBar()->addAction(act);

    act = new QAction("Sources");
    act->setData(SourcesTB);
    connect(act, &QAction::hovered, this, &MainWindow::showToolBar);
    menuBar()->addAction(act);
    act->hover();

    act = new QAction("Processors");
    act->setData(ProcessorsTB);
    connect(act, &QAction::hovered, this, &MainWindow::showToolBar);
    menuBar()->addAction(act);

    act = new QAction("Connectors");
    act->setData(ConnectorsTB);
    connect(act, &QAction::hovered, this, &MainWindow::showToolBar);
    menuBar()->addAction(act);

    act = new QAction("Build");
    act->setData(BuildTB);
    connect(act, &QAction::hovered, this, &MainWindow::showToolBar);
    menuBar()->addAction(act);
}

void MainWindow::makeActions()
{
    auto tb = toolbar(BuildTB);

    auto act = new QAction("Run");
    connect(act, &QAction::triggered, this, &MainWindow::run);
    tb->addAction(act);

    act = new QAction("Stop");
    connect(act, &QAction::triggered, this, &MainWindow::stopRun);
    tb->addAction(act);
}


void MainWindow::showToolBar()
{
    sender()->setProperty("css", true);

    for (auto && tb: d_func()->toolbars.values())
        tb->hide();

    QVariant data = qobject_cast< QAction* >(sender())->data();
    if (data.isValid())
        d_func()->toolbars.value( static_cast<MainWindow::ToolBarNames>(data.toUInt()) )->show();
}

void MainWindow::loadPlugins()
{
    auto comps = (new PluginInterface)->components();
    for (auto && comp: comps)
    {
        d_func()->components.insert(QString::fromStdString(comp->name()), comp);

        auto tb = toolbar( static_cast<ToolBarNames>(comp->actionToolBar()) );
        if (tb) {
            auto action = comp->createAction();
            if (action)
                tb->addAction(action);

            auto widget = comp->createWidget();
            if (widget)
                tb->addWidget(widget);
            if (!action && !widget) {
                tb->addAction(new QAction(QString::fromStdString(comp->name())));
            }
        }
    }
}

void MainWindow::run()
{
    if (d_func()->runing) return;
    d_func()->runing = true;

    QThread *th = QThread::create([this] {
        std::clock_t last = std::clock();

        QList<NodeItem *> items;
        for (auto && item: this->centralWidget()->items()) {
            if (NodeItem::Type != item->type())
                continue;

            items.append(static_cast<NodeItem*>(item));
        }
        forever {
            //Executa todos os processos
            for (auto item: items)
            {
                //Todo: add semapharo
                item->proccess();
            }
            //Atualiza a tela
            if (float( std::clock () - last ) > 100) {
                last = std::clock();

                for (auto && item: items)
                    item->update();

                QThread::msleep(10 + (items.size() * 2));
            }
            if (!d_func()->runing)
                break;
        }
    });

    th->setPriority(QThread::LowestPriority);
    th->start();
}

void MainWindow::stopRun()
{
    d_func()->runing = false;
}
