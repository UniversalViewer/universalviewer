# Configuration Options

> This document provides a detailed explanation of the configuration options available within the Universal Viewer. Each option is described with its purpose, data type, and default value, helping users customise and optimise the viewer's behaviour and appearance for specific needs.
>
## Example Manifests:
> AV manifest: https://iiif.io/api/cookbook/recipe/0026-toc-opera/manifest.json
> 
> Default extension: https://edsilv.github.io/test-manifests/defaultextension.json
>
> Simple collection: https://iiif.io/api/cookbook/recipe/0032-collection/collection.json
>
> Model viewer: https://biiif-template-example-3kntb3jpl-mnemoscene.vercel.app/3d/index.json

## uv-iiif-config.json

The uv-iiif-config.json file contains global options and modules settings that override the same settings in individual configuration files for all formats.

### options:

##### dropEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if [drag and drop](https://iiif.io/guides/using_iiif_resources/) is enabled - the IIIF logo is located in the share dialogue box.

##### footerPanelEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if the footer panel is enabled.

##### headerPanelEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if the header panel is enabled.

##### leftPanelEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if the left panel is enabled.

##### limitLocales
**Type**: `boolean`  
**Default**: `false`  
Determines if locales are limited - setting to true removes option to change language in settings dialogue.

##### overrideFullScreen
**Type**: `boolean`  
**Default**: `false`  
Determines if full-screen behavior is overridden - setting to true disables ability to make UV full-screen. 

##### pagingEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if paging is enabled - use "pagingToggleEnabled" instead.

##### rightPanelEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if the right panel is enabled.

##### clickToZoomEnabled
**Type**: `boolean`  
**Default**: `false`  
Determines if click to zoom is enabled.

##### saveUserSettings
**Type**: `boolean`  
**Default**: `true`  
Determines if settings that have been changed from the default e.g reduce motion are saved on refresh.

### modules:

#### avCenterPanel

##### mostSpecificRequiredStatement
**Type**: `boolean`  
**Default**: `true`  

#### downloadDialogue

##### selectionEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if selection is enabled. 

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
Determines if locales are limited.

##### doubleClickAnnotationEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if double click to annotate is enabled.

##### metrics
**Type**: `number`  
**Default**: `sm: 0, md: 768, lg: 1024, xl: 1280`             
Metrics array. 


##### multiSelectionMimeType
**Type**: `string`  
**Default**: `application/zip`  
MIME type for multi selection.

##### navigatorEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if the navigator is enabled - user can override this from the settings.

##### openTemplate
**Type**: `string`  
**Default**: `http://universalviewer.io?manifest={0}`                
Template for opening.

##### overrideFullScreen
**Type**: `boolean`  
**Default**: `false`  
Determines if full screen is overridden.

##### pagingEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if paging is enabled.

##### pagingOptionEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if paging option is enabled.

##### pessimisticAccessControl
**Type**: `boolean`  
**Default**: `false`  
Determines if access control is pessimistic.

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
Determines if user settings are saved.

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

##### seeAlsoEnabled
**Type**: `boolean`  
**Default**: `false`  
Determines if seealso content is enabled.

##### termsOfUseEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if terms of use are enabled.

##### theme
**Type**: `string`  
**Default**: `uv-en-GB-theme`          
Theme string.

##### tokenStorage
**Type**: `string`  
**Default**: `session`                     
Storage for tokens.

##### useArrowKeysToNavigate
**Type**: `boolean`  
**Default**: `false`  
Determines if arrow keys can be used to navigate across pages.

##### zoomToSearchResultEnabled
**Type**: `boolean`  
**Default**: `true`  
 Determines if zoom to search result is enabled.

##### zoomToBoundsEnabled
**Type**: `boolean`  
**Default**: `true`  
 Determines if zoom to bounds is enabled.


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

##### elideCount
**Type**: `number`  
**Default**: `40`  
Number of characters to elide at.

##### expandFullEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if expand full is enabled.

##### galleryThumbChunkedResizingEnabled
**Type**: `boolean`  
**Default**: `true`                         
**Compatible file types**: Openseadragon only.                    
Determines if chunked resizing is enabled for gallery thumbnails.

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
Size of the confined image.

##### currentViewDisabledPercentage
**Type**: `number`  
**Default**: `90`  
Percentage of the current view that is disabled.

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

##### optionsExplanatoryTextEnabled
**Type**: `boolean`  
**Default**: `false`  
Determines if explanatory text for options is enabled.

##### selectionEnabled
**Type**: `boolean`  
**Default**: `false`  
Determines if selection is enabled.

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
Determines if opening is enabled.

##### printEnabled
**Type**: `boolean`  
**Default**: `false`  
Determines if printing is enabled.

##### shareEnabled
**Type**: `boolean`  
**Default**: `true`  
Determines if sharing is enabled.

#### headerPanel
Modify these options from within pagingHeaderPanel instead. 

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
Determines if download is limited to a specific range.

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

##### galleryThumbChunkedResizingEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if chunked resizing is enabled for gallery thumbnails.

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
Determines if the image selection box is enabled.

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
Determines if the most specific required statement is displayed.

##### requiredStatementEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the required statement is enabled.

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
Specifies the ratio of the poster image.

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
Determines if the most specific required statement is used.

##### requiredStatementEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the required statement is enabled.

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
Determines if playback is limited to a specified range.

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
Determines if the most specific required statement is displayed.

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
Determines if the required statement is enabled.

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

##### titleEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the title is enabled.

##### trimAttributionCount  
**Type**: `number`  
**Default**: `150`  
Number of attributions to trim.

##### visibilityRatio  
**Type**: `number`  
**Default**: `0.5`  
Ratio of visibility.

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
Determines if the most specific required statement is used.

##### requiredStatementEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the required statement is enabled.

##### usePdfJs  
**Type**: `boolean`  
**Default**: `true`  
Determines if PDF.js should be used for PDF rendering - uses the UV's interface instead of default PDF viewer. 

#### mediaElementCenterPanel

##### autoPlayOnSetTarget  
**Type**: `boolean`  
**Default**: `false`  
Determines if autoplay is triggered when the target is set.

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
Determines if the most specific required statement is used.

##### requiredStatementEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if the required statement is enabled.

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
Determines if image mode is forced.

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

##### instructionsEnabled  
**Type**: `boolean`  
**Default**: `false`  
Determines if instructions are enabled.

##### shareEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if sharing is enabled.

##### shareFrameEnabled  
**Type**: `boolean`  
**Default**: `true`  
Determines if sharing frame is enabled.

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
