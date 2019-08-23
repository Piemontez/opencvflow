#ifndef WINDOW_H
#define WINDOW_H

#include <QMainWindow>
#include <QGraphicsView>
#include <QScopedPointer>

class QWidget;
class CentralWidget;
class NodeItem;
class QToolBar;
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
    enum ToolBarNames {
        FilesTB,
        SourcesTB,
        ProcessorsTB,
        ConnectorsTB
    };

   explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

    static MainWindow *instance();
    CentralWidget *centralWidget() const;

    QToolBar* toolbar(const ToolBarNames &name);
private:
    void showToolBar();
    void loadPlugins();
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

    void addNode(NodeItem* node);
    void connectNode(NodeItem* source, NodeItem* dest);

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
};

#endif // WINDOW_H
