#include <QApplication>
#include <QMainWindow>
#include <QWidget>

#include <stdio.h>

int main(int argc, char **argv)
{
  if (false)
    setvbuf(stdout, nullptr, _IONBF, 0);

  QLocale::setDefault(QLocale(QLocale::Portuguese, QLocale::Brazil));
  QApplication::setAttribute(Qt::AA_DontCreateNativeWidgetSiblings);
  QApplication::setAttribute(Qt::AA_ShareOpenGLContexts);
  QApplication a(argc, argv);
  
  a.setQuitOnLastWindowClosed(true);
  a.setApplicationName(APP_FULL_NAME);


  QMainWindow mainWindow;
  mainWindow.setCentralWidget(new QWidget);
  mainWindow.show();

  return a.exec();
}