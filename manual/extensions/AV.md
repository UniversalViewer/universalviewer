[&larr; Manual Index](../index.md) &nbsp;&nbsp; [&uarr; Extensions Index](index.md)

# Audio and Video Extensions

The UV plays audio and video with one of two extensions:

- **uv-av-extension**, whose center panel (`uv-avcenterpanel-module`) uses the AV component (`iiif-av-component-module`). It plays manifests with ranges, showing them as a table of contents and on a timeline, and canvases with more than one clip, played in turn or together. It can also play several canvases as one timeline.
- **uv-mediaelement-extension**, whose center panel (`uv-mediaelementcenterpanel-module`) uses the [MediaElement.js](https://www.mediaelementjs.com/) player. It plays everything else: one clip at a time.

Both use the shared captions module (`uv-captions-module`), so captions look and behave the same in either, and the same shared rules for whether media is audio or video, and which images to show with it (`uv-shared-module/MediaKind.ts`, `PosterImages.ts`).

## The path of media through the UV

1. **[Choosing the extension](#choosing-the-extension):** `IIIFContentHandler` chooses the extension from the canvas' media, before loading any.
2. **[Choosing the version to play](#choosing-the-version-to-play):** when an annotation offers the media in more than one format (a `Choice`), one is chosen for the browser.
3. **[Audio or video](#audio-or-video):** decides whether the media is played in an audio or a video element, and which images are shown while it plays.
4. **[Loading the media](#loading-the-media):** files are loaded by the browser; HLS and MPEG-DASH streams natively or with hls.js or dash.js.
5. **[Images with audio and video](#images-with-audio-and-video):** an image is shown before and while the media plays, and as its thumbnail.
6. **[Playing](#playing):** the controls, and how ranges, canvases and the title follow each other.
7. **[Captions](#captions)** are shown over the media as it plays.
8. **[Media that can't be played](#media-that-cant-be-played):** the user is told, in their language.

## Choosing the extension

`IIIFContentHandler` chooses the extension in four steps:

1. **It looks up the extension for the canvas' media**, without loading any: the first painting annotation body's `format`, else its `type`. A canvas without painting annotations (as in IIIF v2 "IxIF" manifests, whose media are offered as canvases) is looked up by its own type, else its format. If the format isn't one listed, the type is tried.
   - Audio and video formats select the AV extension. These include `audio/mp4`, `video/mp4`, `audio/mp3`, `audio/wav`, `video/webm`, Ogg, MPEG-DASH (`application/dash+xml`) and HLS (`application/vnd.apple.mpegurl`, `audio/mpegurl` and others).
   - The types `Sound`, `Audio`, `Video` and `MovingImage` (with or without a prefix such as `dctypes:`) select the MediaElement extension. (`Audio` isn't a IIIF type, but drafts of IIIF Presentation 3 used it.)
2. **The AV extension gives way to the MediaElement extension** for a manifest without ranges whose canvas has only one clip (painting annotation), as it has no table of contents to show.
3. **It loads and configures only the extension chosen**, so the host page receives one `configure` event, for that extension.
4. **The host may prefer the MediaElement extension** for manifests with ranges too, with the `preferMediaElementExtension` option (see [CONFIG.md](../CONFIG.md)). That's only known once the AV extension is configured, so then the MediaElement extension is loaded and configured as well.

Anything else, or anything not found, is shown by the default extension, as a link to the file.

`__tests__/extension_choice_tests.js` checks the extension chosen, and the extensions configured, for audio and video with and without ranges, more than one clip on a canvas, HLS, media given only by its type, a format not listed (by its type), a IIIF v2 IxIF element of a type not listed (by its format), and the host's preference.

## Choosing the version to play

When a painting annotation offers the media in more than one version (e.g. a `Choice` of formats):

- **The AV component** plays the first of (`extractMediaFromAnnotationBodies()`):
  1. HLS, where the browser can play it (natively or with hls.js);
  2. MPEG-DASH, except in Safari, which plays HLS instead;
  3. any other format (e.g. MP4), in the manifest's order;
  4. a body with no format, as a last resort.
- **The MediaElement extension** offers its player every version that's audio or video (see [Audio or video](#audio-or-video)) and has a format, in the manifest's order, and the player plays the first the browser supports.

`__tests__/media_body_choice_tests.ts` covers each step of the AV component's choice, in browsers that can and can't play HLS, and Safari.

## Audio or video

One rule decides whether media is audio or video (`mediaKind()` in `uv-shared-module/MediaKind.ts`). The MediaElement extension uses it to build an audio or a video player and to choose the versions to offer it, the AV component to create an audio or a video element, and both extensions to choose the images shown with the media. In order, it goes by:

1. **The body's `type`:** `Sound` or `Audio` is audio, and `Video` or `MovingImage` is video, with or without a prefix such as `dctypes:`. Other types (e.g. `Image`) are neither. The type comes first because audio is often stored in an MP4 file, whose format is `video/mp4`, as in [IIIF Cookbook recipe 0014](https://iiif.io/api/cookbook/recipe/0014-accompanyingcanvas/). Going by format alone would play that audio in a video player, which draws black frames over the image.
2. **Its `format`:** `audio/…` is audio and `video/…` is video, including HLS's `audio/mpegurl` and `video/x-mpegurl`. Other formats (e.g. `image/jpeg`, or a PDF) are neither, apart from those below.
3. **Its size**, when the format could be either (HLS's `application/vnd.apple.mpegurl` and the like, or MPEG-DASH's `application/dash+xml`) or there's no format. In IIIF Presentation 3, video has a `width` and `height` (on the body or its canvas) as well as a `duration`, and audio has only a `duration`. So media with a width and height, on the body or else its canvas, is video.
4. **Otherwise**, audio.

A canvas is video if any body of its painting annotations (or of a `Choice` among them) is, otherwise audio if any is (`canvasMediaKind()`, `isVideoCanvas()`). Two older kinds of manifest are read too:

- **IIIF v2 "IxIF" manifests**, such as Wellcome Collection's, give their media as elements of a media sequence rather than painting annotations, so the rule goes by the element itself (e.g. its `@type`, `dctypes:Sound` or `dctypes:MovingImage`).
- **Manifests from drafts of IIIF Presentation 3**, such as the British Library's early AV manifests, give a canvas' annotation pages as `content` rather than `items`.

Tests:

- `__tests__/media_kind_tests.ts` covers each step of the rule, and of a canvas' kind.
- `__tests__/media_type_tests.js` checks the player the MediaElement extension builds, for IIIF v3, draft IIIF Presentation 3 and IIIF v2 IxIF audio and video, and the element the AV component creates, for media given by its type or only by its size, on a canvas played on its own and on canvases played as one timeline.

## Loading the media

### Files

An audio or video file (e.g. MP4) is loaded by the browser's media element. Neither extension asks for it with CORS, so a file from another server plays whether or not that server sends CORS headers, and the browser sends that server's cookies with the request (as access control by login relies on).

The AV component loads each file's metadata as soon as it shows the canvas; the MediaElement extension loads a file when it's played.

### Streams: HLS and MPEG-DASH

- **HLS** is played natively where the browser supports it: Safari, every browser on iOS, and Chrome and Edge on Android. Elsewhere (e.g. Chrome and Edge on desktop, Firefox, and so most browsers on Linux), it's played with hls.js. A page that has loaded its own hls.js has that used, where it works, even where the browser supports HLS.
- **MPEG-DASH** is played with dash.js.

hls.js and dash.js fetch a stream's playlist and segments themselves, with script requests, which browsers allow from another server only with CORS headers. So a stream from a server without them can't be played, except natively (e.g. HLS in Safari).

### hls.js and dash.js

UV includes hls.js (pinned in `package.json`) and dash.js, and loads each only when media needs it, as a separate file from UV's own build: never from a CDN (`uv-shared-module/StreamingLibraries.ts`). A page that has loaded its own (as `window.Hls` or `window.dashjs`) has that used instead.

- The AV component plays streams with `attachHls()` and `attachDash()`.
- The MediaElement extension plays them with MediaElement's own HLS and DASH renderers, which would otherwise fetch the libraries from a CDN (`cdn.jsdelivr.net`). So `MediaElementCenterPanel` loads UV's copies before it creates the player.

`__tests__/streaming_tests.js` plays HLS and MPEG-DASH test streams in both extensions, checks nothing is fetched from a CDN, and checks other media loads neither library. `__tests__/av_playback_tests.js` checks both extensions play a file from a server without CORS headers.

## Images with audio and video

Both extensions choose the image shown with audio or video in the same way (`choosePosterImages()` in `uv-shared-module/PosterImages.ts`). An image can come from:

- a `placeholderCanvas`, shown **before** the media plays ([IIIF Cookbook recipe 0013](https://iiif.io/api/cookbook/recipe/0013-placeholderCanvas/));
- an `accompanyingCanvas`, shown **while** the media plays ([recipe 0014](https://iiif.io/api/cookbook/recipe/0014-accompanyingcanvas/));
- a `thumbnail`, when there's neither.

Either canvas may be set on the canvas or on the manifest; the canvas' own comes first. The image is the body of the canvas' first painting annotation.

A manifest's `posterCanvas`, the name for `placeholderCanvas` in drafts of IIIF Presentation 3, is read as its `placeholderCanvas` (which comes first if it has both). It's still found on manifests such as the British Library's early AV manifests.

### Before the media plays

The first of:

1. the canvas' `placeholderCanvas`;
2. the canvas' `accompanyingCanvas`;
3. the manifest's `placeholderCanvas` (or `posterCanvas`);
4. the manifest's `accompanyingCanvas`;
5. the `thumbnail` of the canvas' painting annotation;
6. the canvas' `thumbnail`.

### While audio plays

Audio has no picture of its own, so an image stays. The first of:

1. the canvas' `accompanyingCanvas`;
2. the canvas' `placeholderCanvas`;
3. the manifest's `accompanyingCanvas`;
4. the manifest's `placeholderCanvas` (or `posterCanvas`);
5. the `thumbnail` of the canvas' painting annotation;
6. the canvas' `thumbnail`.

### While video plays

The video takes the place of a placeholder or thumbnail, so only an accompanying image is shown: the canvas' `accompanyingCanvas`, else the manifest's.

### Thumbnails in IIIF

No cookbook recipe shows a `thumbnail` with audio or video, but IIIF allows one on any resource, and some manifests have them:

- A `thumbnail` may be a URL, as in IIIF v2, or a list of images, as in IIIF v3; the first is used.
- In a IIIF v2 manifest, whose audio and video aren't in painting annotations, the canvas' `thumbnail` is used.

### How each extension shows the image

- **MediaElement extension:** the image fills the player. For audio, `MediaElementCenterPanel` changes it to the image for while it plays, as MediaElement would hide it. For video, it gives way to the video.
- **AV extension:** the image starts in the corner of the player, sized by the `posterImageRatio` option, or fills the player when the `posterImageExpanded` option is set. Its button expands and collapses it. It changes to the image for while the media plays when playback starts, and is chosen again for each canvas.

### The thumbnails of canvases

The left panel's thumbnail for a canvas of audio or video shows its image from before playback (as above). Without one, it shows an icon for audio or video (`mediaThumbnail()`, `applyMediaThumbnails()`, used by both extensions' thumbnail views). Thumbnails of other canvases (e.g. images) are as manifesto gives them: it builds them from a canvas' image service, which audio and video don't have.

### Tests

- `__tests__/poster_images_tests.ts` covers each of the rules above, and the thumbnails of canvases.
- `__tests__/poster_selection_tests.js` checks the image shown before and while media plays in both extensions, for a placeholder with video (as in recipe 0013), placeholder and accompanying images with audio, a IIIF v3 canvas `thumbnail`, and a manifest's `posterCanvas`.
- `__tests__/accompanying_image_tests.js` (recipe 0014) checks both extensions keep showing the accompanying image while audio plays, and `__tests__/poster_image_tests.js` (`posterImageExpanded`) covers the AV component's collapsible poster image, which the MediaElement extension doesn't have.
- `__tests__/media_thumbnails_tests.js` checks the thumbnails of canvases in both extensions: a canvas' image, an icon for one without, and no image that can't load.

## Playing

### Controls

The AV component's controls wrap onto more rows as the player narrows, so every control stays available on any screen size. Its buttons are at least 44 by 44 pixels, so they're easy to touch.

Every control has a label, and a tooltip with the same text, in the user's language.

The timeline and volume are sliders that screen readers announce by name ("Playback position", "Volume") with their values, e.g. "01:05 of 09:32" (`positionOfDuration`). On the timeline:

| Key | Moves |
| --- | --- |
| Left or Down arrow | 5 seconds back |
| Right or Up arrow | 5 seconds forward |
| Page Down | 60 seconds back |
| Page Up | 60 seconds forward |
| Home | to the start |
| End | to the end |

The AV component always fills the center panel's content area. When the title above it changes, e.g. to the label of a range once it plays, `AVCenterPanel.resize()` resizes the component too, so the controls stay in view.

### MediaElement controls

The MediaElement extension's controls are mediaelement's own (play, current time, timeline, mute, volume, captions and, for video, full screen), held to the same standard as the AV component's (`MediaElementCenterPanel`):

- **Size:** every button is at least 44 by 44 pixels, as WCAG 2.1 success criterion 2.5.5 Target Size (Enhanced, AAA) asks, and the controls fit any screen size.
- **Names:** every button has a label, and a tooltip with the same text, in the user's language, from the center panel's `content` (`play`, `pause`, `mute`, `unmute`, `fullScreen`) rather than mediaelement's own English.
- **Sliders:** the timeline and volume are sliders that screen readers announce by name (`playbackPosition`, `audioVolume`) with their values, e.g. "01:05 of 09:32" (`positionOfDuration`) and "80%". The timeline keeps its name and value while the media plays (mediaelement would remove them); its value is only rewritten when it changes, at most once a second.
- **Volume:** the volume slider is always in the controls (not only over the mute button), and playback starts at full volume.
- **Metadata:** the media's metadata (e.g. its duration) is loaded with the page, so the timeline can be used before the media plays.

On the timeline:

| Key | Moves |
| --- | --- |
| Left arrow | 5 seconds back |
| Right arrow | 5 seconds forward |
| Home | to the start |
| End | to the end |

On the volume slider:

| Key | Changes the volume |
| --- | --- |
| Down or Left arrow | 10% down |
| Up or Right arrow | 10% up |
| Home | to silent |
| End | to full |

On touch devices, the volume controls are shown unless the center panel's `hideVolumeOnTouchDevices` option is set (see `mediaElementCenterPanel` in [CONFIG.md](../CONFIG.md)). iOS and iPadOS don't let pages set the volume, only the device's buttons can, so there only the mute button is shown.

### Canvases, ranges and the title

In the AV extension:

- **The index view** plays the ranges on a timeline. For a manifest whose canvases are played one after another (`"behavior": "auto-advance"`), that timeline covers all of them. With the `limitToRange` option, it covers only the range chosen.
- **The thumbnails view** plays each canvas on its own.
- **The title** is the label of the range playing, else the canvas'. Choosing another canvas (e.g. its thumbnail) makes the range playing the canvas' (unless it's already one the canvas is in), so the title, the index and the current range follow the canvas.
- **Clips on one canvas** (more than one painting annotation, each targeting part of its time) are played in turn, or together where their times overlap.

The MediaElement extension titles the player with the manifest's label.

Tests:

- `__tests__/av_limit_to_range_tests.js` checks the timeline with and without `limitToRange`.
- `__tests__/media_thumbnails_tests.js` checks that choosing a thumbnail plays that canvas and titles the player for it.
- `__tests__/av_playback_tests.js` checks two clips on one canvas are played in turn.

## Captions

The captions module (`uv-captions-module`) finds a canvas' caption files, reads them, and shows them over the media. It also adds a captions button to the player's controls, which opens a menu for choosing the language and the colours.

### Where captions are found

`Captions.getCanvasCaptions()` finds WebVTT (`text/vtt`) and SRT (`text/srt`) files declared:

- as a `rendering` of the canvas (as in recipe 0017);
- as a body of the canvas' painting annotation, alongside the media (supported for existing manifests, though no recipe does this);
- as a `supplementing` annotation (recipe 0219), whose body may be a `Choice` of files, e.g. one per language (recipe 0074). Annotation pages given by `id` alone are fetched.

A caption annotation may target part of the canvas, e.g. `#t=60,120`. Its file's 0:00 then falls at that point on the canvas.

Caption files are fetched by the browser, so they must be served with CORS headers. CORS-friendly redirects are followed, and `http` URLs are retried over `https`.

### The captions menu

The menu has two groups:

- **Languages:** "Off" first, then the tracks in the user's language (an exact match for their locale, then the same base language, e.g. `cy` for `cy-GB`), then the rest alphabetically by label. Labels are shown in the user's language where the manifest gives one.
- **Colours:** the colour combinations offered (see [Caption colours](#caption-colours)), the first of them until the user chooses another.

Captions are off until the user chooses a language.

### Caption colours

Unless configured otherwise, the menu offers UV's own five colour combinations, each with at least WCAG AAA (7:1) contrast, and named in the user's language (by the center panel's `content`):

- white on black;
- black on white;
- dark blue on peach;
- dark red on mint;
- dark purple on yellow.

A host can offer its own instead, with the center panel's `captionStyles` option: see `avCenterPanel` and `mediaElementCenterPanel` in [CONFIG.md](../CONFIG.md#avcenterpanel-1). Each one gives its name in the menu (`label`), and its text and background colours (`color`, `background`) as CSS colours:

```json
{
  "modules": {
    "mediaElementCenterPanel": {
      "options": {
        "captionStyles": [
          { "label": "Indigo on sand", "color": "#36096e", "background": "#faefcd" },
          { "label": "Smoke on soot", "color": "#f2f2f0", "background": "#24241e" }
        ]
      }
    }
  }
}
```

Set it for both players, `avCenterPanel` and `mediaElementCenterPanel`, for the same colours in either.

- They replace UV's own, rather than adding to them, so list every combination to offer. (UV's own aren't in the extensions' config files: the host's config is merged into those item by item, which would leave some of UV's own in a shorter list.)
- They're offered in the order given, and the first is used until the user chooses another.
- Names are shown as given, in every language. To name a colour in the user's language, give its `label` as a `$key` from UV's locale files (`src/locales`), e.g. `"label": "$captionWhiteOnBlack"`, and add the key to each locale file for your own names. The key is read from the user's locale, as UV's own content is; a key a locale file doesn't have is shown as written.
- An entry without a `label`, `color` or `background` is left out, with a warning in the browser console. If none can be used, UV's own are offered.
- Choose colours with enough contrast: WCAG asks for at least 4.5:1 (AA), and 7:1 (AAA) for the most legible captions. UV doesn't check.

#### Trying your own colours on the examples page

`captionStyles` isn't in the extensions' config files, so the examples page's configuration builder doesn't list it. To try your colours:

1. Load a manifest with audio or video. A manifest with ranges plays in the AV component, and one without plays in the MediaElement player.
2. Open the **Configuration** tab and paste JSON like this into the **Custom configuration** box:

   ```json
   {
     "modules": {
       "avCenterPanel": {
         "options": {
           "captionStyles": [
             { "label": "Indigo on sand", "color": "#36096e", "background": "#faefcd" },
             { "label": "Smoke on soot", "color": "#f2f2f0", "background": "#24241e" }
           ]
         }
       },
       "mediaElementCenterPanel": {
         "options": {
           "captionStyles": [
             { "label": "Indigo on sand", "color": "#36096e", "background": "#faefcd" },
             { "label": "Smoke on soot", "color": "#f2f2f0", "background": "#24241e" }
           ]
         }
       }
     }
   }
   ```

3. Press **Apply Configurations**. The viewer restarts with your colours in the captions menu's **Colours** group.

If a combination you chose before isn't in your list, the player starts with your first one (see [Remembered choices](#remembered-choices)). To also forget your chosen caption language, tick **Clear saved viewer state before applying**. If your JSON has a mistake, for example a missing comma, or an entry is missing its `label`, `color` or `background`, check the browser console.

### Remembered choices

The chosen language and colours are saved in `localStorage` under `uv-caption-preferences`, and used on the user's next visit. Colours are remembered by their text and background colours, not their name, so they carry over to a player that names them differently; one that doesn't offer them uses its first. The chosen language carries over to other canvases, ranges and manifests: the same track if it's there, otherwise one in the same language. A canvas without that language shows no captions, but the choice is kept for those that have it.

If the browser doesn't allow `localStorage`, or what's saved can't be read, captions start off, in the first colours offered.

## Media that can't be played

When media can't be played, both extensions show the `mediaUnavailable` message in the generic dialogue, in the user's language, and leave no unhandled error behind. That's whether:

- a file can't be loaded (e.g. it's missing, or in a format the browser can't play), as the media element reports;
- a stream can't be loaded (e.g. its server doesn't send CORS headers), as hls.js or dash.js report: their fatal errors are reported as the media element's (`attachHls()`, `attachDash()`, and MediaElement's own renderers).

The extensions find this out when they load the media (see [Loading the media](#loading-the-media)):

- The MediaElement extension: when the user presses play, for most media; as soon as the player is built, for an HLS stream.
- The AV extension: as it shows the canvas, as it loads each file's metadata straight away.

A canvas with no media at all shows the AV extension's `noMediaMessage`.

Set the center panel's `hideMediaError` option to `true` to show no message: see [CONFIG.md](../CONFIG.md#avcenterpanel-1).

`__tests__/media_error_tests.js` checks, in both extensions, for a missing file and HLS and MPEG-DASH streams that can't be loaded: the message, in English and Welsh, that no uncaught error is thrown, and that `hideMediaError` hides the message.

## Text

The AV component, the MediaElement extension's controls and the captions module have no built-in text. Every label, tooltip and message comes from the center panel's `content` in the extension's config, which refers to the locales. See [Localisation](../ARCHITECTURE.md#localisation). The exception is the names of caption colours a host configures, which are shown as given unless given as a `$key` from the locale files (see [Caption colours](#caption-colours)).

## Known limitations

- **Streams from servers without CORS headers** can't be played with hls.js or dash.js (see [Loading the media](#loading-the-media)), e.g. the British Library's early AV examples' HLS and MPEG-DASH streams.
- **Timed compositions**, which place images, text and video at times and positions on one canvas (e.g. the iiif-av-component's "Fire" example), aren't shown: neither extension plays anything but audio and video.
- **Access control:** the IIIF Cookbook has no recipe for authentication yet (only proposals, [IIIF/cookbook-recipes#85 to #90](https://github.com/IIIF/cookbook-recipes/issues?q=is%3Aissue+auth+interaction+pattern)), and the tests don't cover media behind a login.
