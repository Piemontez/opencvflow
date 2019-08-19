#ifndef WINDOW_H
#define WINDOW_H

#include <QGraphicsView>
#include <QScopedPointer>

class QWidget;

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

    void connectNode();

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
