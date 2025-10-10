import { IIIFPlayer, MediaPlayer, StructuredNavigation, Transcript } from "@samvera/ramp";
import { Manifest } from "manifesto.js";

const AVView = ({
  manifest
}: {
  manifest: Manifest;
}) => {

  // Get your manifest from somewhere
  const manifestUrl = manifest.id;

  // Transcript props
  const props = {
    playerID: 'player-id',
    transcripts: [
      {
        canvasId: 0,
        items: [{ title: "Title", url: "https://some-transcript-url-here.json" }]
      }
    ]
  }

  return (
    <IIIFPlayer manifestUrl={manifestUrl}>
      <MediaPlayer enableFileDownload={false} />
      <StructuredNavigation />
      <Transcript {...props} />
    </IIIFPlayer>
  );
};

export default AVView;

