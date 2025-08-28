import { IIIFEvents } from "../../IIIFEvents";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { Bookmark } from "../../modules/uv-shared-module/Bookmark";
import { DownloadOption } from "../../modules/uv-shared-module/DownloadOption";
import { XYWHFragment } from "../../modules/uv-shared-module/XYWHFragment";
import { ContentLeftPanel } from "../../modules/uv-contentleftpanel-module/ContentLeftPanel";
import { CroppedImageDimensions } from "./CroppedImageDimensions";
import DownloadDialogue from "./DownloadDialogue";
import { OpenSeadragonExtensionEvents } from "./Events";
import { ExternalContentDialogue } from "../../modules/uv-dialogues-module/ExternalContentDialogue";
import { FooterPanel as MobileFooterPanel } from "../../modules/uv-osdmobilefooterpanel-module/MobileFooter";
import { FooterPanel } from "../../modules/uv-searchfooterpanel-module/FooterPanel";
import { HelpDialogue } from "../../modules/uv-dialogues-module/HelpDialogue";
import { IOpenSeadragonExtensionData } from "./IOpenSeadragonExtensionData";
import { Mode } from "./Mode";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { MultiSelectDialogue } from "../../modules/uv-multiselectdialogue-module/MultiSelectDialogue";
import { MultiSelectionArgs } from "./MultiSelectionArgs";
import { PagingHeaderPanel } from "../../modules/uv-pagingheaderpanel-module/PagingHeaderPanel";
import { Point } from "../../modules/uv-shared-module/Point";
import { OpenSeadragonCenterPanel } from "../../modules/uv-openseadragoncenterpanel-module/OpenSeadragonCenterPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { Bools, Maths, Strings } from "../../Utils";
import {
  IIIFResourceType,
  ExternalResourceType,
  ServiceProfile,
  ViewingHint,
  ViewingDirection,
} from "@iiif/vocabulary/dist-commonjs/";
import { AnnotationGroup, AnnotationRect } from "@iiif/manifold";
import {
  Annotation,
  AnnotationBody,
  Canvas,
  Thumb,
  TreeNode,
  ManifestType,
  Resource,
  Range,
  LanguageMap,
  Service,
  Size,
  Utils,
  Manifest,
} from "manifesto.js";
import "./theme/theme.less";
import { AnnotationResults } from "../../modules/uv-shared-module/AnnotationResults";
import { Events } from "../../../../Events";
import { createRoot, Root } from "react-dom/client";
import { createElement } from "react";
import { createStore, OpenSeadragonExtensionState } from "./Store";
import { merge } from "../../../../Utils";
import defaultConfig from "./config/config.json";
import { Config } from "./config/Config";
import { AdjustImageDialogue } from "../../modules/uv-dialogues-module/AdjustImageDialogue";

export default class OpenSeadragonExtension extends BaseExtension<Config> {
  $downloadDialogue: JQuery;
  $externalContentDialogue: JQuery;
  $helpDialogue: JQuery;
  $multiSelectDialogue: JQuery;
  $settingsDialogue: JQuery;
  $shareDialogue: JQuery;
  $adjustImageDialogue: JQuery;
  centerPanel: OpenSeadragonCenterPanel;
  currentAnnotationRect: AnnotationRect | null;
  currentRotation: number = 0;
  downloadDialogueRoot: Root;
  externalContentDialogue: ExternalContentDialogue;
  footerPanel: FooterPanel;
  headerPanel: PagingHeaderPanel;
  helpDialogue: HelpDialogue;
  adjustImageDialogue: AdjustImageDialogue;
  isAnnotating: boolean = false;
  leftPanel: ContentLeftPanel;
  mobileFooterPanel: MobileFooterPanel;
  mode: Mode;
  multiSelectDialogue: MultiSelectDialogue;
  previousAnnotationRect: AnnotationRect | null;
  rightPanel: MoreInfoRightPanel;
  settingsDialogue: SettingsDialogue;
  shareDialogue: ShareDialogue;
  defaultConfig: Config = defaultConfig;

