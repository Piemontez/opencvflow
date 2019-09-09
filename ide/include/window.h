#ifndef WINDOW_H
#define WINDOW_H

#include <QMainWindow>
#include <QGraphicsView>
#include <QScopedPointer>

#include "globals.h"

class QWidget;
class QToolBar;

namespace ocvflow {

class CentralWidget;
class NodeItem;
class Component;

/**
 * @brief The MyWindow class
 */
class MainWindowPrivate;
class MainWindow: public QMainWindow
{
    //Q_OBJECT

    static MainWindow *inst;
    QScopedPointer<MainWindowPrivate> d_ptr;
    Q_DECLARE_PRIVATE(MainWindow)
public:

   explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

    static MainWindow *instance();
    CentralWidget *centralWidget() const;

    QToolBar* toolbar(const ToolBarNames &name);
    Component* component(const std::string &name);

    void addNode(NodeItem* node);
    void connectNode(NodeItem* source, NodeItem* dest);
    void nodeClicked(NodeItem* node);

private:
    void makeToolbar();
    void showToolBar();
    void makeActions();
    void makeDocks();

    void loadPlugins();

    void run();
    void stopRun();
};

/**
 * @brief The CentralWidget;
 */
class CentralWidgetPrivate;
class CentralWidget : public QGraphicsView
{
    //Q_OBJECT

    QScopedPointer<CentralWidgetPrivate> d_ptr;
    Q_DECLARE_PRIVATE(CentralWidget)
public:
    CentralWidget(QWidget *parent = 0);

public slots:
    void zoomIn();
    void zoomOut();

protected:
    void keyPressEvent(QKeyEvent *event) override;

#if QT_CONFIG(wheelevent)
    void wheelEvent(QWheelEvent *event) override;
#endif
    void drawBackground(QPainter *painter, const QRectF &rect) override;

    void scaleView(qreal scaleFactor);

    void dragLeaveEvent(QDragLeaveEvent *event) override;
    void dragMoveEvent(QDragMoveEvent *event) override;
    void dragEnterEvent(QDragEnterEvent *event) override;
    void dropEvent(QDropEvent *event) override;

    void mousePressEvent(QMouseEvent *event) override;
    void mouseMoveEvent(QMouseEvent *event) override;
    void mouseReleaseEvent(QMouseEvent *event) override;
};

}

#endif // WINDOW_H
