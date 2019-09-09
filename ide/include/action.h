#ifndef ACTION_H
#define ACTION_H

#include <QLabel>

class QDragEnterEvent;
class QDragMoveEvent;
class QDropEvent;
class QMouseEvent;

namespace ocvflow {

class FlowAction : public QLabel
{
public:
    explicit FlowAction(const std::string &nodeName,
                        const QString &title,
                        QWidget* parent = nullptr,
                        Qt::WindowFlags f = Qt::WindowFlags());
    virtual std::string nodeName();
protected:
    const QRect targetSquare(const QPoint &position) const;
    void dragEnterEvent(QDragEnterEvent *event) override;

    //void dragLeaveEvent(QDragLeaveEvent *event) override;

    void dragMoveEvent(QDragMoveEvent *event) override;
    void dropEvent(QDropEvent *event) override;
    void mousePressEvent(QMouseEvent *event) override;

};

}

#endif // ACTION_H
