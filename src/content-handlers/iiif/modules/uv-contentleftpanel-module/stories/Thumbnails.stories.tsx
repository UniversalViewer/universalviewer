import Thumbnails from '../ThumbsView';
import '../css/styles.less';
import { ViewingDirection } from '@iiif/vocabulary';
import React from 'react';
import '../../../../../../dist/esm/index.css';
import '../../../../../../dist/esm/IIIFContentHandler-WZPSYVHE.css';

export default { title: 'Thumbnails' };

export const ThumbnailsStory = () => {

  return (
    <div className="leftPanel">
      <div className="views">
        <div className="thumbsView">
          <Thumbnails
            onClick={() => void 0}
            paged
            selected={[]}
            viewingDirection={ViewingDirection.LEFT_TO_RIGHT}
            thumbs={[
              {
                height: 100,
                width: 73,
                index: 0,
                label: 'Test label',
                viewingHint: null,
                uri: 'https://iiif.wellcomecollection.org/thumbs/b18035723_0001.JP2/full/73,100/0/default.jpg',
                visible: true,
                data: {},
              },
              {
                height: 100,
                width: 73,
                index: 0,
                label: 'Test label',
                viewingHint: null,
                uri: 'https://iiif.wellcomecollection.org/thumbs/b18035723_0001.JP2/full/73,100/0/default.jpg',
                visible: true,
                data: {},
              },
              {
                height: 100,
                width: 73,
                index: 0,
                label: 'Test label',
                viewingHint: null,
                uri: 'https://iiif.wellcomecollection.org/thumbs/b18035723_0001.JP2/full/73,100/0/default.jpg',
                visible: true,
                data: {},
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
