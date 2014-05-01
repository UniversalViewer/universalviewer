{
  "@context":"http://www.shared-canvas.org/ns/context.json",
  "@type":"sc:Manifest",
  "@id":"http://www.example.org/iiif/book1/manifest.json",

  "label":"Book 1",
  "metadata": [
    {"label":"Author", "value":"Anne Author"},
    {"label":"Published", "value": [
        {"@value": "Paris, circa 1400", "@language":"en"},
        {"@value": "Paris, environ 14eme siecle", "@language":"fr"}
        ]
    }
  ],
  "description":"A longer description of this example book. It should give some real information.",
  "license":"http://www.example.org/license.html",
  "attribution":"Provided by Example Organization",
  "service":"http://www.example.org/iiif/book1/search.html",
  "seeAlso":
    {
      "@id": "http://www.example.org/library/catalog/book1.marc",
      "format": "application/marc"
    },
  "within":"http://www.example.org/collections/books/",

  "sequences" : [
      {
        "@id":"http://www.example.org/iiif/book1/sequence/normal.json",
        "@type":"sc:Sequence",
        "label":"Current Page Order",
    "viewingDirection":"left-to-right",
        "viewingHint":"paged",
        "canvases": [
          {
            "@id":"http://www.example.org/iiif/book1/canvas/p1.json",
            "@type":"sc:Canvas",
            "label":"p. 1",
            "height":1000,
            "width":750,
            "images": [
              {
                "@type":"oa:Annotation",
                "motivation":"sc:painting",
                "resource":{
                    "@id":"http://www.example.org/iiif/book1/res/page1.jpg",
                    "@type":"dctypes:Image",
                    "format":"image/jpeg",
                    "service": {
                        "@id": "http://www.example.org/images/book1-page1",
                        "profile":"http://library.stanford.edu/iiif/image-api/compliance.html#level0"
                    },
                    "height":2000,
                    "width":1500
                },
                "on":"http://www.example.org/iiif/book1/canvas/p1.json"
              }
            ],
            "otherContent": [
              {
                "@id":"http://www.example.org/iiif/book1/list/p1.json",
                "@type":"sc:AnnotationList"
              }
            ]
        },
          {
            "@id":"http://www.example.org/iiif/book1/canvas/p2.json",
            "@type":"sc:Canvas",
            "label":"p. 2",
            "height":1000,
            "width":750,
            "images": [
              {
                "@type":"oa:Annotation",
                "motivation":"sc:painting",
                "resource":{
                    "@id":"http://www.example.org/images/book1-page2/full/1500,2000/0/native.jpg",
                    "@type":"dctypes:Image",
                    "format":"image/jpeg",
                    "height":2000,
                    "width":1500,
                    "service": {
                        "@id":"http://www.example.org/images/book1-page2",
                        "profile":"http://library.stanford.edu/iiif/image-api/compliance.html#level0",
                        "scale_factors": [1, 2, 4],
                        "height":8000,
                        "width":6000,
                        "tile_width":1024,
                        "tile_height":1024
                    }
                },
                "on":"http://www.example.org/iiif/book1/canvas/p2.json"
              }
            ],
            "otherContent": [
              {
                "@id":"http://www.example.org/iiif/book1/list/p2.json",
                "@type":"sc:AnnotationList"
              }
            ]
          },
          {
            "@id":"http://www.example.org/iiif/book1/canvas/p3.json",
            "@type":"sc:Canvas",
            "label":"p. 3",
            "height":1000,
            "width":750,
            "images": [
              {
                "@type":"oa:Annotation",
                "motivation":"sc:painting",
                "resource":{
                    "@id":"http://www.example.org/iiif/book1/res/page3.jpg",
                    "@type":"dctypes:Image",
                    "format":"image/jpeg",
                    "service": {
                        "@id":"http://www.example.org/images/book1-page3",
                        "profile":"http://library.stanford.edu/iiif/image-api/compliance.html#level0"
          },
                    "height":2000,
                    "width":1500
                },
                "on":"http://www.example.org/iiif/book1/canvas/p3.json"
              }
            ],
            "otherContent": [
              {
                "@id":"http://www.example.org/iiif/book1/list/p3.json",
                "@type":"sc:AnnotationList"
              }
            ]
          }
        ]
      }
    ],
  "structures": [
    {
      "@id": "http://www.example.org/iiif/book1/range/r1.json",
        "@type":"sc:Range",
        "label":"Introduction",
        "canvases": [
          "http://www.example.org/iiif/book1/canvas/p1.json",
          "http://www.example.org/iiif/book1/canvas/p2.json",
          "http://www.example.org/iiif/book1/canvas/p3.json#xywh=0,0,750,300"
        ]
    }
  ]
}