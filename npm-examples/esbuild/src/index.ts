import { init } from 'universalviewer';
import 'universalviewer/dist/esm/index.css';
import './main.css';

const container = document.getElementById('root') as HTMLDivElement;
if (container) {
    init(container, {
        manifest: 'https://wellcomelibrary.org/iiif/b18035723/manifest',
    })
}