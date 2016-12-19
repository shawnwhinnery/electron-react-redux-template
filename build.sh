
#create webpack bundle in the build folder (app.js)
webpack .

#copy static assets to the build folder
cp ./src/index.html ./build/index.html
cp ./src/index.js ./build/index.js
cp -r ./src/images ./build

#concat .less files and write them to the build folder
cat ./src/general.less ./src/components/**/styles/*.less ./src/views/**/styles/*.less > ./build/style.less

#compile the concatonated file
lessc ./build/style.less ./build/style.css

#transpile the
babel ./build/app.js --out-file ./build/app.js

## delete the .less file
rm -rf ./build/style.less
