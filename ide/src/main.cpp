#include <QApplication>
#include <QMainWindow>

#include <stdio.h>

#include "window.h"

int main(int argc, char **argv)
{
  if (false)
    setvbuf(stdout, nullptr, _IONBF, 0);

  QApplication a(argc, argv);

  QLocale::setDefault(QLocale(QLocale::Portuguese, QLocale::Brazil));
  QApplication::setAttribute(Qt::AA_DontCreateNativeWidgetSiblings);
  QApplication::setAttribute(Qt::AA_ShareOpenGLContexts);
  
  a.setQuitOnLastWindowClosed(true);
  a.setApplicationName(APP_FULL_NAME);

  QMainWindow mainWindow;
  mainWindow.setCentralWidget(new CentralWidget);
  mainWindow.show();

  return a.exec();
}
