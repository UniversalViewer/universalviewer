Notes:

In IIIFContentHandler:153 Events.CREATED is given a handler, but it appears to never be called via the on/fire mechanism. In fact it's called through the PubSub system's subscribeAll which is set up in BaseExtension:274 to basically try and handle any internal event (PubSub) if an external handler has been provided for it e.g.

```
uv.on("openseadragonExtension.animationFinish", function (someArg) {
    console.log("Handling openseadragonExtension.animationFinish with someArg", someArg);
});
```

Sometimes events are also 'pushed' outside by having .fire called inside an extension. This calls fire() function in BaseExtension which in turns calls it in the Extension Host aka BaseContentHandler which has access to the events array set by its on() function.

<!-- omit in toc -->
# Architectural Overview of the Universal Viewer

- [1. Major Architectural Components](#1-major-architectural-components)
  - [1.1 Core: `UniversalViewer`](#11-core-universalviewer)
  - [1.2 Content Handling: `BaseContentHandler`](#12-content-handling-basecontenthandler)
    - [1.2.1 `YouTubeContentHandler`](#121-youtubecontenthandler)
    - [1.2.2 `IIIFContentHandler`](#122-iiifcontenthandler)
  - [1.3 Content Extensions](#13-content-extensions)
    - [1.3.1 `BaseExtension`](#131-baseextension)
    - [1.3.2 Content Specific `Extension`](#132-content-specific-extension)
  - [1.4 Modules / UI Panels](#14-modules--ui-panels)
    - [1.4.1 Dialogues](#141-dialogues)
  - [1.5 Event Handling](#15-event-handling)
  - [1.6 Localisation](#16-localisation)
- [2. Source Code Structure \& Execution Flow](#2-source-code-structure--execution-flow)
  - [2.1 Initialisation](#21-initialisation)
  - [2.2 Configuration loading \& passing](#22-configuration-loading--passing)
  - [2.3 Events](#23-events)
    - [2.3.1 External Events](#231-external-events)
    - [2.3.2 Internal Events](#232-internal-events)
      - [2.3.2.1 YouTubeEvents](#2321-youtubeevents)
      - [2.3.2.2 IIIFEvents](#2322-iiifevents)
- [3. Extensions](#3-extensions)
  - [3.1 Aleph (3D)](#31-aleph-3d)
    - [3.1.1 Aleph Config](#311-aleph-config)
  - [3.2 AV](#32-av)
  - [3.3 Default](#33-default)
  - [3.4 Ebook](#34-ebook)
  - [3.5 Media Element](#35-media-element)
  - [3.6 Model Viewer](#36-model-viewer)
  - [3.7 Open Seagdraon](#37-open-seagdraon)
  - [3.8 PDF](#38-pdf)

<!-- omit in toc -->
## High-Level Summary

The Universal Viewer (UV) is designed to facilitate the presentation of diverse multimedia content types (images, videos, PDFs, IIIF manifests, etc.). Its architecture emphasizes support for multiple content handlers. 

The core system is built around a central `UniversalViewer` class orchestrating content handling, user interface panels, and external resource interactions.

## 1. Major Architectural Components

### 1.1 Core: `UniversalViewer`
- **Role:** Core class for the entire system.
- **Responsibilities:**
  - Determining content type and loading the appropriate `ContentHandler`.
  - Handles global events, including resizing and full-screen toggle.
  - Provides an API for assigning external event handlers.
  - Provides an API for setting content of, resizing of, and disposing of, the `assignedContentHandler`.
- **Details:**
  - Extends `BaseContentHandler`, inheriting event management and lifecycle.
  - Receives `target` HTMLElement and configuration `data` from the `init` function

### 1.2 Content Handling: `BaseContentHandler` 
- **Role:** Abstract class for loading the content handler and firing external events.
- **Design Pattern:** Lazy-loaded modules via dynamic `import()` statements.
- **Responsibilities:**
  - Handle content lifecycle: set, resize, dispose.
  - Communicate with the core container via events (`Events`, `IIIFEvents`, `YouTubeEvents`).

#### 1.2.1 `YouTubeContentHandler`
- **Role:** Loads a YouTube player iframe.
- **Responsibilities:**
  - Load the YouTube iframe API script if not already present.
  - Provide the `onYouTubeIframeAPIReady` function to:
    - Create the player instance.
    - Handle player events and fire the relevant `YouTubeEvents` event.
  - Provide YouTube player specific implementations of `resize` and `dispose`.

#### 1.2.2 `IIIFContentHandler`
- **Role:** Parse the IIIF manifest and load & configure the correct Content Extension
- **Design Pattern:** Lazy-loaded modules via dynamic `import()` statements.
- **Responsibilities:**
  - Provide PubSub pattern for event handling.
  - Create and configure the required Extension.
- **Details:**
  - Assigns itself to the Extension as `extensionHost`.
  - Provides `publish` and `subscribe` API functions to give Extensions access to PubSub.

### 1.3 Content Extensions

#### 1.3.1 `BaseExtension`
- **Role:** Abstract Extension class.
- **Responsibilities:**
  - Locale loading and replacement of locale string in default config.
  - Setup of general events e.g. arrow key presses.
  - Creation of Shell and common Modules

#### 1.3.2 Content Specific `Extension`
- **Role:** Content-type specific implementation of a 'Viewer'
- **Responsibilities:**
  - Load and display specific content types.
  - Manage content-specific UI and controls.
  - Provision of events to interact with content viewer.

### 1.4 Modules / UI Panels
- **Role:** Provide interface elements related to displayed content or UV settings.
- **Panel types:**
  - UV Shared Panels.
  - Header, Footer, Left, Right, Center main layout panels.
  - Extension-specific panels.
- **Center Panel:**
  - Key panel, contains content viewer.
- **Details:**
  - `Shell` class creates panel and dialogue containers and adds them to the `target` element.

#### 1.4.1 Dialogues

### 1.5 Event Handling

### 1.6 Localisation

## 2. Source Code Structure & Execution Flow

### 2.1 Initialisation

### 2.2 Configuration loading & passing

### 2.3 Events

TODO: Separate docs for these, similar to Options

#### 2.3.1 External Events

<!-- - CONFIGURE
- CREATED
- DROP
- ERROR
- EXIT_FULLSCREEN
- EXTERNAL_RESOURCE_OPENED
- LOAD
- LOAD_FAILED
- RELOAD
- RESIZE
- TOGGLE_FULLSCREEN -->

#### 2.3.2 Internal Events

##### 2.3.2.1 YouTubeEvents

<!-- - UNSTARTED
- ENDED
- PLAYING
- PAUSED
- BUFFERING
- CUED -->
  
##### 2.3.2.2 IIIFEvents

<!-- - ACCEPT_TERMS
- ANNOTATION_CANVAS_CHANGE
- ANNOTATION_CHANGE
- ANNOTATIONS_CLEARED
- ANNOTATIONS_EMPTY
- ANNOTATIONS
- BOOKMARK
- CANVAS_INDEX_CHANGE_FAILED
- CANVAS_INDEX_CHANGE
- CLEAR_ANNOTATIONS
- CLICKTHROUGH
- CLOSE_ACTIVE_DIALOGUE
- CLOSE_LEFT_PANEL
- CLOSE_RIGHT_PANEL
- COLLECTION_INDEX_CHANGE
- CREATE
- CURRENT_TIME_CHANGE
- RANGE_TIME_CHANGE
- DOWN_ARROW
- DOWNLOAD
- END
- ESCAPE
- EXTERNAL_LINK_CLICKED
- FEEDBACK
- FIRST
- FORBIDDEN
- GALLERY_DECREASE_SIZE
- GALLERY_INCREASE_SIZE
- GALLERY_THUMB_SELECTED
- HIDE_AUTH_DIALOGUE
- HIDE_CLICKTHROUGH_DIALOGUE
- HIDE_DOWNLOAD_DIALOGUE
- HIDE_EMBED_DIALOGUE
- HIDE_EXTERNALCONTENT_DIALOGUE
- HIDE_GENERIC_DIALOGUE
- HIDE_HELP_DIALOGUE
- HIDE_INFORMATION
- HIDE_LOGIN_DIALOGUE
- HIDE_MULTISELECT_DIALOGUE
- HIDE_OVERLAY
- HIDE_RESTRICTED_DIALOGUE
- HIDE_SETTINGS_DIALOGUE
- HIDE_SHARE_DIALOGUE
- HOME
- LAST
- LEFT_ARROW
- LEFTPANEL_COLLAPSE_FULL_FINISH
- LEFTPANEL_COLLAPSE_FULL_START
- LEFTPANEL_EXPAND_FULL_FINISH
- LEFTPANEL_EXPAND_FULL_START
- LOGIN_FAILED
- LOGIN
- LOGOUT
- MANIFEST_INDEX_CHANGE
- METRIC_CHANGE
- MINUS
- MULTISELECT_CHANGE
- MULTISELECTION_MADE
- NEXT
- NOT_FOUND
- OPEN_EXTERNAL_RESOURCE
- OPEN_LEFT_PANEL
- OPEN_RIGHT_PANEL
- OPEN_THUMBS_VIEW
- OPEN_TREE_VIEW
- OPEN
- PAGE_DOWN
- PAGE_UP
- PAUSE
- PINPOINT_ANNOTATION_CLICKED
- PLUS
- PREV
- RANGE_CHANGE
- REDIRECT
- REFRESH
- RESOURCE_DEGRADED
- RETRY
- RETURN
- RIGHT_ARROW
- RIGHTPANEL_COLLAPSE_FULL_FINISH
- RIGHTPANEL_COLLAPSE_FULL_START
- RIGHTPANEL_EXPAND_FULL_FINISH
- RIGHTPANEL_EXPAND_FULL_START
- SET_ROTATION
- SET_TARGET
- SET_MUTED
- SETTINGS_CHANGE
- SHOW_AUTH_DIALOGUE
- SHOW_CLICKTHROUGH_DIALOGUE
- SHOW_DOWNLOAD_DIALOGUE
- SHOW_EMBED_DIALOGUE
- SHOW_EXTERNALCONTENT_DIALOGUE
- SHOW_GENERIC_DIALOGUE
- SHOW_HELP_DIALOGUE
- SHOW_INFORMATION
- SHOW_LOGIN_DIALOGUE
- SHOW_MESSAGE
- MESSAGE_DISPLAYED
- SHOW_MULTISELECT_DIALOGUE
- SHOW_OVERLAY
- SHOW_RESTRICTED_DIALOGUE
- SHOW_SETTINGS_DIALOGUE
- SHOW_SHARE_DIALOGUE
- SHOW_TERMS_OF_USE
- TARGET_CHANGE
- TOGGLE_RIGHT_PANEL
- TOGGLE_LEFT_PANEL
- THUMB_MULTISELECTED
- THUMB_SELECTED
- TOGGLE_EXPAND_LEFT_PANEL
- TOGGLE_EXPAND_RIGHT_PANEL
- TREE_NODE_MULTISELECTED
- TREE_NODE_SELECTED
- UP_ARROW
- UPDATE_SETTINGS
- VIEW_FULL_TERMS
- WINDOW_UNLOAD
- SHOW_ADJUSTIMAGE_DIALOGUE
- HIDE_ADJUSTIMAGE_DIALOGUE -->

## 3. Extensions

TODO: Details on each extension, any specific dependencies it uses, refs to ext. specific config options, how they affect things, and how to use.

### 3.1 Aleph (3D)

<!--omit in toc -->
#### 3.1.1 Aleph Config

### 3.2 AV

### 3.3 Default

### 3.4 Ebook

### 3.5 Media Element

### 3.6 Model Viewer

### 3.7 Open Seagdraon

### 3.8 PDF



