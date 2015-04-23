call git checkout nlw 
call git submodule update --init
cd tests
call git pull origin master
call git checkout master
cd ../examples
call git pull origin nlw
call git checkout nlw
cd ../src/themes/nlw-theme
call git pull origin master
call git checkout master