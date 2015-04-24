call git checkout nlw
call git submodule update --init
cd tests
call git checkout master
call git pull origin master
cd ../examples
call git checkout nlw
call git pull origin nlw
cd ../src/themes/nlw-theme
call git checkout master
call git pull origin master