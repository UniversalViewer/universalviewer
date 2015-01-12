{
    "options": {
        "theme": "coreplayer-default-theme",
        "leftPanelEnabled": true,
        "rightPanelEnabled": true,
        "overrideFullScreen": false,
        "pagingEnabled": true,
        "sectionMappings": {
            "CoverFrontOutside": "Front Cover",
            "CoverBackOutside": "Back Cover",
            "TitlePage": "Title Page",
            "TableOfContents": "Table of Contents",
            "PartOfWork": "Part of Work"
        }
    },
    "modules": {
        "genericDialogue": {
            "content": {
                "emptyValue": "please enter a value",
                "pageNotFound": "This item does not contain a page with the number you entered. Try switching the numbering mode to 'image'",
                "ok": "OK",
                "refresh": "Refresh",
                "invalidNumber": "Please enter a valid number"
            }
        },
        "helpDialogue": {
            "content": {
                "title": "Help",
                "text": "placeholder text"
            }
        },
        "settingsDialogue": {
            "content": {
                "title": "Settings",
                "pagingEnabled": "Two Page View"
            }
        },
        "embedDialogue": {
            "options": {
                "embedTemplate": "<div class=\"wellcomePlayer\" data-uri=\"{0}\" data-sequenceindex=\"{1}\" data-canvasindex=\"{2}\" data-zoom=\"{3}\" data-rotation=\"{4}\" data-config=\"{5}\" style=\"width:{6}px; height:{7}px; background-color: #000\"></div>\n<script type=\"text/javascript\" id=\"embedWellcomePlayer\" src=\"{8}\"></script><script type=\"text/javascript\">/* wordpress fix */</script>"
            },
            "content": {
                "title": "Embed",
                "instructions": "To embed this item in your own website, copy and paste the code below:"
            }
        },
        "pagingHeaderPanel": {
            "content": {
                "help": "Help",
                "image": "Image",
                "page": "Label",
                "first": "First",
                "previous": "Previous",
                "next": "Next",
                "last": "Last",
                "go": "Go",
                "of": "of {0}",
                "emptyValue": "Please enter a value",
                "close": "Close"
            }
        },
        "treeViewLeftPanel": {
            "options": {
                "thumbsLoadRange": 15,
                "thumbsImageFadeInDuration": 300,
                "panelCollapsedWidth": 30,
                "panelExpandedWidth": 255,
                "panelOpen": true,
                "panelAnimationDuration": 250,
                "thumbWidth": 90,
                "thumbHeight": 150,
                "thumbsExtraHeight": 8
            },
            "content": {
                "index": "Index",
                "thumbnails": "Thumbnails"
            }
        },
        "seadragonCenterPanel": {
            "options": {
                "pageGap": 0.01,
                "defaultZoomLevel": 0,
                "controlsFadeAfterInactive": 1500,
                "controlsFadeDelay": 250,
                "controlsFadeLength": 250
            },
            "content": {
                "previous": "Previous",
                "next": "Next",
                "zoomIn": "Zoom In",
                "zoomOut": "Zoom Out",
                "imageUnavailable": "Image Unavailable"
            }
        },
        "moreInfoRightPanel": {
            "options": {
                "panelCollapsedWidth": 30,
                "panelExpandedWidth": 255,
                "panelAnimationDuration": 250,
                "panelOpen": false
            },
            "content": {
                "holdingText": "Your module goes here!"
            }
        },
        "footerPanel": {
            "options": {
                "embedEnabled": true,
                "minimiseButtons": false
            },
            "content": {
                "fullScreen": "Full Screen",
                "exitFullScreen": "Exit Full Screen",
                "embed": "Embed"
            }
        }
    }
}