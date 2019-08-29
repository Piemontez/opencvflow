#include <QApplication>
#include <QMainWindow>
#include <QFile>
#include <QTextStream>

#include <stdio.h>

#include "window.h"

QString parseCssFile(const QString &resource);

int main(int argc, char **argv)
{
  if (false)
    setvbuf(stdout, nullptr, _IONBF, 0);

  QApplication a(argc, argv);

  //Set theme/css
  a.setStyleSheet(parseCssFile(":/theme/base.css"));

  QLocale::setDefault(QLocale(QLocale::Portuguese, QLocale::Brazil));
  QApplication::setAttribute(Qt::AA_DontCreateNativeWidgetSiblings);
  QApplication::setAttribute(Qt::AA_ShareOpenGLContexts);
  
  a.setQuitOnLastWindowClosed(true);
  a.setApplicationName(APP_FULL_NAME);

  auto main = MainWindow::instance();
  main->setCentralWidget(new CentralWidget);
  main->show();

  return a.exec();
}


QString parseCssFile(const QString &resource) {
    //Adiciona o stylesheet
    QFile file(resource);
    QString css;
    if (file.open(QFile::ReadOnly)) {
        QTextStream ts(&file);
        css = ts.readAll();
        file.close();
    }
    return css;
}
