pkgname=opencvflow
pkgver=0.1
pkgrel=1
pkgdir=/opt
epoch=1
pkgdesc="Open Computer Vision Flow is an IDE for computer vision studies and testing"
arch=('x86_64')
url="http://opencvflow.org/"
license=('Apache License')
groups=()
depends=('opencv>=4.2.0')
makedepends=('git'
			 'g++')
checkdepends=()
optdepends=('qt5-charts>=5.10.0' 
			'qt5-datavis3d>=5.10.0')

prepare()

_gitroot=https://github.com/Piemontez/opencvflow
build() {
  cd "$srcdir"
  msg "Connecting to Github repo ($_gitroot)"
  if [ -d $pkgname ] ; then
    cd $pkgname
    git pull || return 1
    msg2 "The local files are updated."
  else
    msg2 "Cloning repo..."
    git clone $_gitroot $pkgname
  fi

  cd "$srcdir/pkgname"
  ./configure.sh --prefix=/opt
}

package() {
  msg2 "Installing OpenCV Flow"
  cd "$srcdir/pkgname/build"
  export prefix_path=$pkgdir
  make install DESTDIR="$pkgdir" 
}
