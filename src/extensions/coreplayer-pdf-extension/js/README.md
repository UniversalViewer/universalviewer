## minifying pdf.js

https://github.com/DanielRuf/pdf.daniel-ruf.de/blob/master/README.md

java -jar C:\Temp\google-closure\compiler.jar --language_in=ECMASCRIPT5 --compilation_level SIMPLE_OPTIMIZATIONS --js viewer.js --js_output_file viewer.min.js
java -jar C:\Temp\google-closure\compiler.jar --language_in=ECMASCRIPT5 --compilation_level SIMPLE_OPTIMIZATIONS --js pdf.js --js_output_file pdf.min.js
java -jar C:\Temp\google-closure\compiler.jar --language_in=ECMASCRIPT5 --compilation_level SIMPLE_OPTIMIZATIONS --js pdf.worker.js --js_output_file pdf.worker.min.js

(use full path C:\Temp\google-closure\compiler.jar)