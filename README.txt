index.html -- main html
3rdparty -- 3rd sources - OpenLayers library, Icons
build -- directory for "releases"
static -- files referenced from main html. Feel free to symlink from other
          (3rdparty) directories

To create release run tools/release.sh. This will dereference symlinks and copy
files to build directory. Contents of build directory can be published
afterwards.
