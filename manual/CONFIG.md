[&larr; Manual Index](index.md)

# Configuration Options

> This document provides a detailed explanation of the configuration options available within the Universal Viewer. Each option is described with its purpose, data type, and default value, helping users customise and optimise the viewer's behaviour and appearance for specific needs.
>
## Example Manifests:
> [AV manifest](https://iiif.io/api/cookbook/recipe/0026-toc-opera/manifest.json)
> 
> [Default extension](https://edsilv.github.io/test-manifests/defaultextension.json)
>
> [Simple collection](https://iiif.io/api/cookbook/recipe/0032-collection/collection.json)
>
> [Model viewer](https://biiif-template-example-3kntb3jpl-mnemoscene.vercel.app/3d/index.json)
>
> [Nested required statements](https://gist.githubusercontent.com/Saira-A/57601a87f97a31420f75c1bab14dfb8d/raw/f1db4469cd6e043b5a62542f4b07dc1a8c837dfb/mostspecificrequiredstatement.json)

### uv-iiif-config.json

The uv-iiif-config.json file is part of the examples page and is not part of the application when it is deployed in other ways. It contains global options and modules settings that override equivalent settings in individual configuration files for all formats.

### modules:

#### avCenterPanel

##### mostSpecificRequiredStatement  
**Type**: `boolean`  
**Default**: `true`  
Determines whether the most specific (deeply nested) requiredStatement is displayed, such as one defined at the canvas level instead of the higher manifest level, when multiple requiredStatements exist within the manifest. requiredStatementEnabled must also be set to true for this to show. 

#### downloadDialogue

##### selectionEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if selection of multiple images for download is enabled.  Allows for user to download a selection of images.  Selection feature is visible when in the gallery view.[^1]

#### headerPanel

##### localeToggleEnabled
**Type**: `boolean`  
**Default**: `false`  
Determines if locale toggle is enabled - a header button which switches between English and Welsh. Set in config.json files. 

#### pagingHeaderPanel

##### pagingToggleEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if paging toggle is enabled - when false, one up and two up buttons are removed.

#### openSeadragonCenterPanel

##### autoHideControls
**Type**: `boolean`  
**Default**: `false`  - `true` in config.json.
Determines if image adjustment controls fade out. Set in OSD config.json. 

##### showHomeControl
**Type**: `boolean`  
**Default**: `true` - `false` in config.json.
Determines if home control is shown in image adjustment buttons - resets zoom level. Set in OSD config.json. 

##### showAdjustImageControl
**Type**: `boolean`  
**Default**: `true`  
Determines if adjust image control is shown - contrast/brightness/saturation.

#### footerPanel

##### downloadEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if downloading is enabled.

## Options

These options exist in the individual config.json files for each of the file formats that UV supports, and can be modified in those files independently. Not every option is available for every file format. 

##### allowStealFocus
**Type**: `boolean`  
**Default**: `false`  
Determines if the page will automatically scroll to bring the viewer back into view after a refresh if it has been scrolled past.

##### authAPIVersion
**Type**: `number`  
**Default**: `1`  
Version of the authentication API.

##### bookmarkThumbHeight
**Type**: `number`  
**Default**: `150`  
Height of the bookmark thumbnail.

##### bookmarkThumbWidth
**Type**: `number`  
**Default**: `90`  
Width of the bookmark thumbnail.

##### dropEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if [drag and drop](https://iiif.io/guides/using_iiif_resources/) is enabled - the IIIF logo is located in the share/embed dialogue box. Overriden in uv-iiif-config.json file.  

##### footerPanelEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if footer panel is enabled.

##### headerPanelEnabled
**Type**: `boolean`  
**Default**: `false`  
Determines if header panel is enabled.

##### leftPanelEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if left panel is enabled.

##### limitLocales
**Type**: `boolean`  
**Default**: `true`  
Determines if locales are limited - setting to true removes option to change language in settings dialogue.

##### doubleClickAnnotationEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if double click to annotate is enabled.

##### metrics
**Type**: `number`  
**Default**: `sm: 0, md: 768, lg: 1024, xl: 1280`             
Object mapping "metric" names to display pixel widths for the purpose of responsive adaptation to screen size.

##### multiSelectionMimeType
**Type**: `string`  
**Default**: `application/zip`  
MIME type for multi selection.[^1]

##### navigatorEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if the navigator is enabled - user can override this from the settings.

##### openTemplate
**Type**: `string`  
**Default**: `http://universalviewer.io?manifest={0}`                
Sets the URL that opens when the 'open' button is clicked (which  is only visible when the viewer is embedded in an iframe and the openEnabled option is also set to true). The {0} placeholder is dynamically replaced with the manifest URL. This setting enables the user to link back to the original website when the viewer has been embedded into another page.

##### overrideFullScreen
**Type**: `boolean`  
**Default**: `false`  
Determines if full-screen behavior is overridden - setting to true disables ability to make UV full-screen.

##### pagingEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if paging is enabled - when true, defaults to 2-up view if supported by the IIIF manifest; when false, defaults to 1-up view. Overriden in uv-iiif-config.json file.

##### preserveViewport
**Type**: `boolean`  
**Default**: `false`  
Determines if viewport is preserved.

##### rightPanelEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if the right panel is enabled.

##### saveUserSettings
**Type**: `boolean`  
**Default**: `true`  
Determines if settings that have been changed from the default e.g reduce motion are saved on refresh. Also provides a "Remember my settings" checkbox within the adjust image dialogue box. 

##### clickToZoomEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if click to zoom is enabled.

##### truncateThumbnailLabels
**Type**: `boolean`  
**Default**: `true`  
Determines if setting to truncate long thumbnail labels is enabled.

##### searchWithinEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if search within is enabled.

##### termsOfUseEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if a terms of use link is included in the share and download dialogues.

##### tokenStorage
**Type**: `string`  
**Default**: `session`                     
Storage strategy to use for authentication tokens (value comes from `StorageType` enum: must be `memory` or `session` or `local`).

##### useArrowKeysToNavigate
**Type**: `boolean`  
**Default**: `false`  
Determines if arrow keys can be used to navigate across pages.

##### zoomToSearchResultEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines whether the viewer zooms into a selected search result. 

##### zoomToBoundsEnabled
**Type**: `boolean`  
**Default**: `true`  
Defines how zoom behaves when zoomToSearchResultEnabled is also set to true. When true, the viewer zooms in to the search result's bounds. When false, the viewer pans to the result without changing the current zoom level — unless the current zoom is greater than the result’s bounds, in which case it zooms out to fit the bounds.

## Modules

#### leftPanel

##### expandFullEnabled
**Type**: `boolean`  
**Default**: `false`  
Determines if expand full is enabled.

##### panelAnimationDuration
**Type**: `number`  
**Default**: `250`  
*Repeated -  edit in contentLeftPanel*.                                                       
Determines the duration of the panel expand/collapse animation.

##### panelCollapsedWidth
**Type**: `number`  
**Default**: `30` 
*Repeated -  edit in contentLeftPanel*.                                                 
Width of the collapsed panel.

##### panelExpandedWidth
**Type**: `number`  
**Default**: `255`  
*Repeated -  edit in contentLeftPanel*.                     
Width of the collapsed panel. 

##### panelOpen
**Type**: `boolean`  
**Default**: `false`  
*Repeated -  edit in contentLeftPanel*.                  
Determines if the panel is open.

##### autoExpandTreeEnabled
**Type**: `boolean`  
**Default**: `false`  
Determines if tree should expand automatically.

##### autoExpandTreeIfFewerThan
**Type**: `number`  
**Default**: `20`  
Number of items to auto expand tree.

##### branchNodesExpandOnClick
**Type**: `boolean`  
**Default**: `false`  
Determines if branch nodes expand on click.

##### branchNodesSelectable
**Type**: `boolean`  
**Default**: `false`  
Determines if branch nodes are selectable.

##### defaultToTreeEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if tree is the default view.

##### defaultToTreeIfGreaterThan
**Type**: `number`  
**Default**: `0`  
Number of items to default to tree view (when defaultToTreeEnabled = true; defaults to 0).

##### defaultToTreeIfCollection
**Type**: `boolean`  
**Default**: `true`  
Determines if collection should default to tree view (even if defaultToTreeEnabled = false).

##### expandFullEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if expand full is enabled.

##### galleryThumbChunkedResizingThreshold
**Type**: `number`  
**Default**: `400`                             
Threshold for chunked resizing of gallery thumbnails.

##### galleryThumbHeight
**Type**: `number`  
**Default**: `320`  
Height of the gallery thumbnail.

##### galleryThumbLoadPadding
**Type**: `number`  
**Default**: `3`  
Padding for loading gallery thumbnails.

##### galleryThumbWidth
**Type**: `number`  
**Default**: `200`  
Width of the gallery thumbnail.

##### oneColThumbHeight
**Type**: `number`  
**Default**: `320`  
Height of the one column thumbnail.

##### oneColThumbWidth
**Type**: `number`  
**Default**: `200`  
Width of the one column thumbnail.

##### pageModeEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if page mode is enabled.

##### panelAnimationDuration
**Type**: `number`  
**Default**: `250`              
Determines the duration of the panel expand/collapse animation.

##### panelCollapsedWidth
**Type**: `number`  
**Default**: `30`  
Width of the collapsed panel.

##### panelExpandedWidth
**Type**: `number`  
**Default**: `255`  
Width of the expanded panel.

##### panelOpen
**Type**: `boolean`  
**Default**: `true`  
Determines if the panel is open.

##### tabOrder
**Type**: `string`  
**Default**: ``  
Order of the tabs. 

##### thumbsCacheInvalidation
  **Type**: `boolean`  
  **Default**: `true`
  
  **paramType**: `?`                                                     
Configuration for thumbs cache invalidation

##### thumbsEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if thumbnails are enabled. 

##### thumbsExtraHeight
**Type**: `number`  
**Default**: `8`  
Extra height for thumbnails. 

##### thumbsImageFadeInDuration
**Type**: `number`  
**Default**: `300`  
Duration for thumbnails image fade in. 

##### thumbsLoadRange
**Type**: `number`  
**Default**: `15`  
Load range for thumbnails. 

##### topCloseButtonEnabled
**Type**: `boolean`  
**Default**: `false`  
If the top button is enabled, add an additional close button for consistency.

##### treeEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if tree is enabled. 

##### twoColThumbHeight
**Type**: `number`  
**Default**: `150`  
Height of the two column thumbnail.

##### twoColThumbWidth
**Type**: `number`  
**Default**: `90`  
Width of the two column thumbnail.

#### Dialogue

##### topCloseButtonEnabled
**Type**: `boolean`  
**Default**: `false`  
If the top button is enabled, add an additional close button for consistency.

#### downloadDialogue

##### confinedImageSize
**Type**: `number`  
**Default**: `1000`  
Controls the size of the longest edge on the size-constrained download option (e.g. scale down to at most 1000 pixels on the longest edge). If this value is larger than the longest edge of the image, the constrained size option will be hidden.

##### downloadCurrentViewEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if download of current view is enabled.

##### downloadWholeImageHighResEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if download of whole image in high resolution is enabled.

##### downloadWholeImageLowResEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if download of whole image in low resolution is enabled.

##### maxImageWidth
**Type**: `number`  
**Default**: `5000`  
Maximum width of the image.

##### selectionEnabled
**Type**: `boolean`  
**Default**: `false`  
Determines if selection of multiple images for download is enabled.  Allows for user to download a selection of images.  Selection feature is visible when in the gallery view.[^1]

#### footerPanel

##### bookmarkEnabled
**Type**: `boolean`  
**Default**: `false`  
Determines if bookmarking is enabled.

##### downloadEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if downloading is enabled.

##### embedEnabled
**Type**: `boolean`  
**Default**: `false`  
Determines if embedding is enabled.

##### feedbackEnabled
**Type**: `boolean`  
**Default**: `false`  
Determines if feedback is enabled.

##### fullscreenEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if fullscreen mode is enabled.

##### minimiseButtons
**Type**: `boolean`  
**Default**: `true`  
Determines if buttons are minimised.

##### moreInfoEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if more information is enabled.

##### openEnabled
**Type**: `boolean`  
**Default**: `true`  
Enables the 'open' button in the viewer footer. This button is only displayed when the viewer is embedded in an iframe. When clicked, it opens the URL defined in the openTemplate option.

##### printEnabled
**Type**: `boolean`  
**Default**: `false`  
Determines if printing is enabled.

##### shareEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if sharing is enabled.

#### headerPanel
For OSD, these options may need to be modified from within pagingHeaderPanel instead. 

##### centerOptionsEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if center options are enabled.

##### localeToggleEnabled
**Type**: `boolean`  
**Default**: `false`  
Determines if locale toggle is enabled - button within header to switch between English and Welsh.

##### settingsButtonEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if settings button is enabled. 

#### moreInfoRightPanel

##### canvasDisplayOrder  
**Type**: `string`  
**Default**: `""`  
Order in which canvases are displayed.

##### canvasExclude  
**Type**: `string`  
**Default**: `""`  
Canvases to exclude from display.

##### copyToClipboardEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if copying to clipboard is enabled.

##### expandFullEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if the expand full feature is enabled.

##### limitToRange  
**Type**: `boolean`  
**Default**: `false`  
Determines if download is limited to a specific range.[^1]

##### manifestDisplayOrder  
**Type**: `string`  
**Default**: `""`  
Order in which manifests are displayed.

##### manifestExclude  
**Type**: `string`  
**Default**: `""`  
Manifests to exclude from display.

##### panelAnimationDuration  
**Type**: `number`  
**Default**: `250`  
Duration of panel animations in milliseconds.

##### panelCollapsedWidth  
**Type**: `number`  
**Default**: `30`  
Width of the collapsed panel in pixels.

##### panelExpandedWidth  
**Type**: `number`  
**Default**: `255`  
Width of the expanded panel in pixels.

##### panelOpen  
**Type**: `boolean`  
**Default**: `false`  
Determines if the panel is open by default.

##### rtlLanguageCodes  
**Type**: `string`  
**Default**: `"ar, ara, dv, div, he, heb, ur, urd"`  
Language codes for right-to-left languages.

##### showAllLanguages  
**Type**: `boolean`  
**Default**: `false`  
Determines if all languages should be shown.

##### textLimit  
**Type**: `number`  
**Default**: `4`  
Limit for the amount of text displayed.

##### textLimitType  
**Type**: `string`  
**Default**: `"lines"`  
Type of the text limit (e.g., lines or characters).

##### topCloseButtonEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if the top close button is enabled.

#### MultiSelectDialogue

##### galleryThumbChunkedResizingThreshold  
**Type**: `number`  
**Default**: `400`  
Threshold for chunked resizing of gallery thumbnails.

##### galleryThumbHeight  
**Type**: `number`  
**Default**: `320`  
Height of the gallery thumbnail.

##### galleryThumbLoadPadding  
**Type**: `number`  
**Default**: `3`  
Padding for loading gallery thumbnails.

##### galleryThumbWidth  
**Type**: `number`  
**Default**: `200`  
Width of the gallery thumbnail.

##### pageModeEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if page mode is enabled.

##### topCloseButtonEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if the top close button is enabled.

#### pagingHeaderPanel

##### autoCompleteBoxEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if autocomplete box is enabled.

##### autocompleteAllowWords  
**Type**: `boolean`  
**Default**: `false`  
Determines if autocomplete for words is allowed.

##### galleryButtonEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the gallery button is enabled.

##### imageSelectionBoxEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if the drop-down list of available pages should be displayed in the paging header panel; only applies if `autoCompleteBoxEnabled` is set to `false`.

##### pageModeEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if page mode is enabled.

##### pagingToggleEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the paging toggle is enabled.

##### centerOptionsEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if center options are enabled.

##### localeToggleEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if locale toggle is enabled - button within header to switch between English and Welsh. Has to be set to true on pagingHeaderPanel to work.

##### settingsButtonEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the settings button is enabled.

##### helpEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if help button is enabled.

##### helpUrl  
**Type**: `string`  
**Default**: `https://universalviewer.io`  
Determines URL the help button opens.

##### modeOptionsEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if mode options are enabled.

#### centerPanel 

##### titleEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the title is enabled.

##### subtitleEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the subtitle is enabled.

##### mostSpecificRequiredStatement  
**Type**: `boolean`  
**Default**: `true`  
Determines whether the most specific (deeply nested) requiredStatement is displayed, such as one defined at the canvas level instead of the higher manifest level, when multiple requiredStatements exist within the manifest. requiredStatementEnabled must also be set to true for this to show. 

##### requiredStatementEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the [required statement](https://iiif.io/api/cookbook/recipe/0008-rights/) is enabled.

#### avCenterPanel

##### autoPlay  
**Type**: `boolean`  
**Default**: `false`  
Determines if auto play is enabled.

##### includeParentInTitleEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if the parent is included in the title.

##### posterImageRatio  
**Type**: `number`  
**Default**: `0.3`  
Specifies the ratio of the poster image displayed by the AV component.

##### subtitleMetadataField  
**Type**: `string`  
**Default**: `"contributor"`  
Field used for subtitle metadata.

##### titleEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the title is enabled.

##### subtitleEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if subtitles are enabled.

##### mostSpecificRequiredStatement  
**Type**: `boolean`  
**Default**: `true`  
Determines whether the most specific (deeply nested) requiredStatement is displayed, such as one defined at the canvas level instead of the higher manifest level, when multiple requiredStatements exist within the manifest. requiredStatementEnabled must also be set to true for this to show. 

##### requiredStatementEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the [required statement](https://iiif.io/api/cookbook/recipe/0008-rights/) is enabled.

##### posterImageExpanded  
**Type**: `boolean`  
**Default**: `false`  
Determines if the poster image is expanded.

##### hideMediaError  
**Type**: `boolean`  
**Default**: `false`  
Determines if media errors are hidden.

##### enableFastForward  
**Type**: `boolean`  
**Default**: `true`  
Determines if fast forward is enabled.

##### enableFastRewind  
**Type**: `boolean`  
**Default**: `true`  
Determines if fast rewind is enabled.

##### limitToRange  
**Type**: `boolean`  
**Default**: `false`  
Determines if playback is limited to a specified range.[^1]

##### autoAdvanceRanges  
**Type**: `boolean`  
**Default**: `false`  
Determines if ranges auto advance.

#### openSeadragonCenterPanel

##### animationTime  
**Type**: `number`  
**Default**: `0.15`  
Duration of the animation.

##### autoHideControls  
**Type**: `boolean`  
**Default**: `true`  
Determines if controls are hidden automatically.

##### blendTime  
**Type**: `number`  
**Default**: `0`  
Time taken to blend images.

##### constrainDuringPan  
**Type**: `boolean`  
**Default**: `false`  
Determines if panning is constrained.

##### controlsFadeAfterInactive  
**Type**: `number`  
**Default**: `1500`  
Time after which controls fade after inactivity.

##### controlsFadeDelay  
**Type**: `number`  
**Default**: `250`  
Delay before controls start to fade.

##### controlsFadeLength  
**Type**: `number`  
**Default**: `250`  
Duration of controls fade.

##### defaultZoomLevel  
**Type**: `number`  
**Default**: `0`  
Default zoom level.

##### doubleClickAnnotationEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if annotation is enabled.

##### immediateRender  
**Type**: `boolean`  
**Default**: `false`  
Determines if rendering is immediate.

##### maxZoomPixelRatio  
**Type**: `number`  
**Default**: `1.25`  
Maximum pixel ratio for zoom.

##### mostSpecificRequiredStatement  
**Type**: `boolean`  
**Default**: `true`  
Determines whether the most specific (deeply nested) requiredStatement is displayed, such as one defined at the canvas level instead of the higher manifest level, when multiple requiredStatements exist within the manifest. requiredStatementEnabled must also be set to true for this to show. 

##### navigatorPosition  
**Type**: `string`  
**Default**: `"BOTTOM_RIGHT"`  
Position of the navigator.

##### pageGap  
**Type**: `number`  
**Default**: `50`  
Gap between pages.

##### requiredStatementEnabled
**Type**: `boolean`
**Default**: `true`
Determines if the [required statement](https://iiif.io/api/cookbook/recipe/0008-rights/) is enabled.

##### showHomeControl  
**Type**: `boolean`  
**Default**: `false`  
Determines if home control is shown.

##### showAdjustImageControl  
**Type**: `boolean`  
**Default**: `true`  
Determines if adjust image control is shown.

##### subtitleEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the subtitle is enabled.

##### tileTimeout
**Type**: `number`
**Default**: `30_000`
Controls the maximum amount of time in milliseconds OpenSeadragon allows for any tile operation.

##### titleEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the title is enabled.

##### visibilityRatio  
**Type**: `number`  
**Default**: `0.5`  
Controls the percentage of the canvas OpenSeadragon will allow to be empty based on user panning. Represented as a number between 0 and 1, with 0 allowing the image to go completely out of view, and 1 forcing the whole image to stay visible. Scrolling beyond this value will cause OSD to "snap the image back."

##### zoomToInitialAnnotation  
**Type**: `boolean`  
**Default**: `true`  
Whether to zoom in to the first annotation on load.

#### pdfCenterPanel

##### titleEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if the title is enabled.

##### subtitleEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if subtitles are enabled.

##### mostSpecificRequiredStatement  
**Type**: `boolean`  
**Default**: `true`  
Determines whether the most specific (deeply nested) requiredStatement is displayed, such as one defined at the canvas level instead of the higher manifest level, when multiple requiredStatements exist within the manifest. requiredStatementEnabled must also be set to true for this to show. 

##### requiredStatementEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the [required statement](https://iiif.io/api/cookbook/recipe/0008-rights/) is enabled.

##### maxScale
**Type**: `number`  
**Default**: 5  
Maximum scale factor to apply to PDFs when using PDF.js.

##### minScale
**Type**: `number`  
**Default**: 0.7  
Minimum scale factor to apply to PDFs when using PDF.js.

##### usePdfJs  
**Type**: `boolean`  
**Default**: `true`  
Determines if PDF.js should be used for PDF rendering - uses the UV's interface instead of default PDF viewer. 

#### mediaElementCenterPanel

##### autoPlayOnSetTarget  
**Type**: `boolean`  
**Default**: `false`  
When the target setting is changed, should the media automatically begin playing? Useful for externally triggering playback of specific clips; see [PR #1113](https://github.com/UniversalViewer/universalviewer/pull/1113) for details/examples.

##### defaultHeight  
**Type**: `number`  
**Default**: `420`  
Specifies the default height for the panel or content.

##### defaultWidth  
**Type**: `number`  
**Default**: `560`  
Specifies the default width for the panel or content.

##### titleEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the title is enabled.

##### subtitleEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if subtitles are enabled.

##### mostSpecificRequiredStatement  
**Type**: `boolean`  
**Default**: `true`  
Determines whether the most specific (deeply nested) requiredStatement is displayed, such as one defined at the canvas level instead of the higher manifest level, when multiple requiredStatements exist within the manifest. requiredStatementEnabled must also be set to true for this to show. 

##### requiredStatementEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the [required statement](https://iiif.io/api/cookbook/recipe/0008-rights/) is enabled.

#### modelViewerCenterPanel

##### autoRotateEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if auto-rotation of the model is enabled - model rotates automatically when not being interacted with.

##### cameraChangeDelay  
**Type**: `number`  
**Default**: `500`  
Specifies the delay (in milliseconds) before changing the camera position.

##### doubleClickAnnotationEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if double-clicking annotations is enabled.

##### interactionPromptEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if the interaction prompt is enabled - cursor appears demonstrating how to rotate the model. 

#### alephCenterPanel

##### dracoDecoderPath  
**Type**: `string`  
**Default**: `"uv/lib/"`  
Specifies the path to the Draco decoder for 3D rendering or compression decoding.

#### searchFooterPanel

##### autocompleteAllowWords  
**Type**: `boolean`  
**Default**: `false`  
Determines if autocomplete for words is allowed.

##### elideDetailsTermsCount  
**Type**: `number`  
**Default**: `20`  
Number of terms to elide in details.

##### elideResultsTermsCount  
**Type**: `number`  
**Default**: `10`  
Number of terms to elide in results.

##### forceImageMode  
**Type**: `boolean`  
**Default**: `false`  
Displays the image index number within the search footer panel, replacing the page label from the manifest.[^2]

##### pageModeEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if page mode is enabled.

##### positionMarkerEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if position marker is enabled.

##### bookmarkEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if bookmarking is enabled.

##### downloadEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if downloading is enabled.

##### embedEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if embedding is enabled.

##### feedbackEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if feedback is enabled.

##### fullscreenEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if fullscreen mode is enabled.

##### minimiseButtons  
**Type**: `boolean`  
**Default**: `true`  
Determines if buttons are minimised.

##### moreInfoEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if more information is enabled.

##### openEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if opening is enabled.

##### printEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if printing is enabled.

##### shareEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if sharing is enabled.

#### shareDialogue

##### embedEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if embed is enabled.

##### embedTemplate  
**Type**: `string`  
**Default**: `"<iframe src=\"{0}\" width=\"{1}\" height=\"{2}\" allowfullscreen frameborder=\"0\" title=\"{3}\"></iframe>"`  
Template for embedding.

##### shareEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if sharing is enabled.

##### shareManifestsEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if sharing manifests is enabled.

##### topCloseButtonEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if the top close button is enabled.

#### mobileFooterPanel

##### bookmarkEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if bookmarking is enabled.

##### downloadEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if downloading is enabled.

##### embedEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if embedding is enabled.

##### feedbackEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if feedback is enabled.

##### fullscreenEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if fullscreen mode is enabled.

##### minimiseButtons  
**Type**: `boolean`  
**Default**: `true`  
Determines if buttons are minimised.

##### moreInfoEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if more information is enabled.

##### openEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if opening is enabled.

##### printEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if printing is enabled.

##### shareEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if sharing is enabled.

[^1]: This option is documented based on its intended functionality, but a working example or environment to confirm its behaviour is yet to be identified.
[^2]: There may be known issues with this setting; it is in the process of being reviewed and its behaviour may be revised in the future.
