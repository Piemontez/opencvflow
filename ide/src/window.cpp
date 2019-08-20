#include "window.h"

#include <QMenuBar>
#include <QToolBar>

class MainWindowPrivate {
    QMap<MainWindow::ToolBarNames, QToolBar*> toolbars;

    friend class MainWindow;
};

MainWindow::MainWindow(QWidget *parent) :
        d_ptr(new MainWindowPrivate)
{
    setMenuBar(new QMenuBar);


    d_func()->toolbars.insert(FilesTB, new QToolBar);
    d_func()->toolbars.insert(SourcesTB, new QToolBar);
    d_func()->toolbars.insert(ProcessorsTB, new QToolBar);
    d_func()->toolbars.insert(ConnectorsTB, new QToolBar);

    for (auto && tb: d_func()->toolbars.values())
    {
        tb->hide();
        tb->setMinimumHeight(48);
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

void MainWindow::showToolBar()
{
    for (auto && tb: d_func()->toolbars.values())
        tb->hide();

    QVariant data = qobject_cast< QAction* >(sender())->data();
    if (data.isValid())
        d_func()->toolbars.value( static_cast<MainWindow::ToolBarNames>(data.toUInt()) )->show();
}