  create(): void {
    super.create();

    this.store = createStore();

    this.store.subscribe((_state) => {
      this.renderDownloadDialogue();
    });

    this.extensionHost.subscribe(IIIFEvents.METRIC_CHANGE, () => {
      if (!this.isDesktopMetric()) {
        const settings: ISettings = {};
        settings.pagingEnabled = false;
        this.updateSettings(settings);
        this.extensionHost.publish(IIIFEvents.UPDATE_SETTINGS);
        //this.shell.$rightPanel.hide();
      } else {
        //this.shell.$rightPanel.show();
      }
    });

    this.extensionHost.subscribe(
      IIIFEvents.CANVAS_INDEX_CHANGE,
      (canvasIndex: number) => {
        this.previousAnnotationRect = null;
        this.currentAnnotationRect = null;
        this.changeCanvas(canvasIndex);
      }
    );

    this.extensionHost.subscribe(IIIFEvents.CLEAR_ANNOTATIONS, () => {
      this.clearAnnotations();
      this.extensionHost.publish(IIIFEvents.ANNOTATIONS_CLEARED);
      this.fire(IIIFEvents.CLEAR_ANNOTATIONS);
    });

    this.extensionHost.subscribe(IIIFEvents.DOWN_ARROW, () => {
      if (!this.useArrowKeysToNavigate()) {
        this.centerPanel.setFocus();
      }
    });

    this.extensionHost.subscribe(IIIFEvents.END, () => {
      this.extensionHost.publish(
        IIIFEvents.CANVAS_INDEX_CHANGE,
        this.helper.getLastPageIndex()
      );
    });

    this.extensionHost.subscribe(IIIFEvents.FIRST, () => {
      this.fire(IIIFEvents.FIRST);
      this.extensionHost.publish(
        IIIFEvents.CANVAS_INDEX_CHANGE,
        this.helper.getFirstPageIndex()
      );
    });

    this.extensionHost.subscribe(IIIFEvents.GALLERY_DECREASE_SIZE, () => {
      this.fire(IIIFEvents.GALLERY_DECREASE_SIZE);
    });

    this.extensionHost.subscribe(IIIFEvents.GALLERY_INCREASE_SIZE, () => {
      this.fire(IIIFEvents.GALLERY_INCREASE_SIZE);
    });

    this.extensionHost.subscribe(IIIFEvents.GALLERY_THUMB_SELECTED, () => {
      this.fire(IIIFEvents.GALLERY_THUMB_SELECTED);
    });

    this.extensionHost.subscribe(IIIFEvents.HOME, () => {
      this.extensionHost.publish(
        IIIFEvents.CANVAS_INDEX_CHANGE,
        this.helper.getFirstPageIndex()
      );
    });

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.IMAGE_SEARCH,
      (index: number) => {
        this.fire(OpenSeadragonExtensionEvents.IMAGE_SEARCH, index);
        this.extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE, index);
      }
    );

    this.extensionHost.subscribe(IIIFEvents.LAST, () => {
      this.fire(IIIFEvents.LAST);
      this.extensionHost.publish(
        IIIFEvents.CANVAS_INDEX_CHANGE,
        this.helper.getLastPageIndex()
      );
    });

    this.extensionHost.subscribe(IIIFEvents.LEFT_ARROW, () => {
      if (this.useArrowKeysToNavigate()) {
        this.extensionHost.publish(
          IIIFEvents.CANVAS_INDEX_CHANGE,
          this.getPrevPageIndex()
        );
      } else {
        this.centerPanel.setFocus();
      }
    });

    this.extensionHost.subscribe(
      IIIFEvents.LEFTPANEL_COLLAPSE_FULL_START,
      () => {
        if (this.isDesktopMetric()) {
          this.shell.$rightPanel.show();
        }
      }
    );

    this.extensionHost.subscribe(
      IIIFEvents.LEFTPANEL_COLLAPSE_FULL_FINISH,
      () => {
        this.shell.$centerPanel.show();
        this.resize();
      }
    );

    this.extensionHost.subscribe(IIIFEvents.MINUS, () => {
      this.centerPanel.setFocus();
    });

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.MODE_CHANGE,
      (mode: string) => {
        this.fire(OpenSeadragonExtensionEvents.MODE_CHANGE, mode);
        this.mode = new Mode(mode);
        const settings: ISettings = this.getSettings();
        this.extensionHost.publish(IIIFEvents.SETTINGS_CHANGE, settings);
      }
    );

    this.extensionHost.subscribe(
      IIIFEvents.MULTISELECTION_MADE,
      (ids: string[]) => {
        const args: MultiSelectionArgs = new MultiSelectionArgs();
        args.manifestUri = this.helper.manifestUri;
        args.allCanvases = ids.length === this.helper.getCanvases().length;
        args.canvases = ids;
        args.format = this.data.config!.options.multiSelectionMimeType;
        args.sequence = this.helper.getCurrentSequence().id;
        this.fire(IIIFEvents.MULTISELECTION_MADE, args);
      }
    );

    this.extensionHost.subscribe(IIIFEvents.NEXT, () => {
      this.fire(IIIFEvents.NEXT);
      this.extensionHost.publish(
        IIIFEvents.CANVAS_INDEX_CHANGE,
        this.getNextPageIndex()
      );
    });

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.NEXT_SEARCH_RESULT,
      () => {
        this.fire(OpenSeadragonExtensionEvents.NEXT_SEARCH_RESULT);
      }
    );

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE,
      () => {
        this.fire(
          OpenSeadragonExtensionEvents.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE
        );
        this.nextSearchResult();
      }
    );

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE,
      () => {
        this.fire(
          OpenSeadragonExtensionEvents.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE
        );
        this.prevSearchResult();
      }
    );

    this.extensionHost.subscribe(IIIFEvents.OPEN_THUMBS_VIEW, () => {
      this.fire(IIIFEvents.OPEN_THUMBS_VIEW);
    });

    this.extensionHost.subscribe(IIIFEvents.OPEN_TREE_VIEW, () => {
      this.fire(IIIFEvents.OPEN_TREE_VIEW);
    });

    this.extensionHost.subscribe(IIIFEvents.PAGE_DOWN, () => {
      this.extensionHost.publish(
        IIIFEvents.CANVAS_INDEX_CHANGE,
        this.getNextPageIndex()
      );
    });

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.PAGE_SEARCH,
      (value: string) => {
        this.fire(OpenSeadragonExtensionEvents.PAGE_SEARCH, value);
        this.viewLabel(value);
      }
    );

    this.extensionHost.subscribe(IIIFEvents.PAGE_UP, () => {
      this.extensionHost.publish(
        IIIFEvents.CANVAS_INDEX_CHANGE,
        this.getPrevPageIndex()
      );
    });

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.PAGING_TOGGLED,
      (obj: any) => {
        this.fire(OpenSeadragonExtensionEvents.PAGING_TOGGLED, obj);
      }
    );

    this.extensionHost.subscribe(IIIFEvents.PLUS, () => {
      this.centerPanel.setFocus();
    });

    this.extensionHost.subscribe(IIIFEvents.PREV, () => {
      this.fire(IIIFEvents.PREV);
      this.extensionHost.publish(
        IIIFEvents.CANVAS_INDEX_CHANGE,
        this.getPrevPageIndex()
      );
    });

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.PREV_SEARCH_RESULT,
      () => {
        this.fire(OpenSeadragonExtensionEvents.PREV_SEARCH_RESULT);
      }
    );

    this.extensionHost.subscribe(OpenSeadragonExtensionEvents.PRINT, () => {
      this.print();
    });

    this.extensionHost.subscribe(Events.RELOAD, () => {
      this.extensionHost.publish(IIIFEvents.CLEAR_ANNOTATIONS);
    });

    this.extensionHost.subscribe(IIIFEvents.RIGHT_ARROW, () => {
      if (this.useArrowKeysToNavigate()) {
        this.extensionHost.publish(
          IIIFEvents.CANVAS_INDEX_CHANGE,
          this.getNextPageIndex()
        );
      } else {
        this.centerPanel.setFocus();
      }
    });

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.OPENSEADRAGON_ANIMATION,
      () => {
        this.fire(OpenSeadragonExtensionEvents.OPENSEADRAGON_ANIMATION);
      }
    );

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.OPENSEADRAGON_ROTATION,
      (degrees: number) => {
        this.fire(OpenSeadragonExtensionEvents.OPENSEADRAGON_ROTATION, degrees);
      }
    );

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.OPENSEADRAGON_ANIMATION_FINISH,
      (viewer: any) => {
        const xywh: XYWHFragment | null = this.centerPanel.getViewportBounds();
        const canvas: Canvas = this.helper.getCurrentCanvas();

        if (this.centerPanel && xywh && canvas) {
          this.extensionHost.publish(
            OpenSeadragonExtensionEvents.XYWH_CHANGE,
            xywh.toString()
          );
          this.data.target = canvas.id + "#xywh=" + xywh.toString();
          this.fire(IIIFEvents.TARGET_CHANGE, this.data.target);
        }

        this.fire(OpenSeadragonExtensionEvents.CURRENT_VIEW_URI, {
          cropUri: this.getCroppedImageUri(canvas, this.getViewer()),
          fullUri: this.getConfinedImageUri(canvas, canvas.getWidth()),
        });
      }
    );

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.OPENSEADRAGON_ANIMATION_START,
      () => {
        this.fire(OpenSeadragonExtensionEvents.OPENSEADRAGON_ANIMATION_START);
      }
    );

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.OPENSEADRAGON_OPEN,
      () => {
        if (!this.useArrowKeysToNavigate()) {
          this.centerPanel.setFocus();
        }
        this.fire(OpenSeadragonExtensionEvents.OPENSEADRAGON_OPEN);
      }
    );

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.OPENSEADRAGON_RESIZE,
      () => {
        this.fire(OpenSeadragonExtensionEvents.OPENSEADRAGON_RESIZE);
      }
    );

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.OPENSEADRAGON_ROTATION,
      (rotation: number) => {
        (<IOpenSeadragonExtensionData>this.data).rotation = rotation;
        this.fire(
          OpenSeadragonExtensionEvents.OPENSEADRAGON_ROTATION,
          (<IOpenSeadragonExtensionData>this.data).rotation
        );
        this.currentRotation = rotation;
      }
    );

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.SEARCH,
      (terms: string) => {
        this.fire(OpenSeadragonExtensionEvents.SEARCH, terms);
        this.search(terms);
      }
    );

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.SEARCH_PREVIEW_FINISH,
      () => {
        this.fire(OpenSeadragonExtensionEvents.SEARCH_PREVIEW_FINISH);
      }
    );

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.SEARCH_PREVIEW_START,
      () => {
        this.fire(OpenSeadragonExtensionEvents.SEARCH_PREVIEW_START);
      }
    );

    this.extensionHost.subscribe(IIIFEvents.ANNOTATIONS, (obj: any) => {
      this.fire(IIIFEvents.ANNOTATIONS, obj);
    });

    this.extensionHost.subscribe(
      IIIFEvents.ANNOTATION_CANVAS_CHANGE,
      (rects: AnnotationRect[]) => {
        this.extensionHost.publish(
          IIIFEvents.CANVAS_INDEX_CHANGE,
          rects[0].canvasIndex
        );
      }
    );

    this.extensionHost.subscribe(IIIFEvents.ANNOTATIONS_EMPTY, () => {
      this.fire(IIIFEvents.ANNOTATIONS_EMPTY);
    });

    this.extensionHost.subscribe(IIIFEvents.THUMB_SELECTED, (thumb: Thumb) => {
      this.extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE, thumb.index);
    });

    this.extensionHost.subscribe(
      IIIFEvents.TREE_NODE_SELECTED,
      (node: TreeNode) => {
        this.fire(IIIFEvents.TREE_NODE_SELECTED, node.data.path);
        this.treeNodeSelected(node);
      }
    );

    this.extensionHost.subscribe(IIIFEvents.UP_ARROW, () => {
      if (!this.useArrowKeysToNavigate()) {
        this.centerPanel.setFocus();
      }
    });

    this.extensionHost.subscribe(IIIFEvents.UPDATE_SETTINGS, () => {
      this.extensionHost.publish(
        IIIFEvents.CANVAS_INDEX_CHANGE,
        this.helper.canvasIndex
      );
    });

    this.extensionHost.subscribe(
      IIIFEvents.SHOW_DOWNLOAD_DIALOGUE,
      (triggerButton) => {
        const state = this.store.getState();
        if (state !== null) {
          state.openDownloadDialogue(triggerButton[0]);
        }
      }
    );

    this.extensionHost.subscribe(IIIFEvents.HIDE_DOWNLOAD_DIALOGUE, () => {
      this.closeActiveDialogue();
    });

    this.extensionHost.subscribe(IIIFEvents.CLOSE_ACTIVE_DIALOGUE, () => {
      this.closeActiveDialogue();
    });

    this.extensionHost.subscribe(IIIFEvents.ESCAPE, () => {
      this.closeActiveDialogue();
    });

    // this.component.subscribe(Events.VIEW_PAGE, (e: any, index: number) => {
    //     this.fire(Events.VIEW_PAGE, index);
    //     this.component.publish(BaseEvents.CANVAS_INDEX_CHANGE, [index]);
    // });
  }

  createModules(): void {
    super.createModules();

    if (this.isHeaderPanelEnabled()) {
      this.headerPanel = new PagingHeaderPanel(this.shell.$headerPanel);
    } else {
      this.shell.$headerPanel.hide();
    }

    if (this.isLeftPanelEnabled()) {
      this.leftPanel = new ContentLeftPanel(this.shell.$leftPanel);
    } else {
      this.shell.$leftPanel.hide();
    }

    this.centerPanel = new OpenSeadragonCenterPanel(this.shell.$centerPanel);

    if (this.isRightPanelEnabled()) {
      this.rightPanel = new MoreInfoRightPanel(this.shell.$rightPanel);
    } else {
      this.shell.$rightPanel.hide();
    }

    if (this.isFooterPanelEnabled()) {
      this.footerPanel = new FooterPanel(this.shell.$footerPanel);
      this.mobileFooterPanel = new MobileFooterPanel(
        this.shell.$mobileFooterPanel
      );
    } else {
      this.shell.$footerPanel.hide();
    }

    this.$helpDialogue = $(
      '<div class="overlay help" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$helpDialogue);
    this.helpDialogue = new HelpDialogue(this.$helpDialogue);

    this.$multiSelectDialogue = $(
      '<div class="overlay multiSelect" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$multiSelectDialogue);
    this.multiSelectDialogue = new MultiSelectDialogue(
      this.$multiSelectDialogue
    );

    this.$shareDialogue = $(
      '<div class="overlay share" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$shareDialogue);
    this.shareDialogue = new ShareDialogue(this.$shareDialogue);

    this.$adjustImageDialogue = $(
      '<div class="overlay adjustImage" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$adjustImageDialogue);
    this.adjustImageDialogue = new AdjustImageDialogue(
      this.$adjustImageDialogue,
      this.shell
    );

    this.$downloadDialogue = $("<div></div>");
    this.shell.$overlays.append(this.$downloadDialogue);
    this.downloadDialogueRoot = createRoot(this.$downloadDialogue[0]);

    this.$settingsDialogue = $(
      '<div class="overlay settings" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$settingsDialogue);
    this.settingsDialogue = new SettingsDialogue(this.$settingsDialogue);

    this.$externalContentDialogue = $(
      '<div class="overlay externalContent" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$externalContentDialogue);
    this.externalContentDialogue = new ExternalContentDialogue(
      this.$externalContentDialogue
    );

    if (this.isHeaderPanelEnabled()) {
      this.headerPanel.init();
    }

    if (this.isLeftPanelEnabled()) {
      this.leftPanel.init();
    }

    if (this.isRightPanelEnabled()) {
      this.rightPanel.init();
    }

    if (this.isFooterPanelEnabled()) {
      this.footerPanel.init();
    }
  }

  render(): void {
    super.render();

    this.checkForTarget();
    this.checkForAnnotations();
    this.checkForSearchParam();
    this.checkForRotationParam();
  }

  renderDownloadDialogue(): void {
    // todo: can this be added to store?
    const paged = this.isPagingSettingEnabled();

    // Try to initialize using the stored state; exit early if the state is not ready yet:
    const state: null | OpenSeadragonExtensionState = this.store.getState();
    if (state === null) {
      return;
    }
    const { downloadDialogueOpen, dialogueTriggerButton } = state;

    // todo: can the overlay visibility be added to the store?
    if (downloadDialogueOpen) {
      this.extensionHost.publish(IIIFEvents.SHOW_OVERLAY);
    } else {
      this.extensionHost.publish(IIIFEvents.HIDE_OVERLAY);
    }

    const pagedIndices: number[] = this.getPagedIndices();

    const canvases: Canvas[] = this.helper
      .getCanvases()
      .filter((_canvas: Canvas, index: number) => {
        return pagedIndices.includes(index);
      });

    const config = merge(
      this.data.config!.modules.dialogue,
      this.data.config!.modules.downloadDialogue
    );

    const downloadService: Service | null = this.helper.manifest!.getService(
      ServiceProfile.DOWNLOAD_EXTENSIONS
    );

    const selectionEnabled =
      config.options.selectionEnabled &&
      downloadService?.__jsonld.selectionEnabled;

    this.downloadDialogueRoot.render(
      createElement(DownloadDialogue, {
        canvases: canvases,
        confinedImageSize: config.options.confinedImageSize,
        content: config.content,
        downloadCurrentViewEnabled: config.options.downloadCurrentViewEnabled,
        downloadWholeImageHighResEnabled:
          config.options.downloadWholeImageHighResEnabled,
        downloadWholeImageLowResEnabled:
          config.options.downloadWholeImageLowResEnabled,
        locale: this.getLocale(),
        manifest: this.helper.manifest as Manifest,
        maxImageWidth: config.options.maxImageWidth,
        mediaDownloadEnabled: this.helper.isUIEnabled("mediaDownload"),
        open: downloadDialogueOpen,
        paged: paged,
        parent: this.shell.$overlays[0] as HTMLElement,
        requiredStatement: this.helper.getRequiredStatement()?.value,
        resources: this.resources,
        rotation: this.getViewerRotation() as number,
        selectionEnabled: selectionEnabled,
        sequence: this.helper.getCurrentSequence(),
        termsOfUseEnabled: this.data.config!.options.termsOfUseEnabled,
        triggerButton: dialogueTriggerButton as HTMLElement,
        getCroppedImageDimensions: (canvas: Canvas) => {
          return this.getCroppedImageDimensions(canvas, this.getViewer());
        },
        getConfinedImageDimensions: (canvas: Canvas) => {
          return this.getConfinedImageDimensions(
            canvas,
            config.options.confinedImageSize
          );
        },
        getConfinedImageUri: (canvas: Canvas) => {
          return this.getConfinedImageUri(
            canvas,
            config.options.confinedImageSize
          );
        },
        onClose: () => {
          this.closeActiveDialogue();
        },
        onDownload: (type: DownloadOption, label: string) => {
          this.extensionHost.publish(IIIFEvents.DOWNLOAD, {
            type: type,
            label: label,
          });
        },
        onDownloadCurrentView: (canvas: Canvas) => {
          const viewer: any = this.getViewer();
          window.open(<string>this.getCroppedImageUri(canvas, viewer));
        },
        onDownloadSelection: () => {
          this.closeActiveDialogue();
          this.extensionHost.publish(IIIFEvents.SHOW_MULTISELECT_DIALOGUE);
        },
        onShowTermsOfUse: () => {
          this.closeActiveDialogue();
          this.extensionHost.publish(IIIFEvents.SHOW_TERMS_OF_USE);
        },
      })
    );
  }

  closeActiveDialogue(): void {
    const state = this.store.getState();
    if (state !== null) {
      state.closeDialogue();
    }
  }

  checkForTarget(): void {
    if (this.data.target) {
      // Split target into canvas id and selector
      const components: string[] = this.data.target.split("#");
      const canvasId: string = components[0];

      // get canvas index of canvas id and trigger CANVAS_INDEX_CHANGE (if different)
      const index: number | null = this.helper.getCanvasIndexById(canvasId);

      if (index !== null && this.helper.canvasIndex !== index) {
        this.extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE, index);
      }

      // trigger SET_TARGET which calls fitToBounds(xywh) in OpenSeadragonCenterPanel
      const selector: string = components[1];
      this.extensionHost.publish(
        IIIFEvents.SET_TARGET,
        XYWHFragment.fromString(selector)
      );
    }
  }

  checkForAnnotations(): void {
    if (this.data.annotations) {
      // it's useful to group annotations by their target canvas
      let groupedAnnotations: AnnotationGroup[] = [];

      const annotations: any = this.data.annotations;

      if (Array.isArray(annotations)) {
        // using the Web Annotation Data Model
        groupedAnnotations = this.groupWebAnnotationsByTarget(
          this.data.annotations
        );
      } else if (annotations.resources.length) {
        // using Open Annotations
        groupedAnnotations = this.groupOpenAnnotationsByTarget(
          this.data.annotations
        );

        // clear annotations as they're from a search
        this.extensionHost.publish(IIIFEvents.CLEAR_ANNOTATIONS);
      }

      this.annotate(groupedAnnotations);
    }
  }

  annotate(annotations: AnnotationGroup[], terms?: string): void {
    this.annotations = annotations;

    // sort the annotations by canvasIndex
    this.annotations = annotations.sort(
      (a: AnnotationGroup, b: AnnotationGroup) => {
        return a.canvasIndex - b.canvasIndex;
      }
    );

    const annotationResults: AnnotationResults = new AnnotationResults();
    annotationResults.terms = terms;
    annotationResults.annotations = <AnnotationGroup[]>this.annotations;

    this.extensionHost.publish(IIIFEvents.ANNOTATIONS, annotationResults);

    // reload current index as it may contain annotations.
    //this.component.publish(BaseEvents.CANVAS_INDEX_CHANGE, [this.helper.canvasIndex]);
  }

  groupWebAnnotationsByTarget(annotations: any): AnnotationGroup[] {
    const groupedAnnotations: AnnotationGroup[] = [];

    for (let i = 0; i < annotations.length; i++) {
      const annotation = annotations[i];
      const canvasId: string = annotation.target.match(/(.*)#/)[1];
      const canvasIndex: number | null =
        this.helper.getCanvasIndexById(canvasId);
      const annotationGroup: AnnotationGroup = new AnnotationGroup(canvasId);
      annotationGroup.canvasIndex = canvasIndex as number;

      const match: AnnotationGroup = groupedAnnotations.filter(
        (x) => x.canvasId === annotationGroup.canvasId
      )[0];

      // if there's already an annotation for that target, add a rect to it, otherwise create a new AnnotationGroup
      if (match) {
        match.addRect(annotation);
      } else {
        annotationGroup.addRect(annotation);
        groupedAnnotations.push(annotationGroup);
      }
    }

    return groupedAnnotations;
  }

  groupOpenAnnotationsByTarget(annotations: any): AnnotationGroup[] {
    const groupedAnnotations: AnnotationGroup[] = [];

    for (let i = 0; i < annotations.resources.length; i++) {
      const resource: any = annotations.resources[i];
      const canvasId: string = resource.on.match(/(.*)#/)[1];
      // console.log(canvasId)
      const canvasIndex: number | null =
        this.helper.getCanvasIndexById(canvasId);
      const annotationGroup: AnnotationGroup = new AnnotationGroup(canvasId);
      annotationGroup.canvasIndex = canvasIndex as number;

      const match: AnnotationGroup = groupedAnnotations.filter(
        (x) => x.canvasId === annotationGroup.canvasId
      )[0];

      // if there's already an annotation for that target, add a rect to it, otherwise create a new AnnotationGroup
      if (match) {
        match.addRect(resource);
      } else {
        annotationGroup.addRect(resource);
        groupedAnnotations.push(annotationGroup);
      }
    }

    // sort by canvasIndex
    groupedAnnotations.sort((a, b) => {
      return a.canvasIndex - b.canvasIndex;
    });

    return groupedAnnotations;
  }

  checkForSearchParam(): void {
    // if a highlight param is set, use it to search.
    const highlight: string | undefined = (<IOpenSeadragonExtensionData>(
      this.data
    )).highlight;

    if (highlight) {
      highlight.replace(/\+/g, " ").replace(/"/g, "");
      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.SEARCH,
        highlight
      );
    }
  }

  checkForRotationParam(): void {
    // if a rotation value is passed, set rotation
    const rotation: number | undefined = (<IOpenSeadragonExtensionData>(
      this.data
    )).rotation;

    if (rotation) {
      this.extensionHost.publish(IIIFEvents.SET_ROTATION, rotation);
    }
  }

  changeCanvas(canvasIndex: number): void {
    // if it's an invalid canvas index.
    if (canvasIndex === -1) return;

    let isReload: boolean = false;

    if (canvasIndex === this.helper.canvasIndex) {
      isReload = true;
    }

    if (this.helper.isCanvasIndexOutOfRange(canvasIndex)) {
      this.showMessage(this.data.config!.content.canvasIndexOutOfRange);
      canvasIndex = 0;
    }

    if (this.isPagingSettingEnabled() && !isReload) {
      const indices: number[] = this.getPagedIndices(canvasIndex);

      // if the page is already displayed, only advance canvasIndex.
      if (indices.includes(this.helper.canvasIndex)) {
        this.viewCanvas(canvasIndex);
        return;
      }
    }

    this.viewCanvas(canvasIndex);
  }

  getViewer() {
    return this.centerPanel.viewer;
  }

  getMode(): Mode {
    if (this.mode) return this.mode;

    switch (this.helper.getManifestType()) {
      case ManifestType.MONOGRAPH:
        return Mode.page;
      case ManifestType.MANUSCRIPT:
        return Mode.page;
      default:
        return Mode.image;
    }
  }

  getViewportBounds(): string | null {
    if (!this.centerPanel) return null;
    const bounds = this.centerPanel.getViewportBounds();
    if (bounds) {
      return bounds.toString();
    }
    return null;
  }

  getViewerRotation(): number | null {
    if (!this.centerPanel) return null;
    return this.currentRotation;
  }

  viewRange(path: string): void {
    //this.currentRangePath = path;
    const range: Range | null = this.helper.getRangeByPath(path);
    if (!range) return;
    const canvasId: string = range.getCanvasIds()[0];
    const index: number | null = this.helper.getCanvasIndexById(canvasId);
    this.extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE, index);
    this.extensionHost.publish(IIIFEvents.RANGE_CHANGE, range);
  }

  viewLabel(label: string): void {
    if (!label) {
      this.showMessage(
        this.data.config!.modules.genericDialogue.content.emptyValue
      );
      this.extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE_FAILED);
      return;
    }

    const index: number = this.helper.getCanvasIndexByLabel(label);

    if (index != -1) {
      this.extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE, index);
    } else {
      this.showMessage(
        this.data.config!.modules.genericDialogue.content.pageNotFound
      );
      this.extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE_FAILED);
    }
  }

  treeNodeSelected(node: TreeNode): void {
    const data: any = node.data;

    if (!data.type) return;

    switch (data.type) {
      case IIIFResourceType.MANIFEST:
        this.viewManifest(data);
        break;
      case IIIFResourceType.COLLECTION:
        // note: this won't get called as the tree component now has branchNodesSelectable = false
        // useful to keep around for reference
        this.viewCollection(data);
        break;
      default:
        this.viewRange(data.path);
        break;
    }
  }

  clearAnnotations(): void {
    this.annotations = [];

    // reload current index as it may contain results.
    this.extensionHost.publish(
      IIIFEvents.CANVAS_INDEX_CHANGE,
      this.helper.canvasIndex
    );
  }

  prevSearchResult(): void {
    let foundResult: AnnotationGroup;
    if (!this.annotations) return;

    // get the first result with a canvasIndex less than the current index.
    for (let i = this.annotations.length - 1; i >= 0; i--) {
      const result: AnnotationGroup = this.annotations[i];

      if (result.canvasIndex <= this.getPrevPageIndex()) {
        foundResult = result;
        this.extensionHost.publish(
          IIIFEvents.CANVAS_INDEX_CHANGE,
          foundResult.canvasIndex
        );
        break;
      }
    }
  }

  nextSearchResult(): void {
    if (!this.annotations) return;

    // get the first result with an index greater than the current index.
    for (let i = 0; i < this.annotations.length; i++) {
      const result: AnnotationGroup = this.annotations[i];

      if (result && result.canvasIndex >= this.getNextPageIndex()) {
        this.extensionHost.publish(
          IIIFEvents.CANVAS_INDEX_CHANGE,
          result.canvasIndex
        );
        break;
      }
    }
  }

  bookmark(): void {
    super.bookmark();

    const canvas: Canvas = this.helper.getCurrentCanvas();
    const bookmark: Bookmark = new Bookmark();

    bookmark.index = this.helper.canvasIndex;
    bookmark.label = <string>LanguageMap.getValue(canvas.getLabel());
    bookmark.path = <string>this.getCroppedImageUri(canvas, this.getViewer());
    bookmark.thumb = canvas.getCanonicalImageUri(
      this.data.config!.options.bookmarkThumbWidth
    );
    bookmark.title = this.helper.getLabel();
    bookmark.trackingLabel = window.trackingLabel;
    bookmark.type = ExternalResourceType.IMAGE;

    this.fire(IIIFEvents.BOOKMARK, bookmark);
  }

  print(): void {
    // var args: MultiSelectionArgs = new MultiSelectionArgs();
    // args.manifestUri = this.helper.manifestUri;
    // args.allCanvases = true;
    // args.format = this.data.config!.options.printMimeType;
    // args.sequence = this.helper.getCurrentSequence().id;
    window.print();
    this.fire(OpenSeadragonExtensionEvents.PRINT);
  }

  getCroppedImageDimensions(
    canvas: Canvas,
    viewer: any
  ): CroppedImageDimensions | null {
    if (!viewer) return null;
    if (!viewer.viewport) return null;

    let resourceWidth: number;
    let resourceHeight: number;

    if (canvas.getWidth()) {
      resourceWidth = canvas.getWidth();
    } else {
      resourceWidth = canvas.externalResource.width;
    }

    if (canvas.getHeight()) {
      resourceHeight = canvas.getHeight();
    } else {
      resourceHeight = canvas.externalResource.height;
    }

    if (!resourceWidth || !resourceHeight) {
      return null;
    }

    const bounds: any = viewer.viewport.getBounds(true);

    const dimensions: CroppedImageDimensions = new CroppedImageDimensions();

    let width: number = Math.floor(bounds.width);
    let height: number = Math.floor(bounds.height);
    let x: number = Math.floor(bounds.x);
    let y: number = Math.floor(bounds.y);

    // constrain to image bounds
    if (x + width > resourceWidth) {
      width = resourceWidth - x;
    } else if (x < 0) {
      width = width + x;
    }

    if (x < 0) {
      x = 0;
    }

    if (y + height > resourceHeight) {
      height = resourceHeight - y;
    } else if (y < 0) {
      height = height + y;
    }

    if (y < 0) {
      y = 0;
    }

    width = Math.min(width, resourceWidth);
    height = Math.min(height, resourceHeight);
    const regionWidth: number = width;
    const regionHeight: number = height;

    const maxDimensions: Size | null = canvas.getMaxDimensions();

    if (maxDimensions) {
      if (width > maxDimensions.width) {
        const newWidth: number = maxDimensions.width;
        height = Math.round(newWidth * (height / width));
        width = newWidth;
      }

      if (height > maxDimensions.height) {
        const newHeight: number = maxDimensions.height;
        width = Math.round((width / height) * newHeight);
        height = newHeight;
      }
    }

    dimensions.region = new Size(regionWidth, regionHeight);
    dimensions.regionPos = new Point(x, y);
    dimensions.size = new Size(width, height);

    return dimensions;
  }

  // keep this around for reference

  // getOnScreenCroppedImageDimensions(canvas: manifesto.Canvas, viewer: any): CroppedImageDimensions {

  //     if (!viewer) return null;
  //     if (!viewer.viewport) return null;

  //     if (!canvas.getHeight() || !canvas.getWidth()){
  //         return null;
  //     }

  //     var bounds = viewer.viewport.getBounds(true);
  //     var containerSize = viewer.viewport.getContainerSize();
  //     var zoom = viewer.viewport.getZoom(true);

  //     var top = Math.max(0, bounds.y);
  //     var left = Math.max(0, bounds.x);

  //     // change top to be normalised value proportional to height of image, not width (as per OSD).
  //     top = 1 / (canvas.getHeight() / parseInt(String(canvas.getWidth() * top)));

  //     // get on-screen pixel sizes.

  //     var viewportWidthPx = containerSize.x;
  //     var viewportHeightPx = containerSize.y;

  //     var imageWidthPx = parseInt(String(viewportWidthPx * zoom));
  //     var ratio = canvas.getWidth() / imageWidthPx;
  //     var imageHeightPx = parseInt(String(canvas.getHeight() / ratio));

  //     var viewportLeftPx = parseInt(String(left * imageWidthPx));
  //     var viewportTopPx = parseInt(String(top * imageHeightPx));

  //     var rect1Left = 0;
  //     var rect1Right = imageWidthPx;
  //     var rect1Top = 0;
  //     var rect1Bottom = imageHeightPx;

  //     var rect2Left = viewportLeftPx;
  //     var rect2Right = viewportLeftPx + viewportWidthPx;
  //     var rect2Top = viewportTopPx;
  //     var rect2Bottom = viewportTopPx + viewportHeightPx;

  //     var sizeWidth = Math.max(0, Math.min(rect1Right, rect2Right) - Math.max(rect1Left, rect2Left));
  //     var sizeHeight = Math.max(0, Math.min(rect1Bottom, rect2Bottom) - Math.max(rect1Top, rect2Top));

  //     // get original image pixel sizes.

  //     var ratio2 = canvas.getWidth() / imageWidthPx;

  //     var regionWidth = parseInt(String(sizeWidth * ratio2));
  //     var regionHeight = parseInt(String(sizeHeight * ratio2));

  //     var regionTop = parseInt(String(canvas.getHeight() * top));
  //     var regionLeft = parseInt(String(canvas.getWidth() * left));

  //     if (regionTop < 0) regionTop = 0;
  //     if (regionLeft < 0) regionLeft = 0;

  //     var dimensions: CroppedImageDimensions = new CroppedImageDimensions();

  //     dimensions.region = new manifesto.Size(regionWidth, regionHeight);
  //     dimensions.regionPos = new Point(regionLeft, regionTop);
  //     dimensions.size = new manifesto.Size(sizeWidth, sizeHeight);

  //     return dimensions;
  // }

  getCroppedImageUri(canvas: Canvas, viewer: any): string | null {
    if (!viewer) return null;
    if (!viewer.viewport) return null;

    const dimensions: CroppedImageDimensions | null =
      this.getCroppedImageDimensions(canvas, viewer);

    if (!dimensions) {
      return null;
    }

    // construct uri
    // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg

    const baseUri: string = this.getImageBaseUri(canvas);
    const id: string | null = this.getImageId(canvas);

    if (!id) {
      return null;
    }

    const region: string =
      dimensions.regionPos.x +
      "," +
      dimensions.regionPos.y +
      "," +
      dimensions.region.width +
      "," +
      dimensions.region.height;
    const size: string = dimensions.size.width + "," + dimensions.size.height;
    const rotation: number = <number>this.getViewerRotation();
    const quality: string = "default";
    return `${baseUri}/${id}/${region}/${size}/${rotation}/${quality}.jpg`;
  }

  getConfinedImageDimensions(canvas: Canvas, longestSide: number): Size {
    let resourceWidth: number = canvas.getWidth();
    let resourceHeight: number = canvas.getHeight();

    if (!resourceWidth) {
      resourceWidth = canvas.externalResource.width;
    }

    if (!resourceHeight) {
      resourceHeight = canvas.externalResource.height;
    }

    const dimensions: Size = new Size(0, 0);
    if (resourceWidth > resourceHeight) {
      dimensions.width = longestSide;
      const normWidth = Maths.normalise(longestSide, 0, resourceWidth);
      dimensions.height = Math.floor(resourceHeight * normWidth);
    } else {
      dimensions.height = longestSide;
      const normHeight = Maths.normalise(longestSide, 0, resourceHeight);
      dimensions.width = Math.floor(resourceWidth * normHeight);
    }
    return dimensions;
  }

  getConfinedImageUri(canvas: Canvas, width: number): string | null {
    const baseUri = this.getImageBaseUri(canvas);

    // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg
    const id: string | null = this.getImageId(canvas);

    if (!id) {
      return null;
    }

    const region: string = "full";
    const dimensions: Size = this.getConfinedImageDimensions(canvas, width);
    const size: string = dimensions.width + "," + dimensions.height;
    const rotation: number = <number>this.getViewerRotation();
    const quality: string = "default";
    return `${baseUri}/${id}/${region}/${size}/${rotation}/${quality}.jpg`;
  }

  getImageId(canvas: Canvas): string | null {
    if (canvas.externalResource) {
      const id: string | undefined =
        canvas.externalResource.data["@id"] || canvas.externalResource.data.id;

      if (id) {
        return id.substr(id.lastIndexOf("/") + 1);
      }
    }

    return null;
  }

  getImageBaseUri(canvas: Canvas): string {
    let uri = this.getInfoUri(canvas);
    // First trim off info.json, then trim off ID....
    uri = uri.substr(0, uri.lastIndexOf("/"));
    return uri.substr(0, uri.lastIndexOf("/"));
  }

  getInfoUri(canvas: Canvas): string {
    let infoUri: string | null = null;

    let images: Annotation[] = canvas.getImages();

    // presentation 2
    if (images && images.length) {
      const firstImage: Annotation = images[0];
      const resource: Resource = firstImage.getResource();
      const services: Service[] = resource.getServices();

      for (let i = 0; i < services.length; i++) {
        const service: Service = services[i];
        let id = service.id;

        if (!id.endsWith("/")) {
          id += "/";
        }

        if (Utils.isImageProfile(service.getProfile())) {
          infoUri = id + "info.json";
        }
      }
    } else {
      // presentation 3
      images = canvas.getContent();

      const firstImage: Annotation = images[0];
      const body: AnnotationBody[] = firstImage.getBody();

      if (body.length) {
        const services: Service[] = body[0].getServices();

        for (let i = 0; i < services.length; i++) {
          const service: Service = services[i];
          let id = service.id;

          if (!id.endsWith("/")) {
            id += "/";
          }

          if (
            Utils.isImageProfile(service.getProfile()) ||
            Utils.isImageServiceType(service.getIIIFResourceType())
          ) {
            infoUri = id + "info.json";
          }
        }
      }
    }

    if (!infoUri) {
      // todo: use compiler flag (when available)
      infoUri = "lib/imageunavailable.json";
    }

    return infoUri;
  }

  getEmbedScript(
    template: string,
    width: number,
    height: number,
    zoom: string,
    rotation: number
  ): string {
    const config: string = this.data.config?.uri ?? "";
    const locales: string = this.getSerializedLocales() ?? "";
    const hashParams = new URLSearchParams({
      manifest: this.helper.manifestUri,
      c: this.helper.collectionIndex.toString(),
      m: this.helper.manifestIndex.toString(),
      cv: this.helper.canvasIndex.toString(),
      config: config,
      locales: locales,
      xywh: zoom,
      r: rotation.toString(),
    });

    return super.buildEmbedScript(template, width, height, hashParams);
  }

  isSearchEnabled(): boolean {
    if (!Bools.getBool(this.data.config!.options.searchWithinEnabled, false)) {
      return false;
    }

    if (!this.helper.getSearchService()) {
      return false;
    }

    return true;
  }

  isPagingSettingEnabled(): boolean {
    if (this.helper.isPagingAvailable()) {
      return <boolean>this.getSettings().pagingEnabled;
    }

    return false;
  }

  getAutoCompleteService(): Service | null {
    const service: Service | null = this.helper.getSearchService();
    if (!service) return null;
    return (
      service.getService(ServiceProfile.SEARCH_0_AUTO_COMPLETE) ||
      service.getService(ServiceProfile.SEARCH_1_AUTO_COMPLETE)
    );
  }

  getAutoCompleteUri(): string | null {
    const service: Service | null = this.getAutoCompleteService();
    if (!service) return null;
    return service.id + "?q={0}";
  }

  getSearchServiceUri(): string | null {
    const service: Service | null = this.helper.getSearchService();
    if (!service) return null;

    let uri: string = service.id;
    uri = uri + "?q={0}";
    return uri;
  }

  search(terms: string): void {
    if (this.isAnnotating) return;

    this.isAnnotating = true;

    // clear search results
    this.annotations = [];

    const that = this;

    // searching

    let searchUri: string | null = this.getSearchServiceUri();

    if (!searchUri) return;

    searchUri = Strings.format(searchUri, encodeURIComponent(terms));

    this.getSearchResults(
      searchUri,
      terms,
      this.annotations,
      (annotations: AnnotationGroup[]) => {
        that.isAnnotating = false;

        if (annotations.length) {
          that.annotate(annotations, terms);
        } else {
          that.showMessage(
            that.data.config!.modules.genericDialogue.content.noMatches,
            () => {
              this.extensionHost.publish(IIIFEvents.ANNOTATIONS_EMPTY);
            }
          );
        }
      }
    );
  }

  getSearchResults(
    searchUri: string,
    terms: string,
    searchResults: AnnotationGroup[],
    cb: (results: AnnotationGroup[]) => void
  ): void {
    fetch(searchUri)
      .then((response) => response.json())
      .then((results) => {
        if (results.resources && results.resources.length) {
          searchResults = searchResults.concat(
            this.groupOpenAnnotationsByTarget(results)
          );
        }

        if (results.next) {
          this.getSearchResults(results.next, terms, searchResults, cb);
        } else {
          cb(searchResults);
        }
      });
  }

  getAnnotationRects(): AnnotationRect[] {
    if (this.annotations.length) {
      return this.annotations
        .map((x) => {
          return x.rects;
        })
        .reduce((a, b) => {
          return a.concat(b);
        });
    }
    return [];
  }

  getCurrentAnnotationRectIndex(): number {
    const annotationRects: AnnotationRect[] = this.getAnnotationRects();

    if (this.currentAnnotationRect) {
      return annotationRects.indexOf(this.currentAnnotationRect);
    }

    return -1;
  }

  getTotalAnnotationRects(): number {
    const annotationRects: AnnotationRect[] = this.getAnnotationRects();
    return annotationRects.length;
  }

  isFirstAnnotationRect(): boolean {
    return this.getCurrentAnnotationRectIndex() === 0;
  }

  getLastAnnotationRectIndex(): number {
    return this.getTotalAnnotationRects() - 1;
  }

  getPrevPageIndex(canvasIndex: number = this.helper.canvasIndex): number {
    let index: number;

    if (this.isPagingSettingEnabled()) {
      const indices: number[] = this.getPagedIndices(canvasIndex);

      if (this.helper.isRightToLeft()) {
        index = indices[indices.length - 1] - 1;
      } else {
        index = indices[0] - 1;
      }
    } else {
      index = canvasIndex - 1;
    }

    return index;
  }

  getNextPageIndex(canvasIndex: number = this.helper.canvasIndex): number {
    let index: number;

    // const canvas: Canvas | null = this.helper.getCanvasByIndex(canvasIndex);

    if (this.isPagingSettingEnabled()) {
      const indices: number[] = this.getPagedIndices(canvasIndex);

      if (this.helper.isRightToLeft()) {
        index = indices[0] + 1;
      } else {
        index = indices[indices.length - 1] + 1;
      }
    } else {
      index = canvasIndex + 1;
    }

    if (index > this.helper.getTotalCanvases() - 1) {
      return -1;
    }

    return index;
  }

  // https://github.com/UniversalViewer/iiif-thumbnails/blob/main/src/App.tsx#L49
  getPagedIndices(canvasIndex: number = this.helper.canvasIndex): number[] {
    // todo: get these from the store (inc canvasIndex)
    const manifest = this.helper.manifest;
    const sequence = manifest!.getSequences()[0];
    const canvases = sequence.getCanvases();
    const paged = !!this.getSettings().pagingEnabled && this.helper.isPaged();
    const viewingDirection = this.helper.getViewingDirection();

    let indices: number[] = [];

    // if it's a continuous manifest, get all resources.
    if (sequence.getViewingHint() === ViewingHint.CONTINUOUS) {
      // get all canvases to be displayed inline
      indices = canvases.map((_canvas: Canvas, index: number) => {
        return index;
      });
    } else {
      if (!paged) {
        // one-up
        // if the current canvas index is for a non-paged canvas, only return that canvas index
        // don't pair it with another in two-up
        indices.push(canvasIndex);
      } else {
        // two-up
        if (
          canvasIndex === 0 ||
          (canvasIndex === canvases.length && canvases.length % 2 === 0)
        ) {
          indices = [canvasIndex];
        } else if (canvasIndex % 2 === 0) {
          // the current canvas index is even
          // therefore it appears on the right

          // only include prev canvas if it's not non-paged and the current canvas isn't non-paged
          const currentCanvas: Canvas | null = canvases[canvasIndex];
          const prevCanvas: Canvas | null = canvases[canvasIndex - 1];
          if (
            currentCanvas?.getViewingHint() !== ViewingHint.NON_PAGED &&
            prevCanvas?.getViewingHint() !== ViewingHint.NON_PAGED
          ) {
            if (prevCanvas) {
              indices = [canvasIndex - 1, canvasIndex];
            } else {
              indices = [canvasIndex];
            }
          } else {
            indices = [canvasIndex];
          }
        } else {
          // the current canvas index is odd
          // therefore it appears on the left

          // only include next canvas if it's not non-paged and the current canvas isn't non-paged
          const currentCanvas: Canvas | null = canvases[canvasIndex];
          const nextCanvas: Canvas | null = canvases[canvasIndex + 1];
          if (
            currentCanvas?.getViewingHint() !== ViewingHint.NON_PAGED &&
            nextCanvas?.getViewingHint() !== ViewingHint.NON_PAGED
          ) {
            if (nextCanvas) {
              indices = [canvasIndex, canvasIndex + 1];
            } else {
              indices = [canvasIndex];
            }
          } else {
            indices = [canvasIndex];
          }
        }

        if (viewingDirection === ViewingDirection.RIGHT_TO_LEFT) {
          indices = indices.reverse();
        }
      }
    }

    return indices;
  }
}
