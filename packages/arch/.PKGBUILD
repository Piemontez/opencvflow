pkgname=opencvflow
pkgver=0.1
pkgrel=1
epoch=1
pkgdesc="Open Computer Vision Flow is an IDE for computer vision studies and testing"
arch=('x86_64')
url="http://opencvflow.org/"
license=('GPL')
groups=()
depends=('opencv>=4.2.0')
makedepends=()
checkdepends=()
optdepends=('qt5-charts>=5.10.0' 
			'qt5-datavis3d>=5.10.0')
provides=()
conflicts=()
replaces=()
backup=()
options=()
install=
changelog=
source=("$pkgname-$pkgver.tar.gz"
        "$pkgname-$pkgver.patch")
noextract=()
md5sums=()
validpgpkeys=()

prepare() {
	cd "$pkgname-$pkgver"
	patch -p1 -i "$srcdir/$pkgname-$pkgver.patch"
}

build() {
	cd "$pkgname-$pkgver"
	./configure --prefix=/usr
	make
}

check() {
	cd "$pkgname-$pkgver"
	make -k check
}

package() {
	cd "$pkgname-$pkgver"
	make DESTDIR="$pkgdir/" install
}
