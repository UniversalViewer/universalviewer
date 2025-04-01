import { IIIFEvents } from "../../IIIFEvents";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { Bookmark } from "../../modules/uv-shared-module/Bookmark";
import { ContentLeftPanel } from "../../modules/uv-contentleftpanel-module/ContentLeftPanel";
import { DownloadDialogue } from "./DownloadDialogue";
import { FooterPanel } from "../../modules/uv-shared-module/FooterPanel";
import { FooterPanel as MobileFooterPanel } from "../../modules/uv-modelviewermobilefooterpanel-module/MobileFooter";
import { HeaderPanel } from "../../modules/uv-shared-module/HeaderPanel";
import { HelpDialogue } from "../../modules/uv-dialogues-module/HelpDialogue";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { ModelViewerCenterPanel } from "../../modules/uv-modelviewercenterpanel-module/ModelViewerCenterPanel";
import { ExternalResourceType } from "@iiif/vocabulary/dist-commonjs/";
import { Canvas, LanguageMap } from "manifesto.js";
import { ModelViewerExtensionEvents } from "./Events";
import { Orbit } from "./Orbit";
import "./theme/theme.less";
import defaultConfig from "./config/config.json";
import { AnnotationGroup } from "@iiif/manifold";
import { AnnotationResults } from "../../modules/uv-shared-module/AnnotationResults";
import { Config } from "./config/Config";

export default class ModelViewerExtension extends BaseExtension<Config> {
  $downloadDialogue: JQuery;
  $shareDialogue: JQuery;
  $helpDialogue: JQuery;
  $settingsDialogue: JQuery;
  centerPanel: ModelViewerCenterPanel;
  downloadDialogue: DownloadDialogue;
  footerPanel: FooterPanel<Config["modules"]["footerPanel"]>;
  headerPanel: HeaderPanel<Config["modules"]["headerPanel"]>;
  helpDialogue: HelpDialogue;
  leftPanel: ContentLeftPanel;
  mobileFooterPanel: FooterPanel<Config["modules"]["footerPanel"]>;
  rightPanel: MoreInfoRightPanel;
  settingsDialogue: SettingsDialogue;
  shareDialogue: ShareDialogue;
  defaultConfig: Config = defaultConfig;

  create(): void {
    super.create();

    this.extensionHost.subscribe(
      IIIFEvents.CANVAS_INDEX_CHANGE,
      (canvasIndex: number) => {
        this.viewCanvas(canvasIndex);
      }
    );

    this.extensionHost.subscribe(
      IIIFEvents.THUMB_SELECTED,
      (canvasIndex: number) => {
        this.extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE, canvasIndex);
      }
    );

    this.extensionHost.subscribe(
      ModelViewerExtensionEvents.CAMERA_CHANGE,
      (orbit: Orbit) => {
        const canvas: Canvas = this.helper.getCurrentCanvas();
        if (canvas) {
          this.data.target = canvas.id + "#" + `orbit=${orbit.toString()}`;
          this.fire(IIIFEvents.TARGET_CHANGE, this.data.target);
        }
      }
    );
  }

  createModules(): void {
    super.createModules();

    if (this.isHeaderPanelEnabled()) {
      this.headerPanel = new HeaderPanel(this.shell.$headerPanel);
    } else {
      this.shell.$headerPanel.hide();
    }

    if (this.isLeftPanelEnabled()) {
      this.leftPanel = new ContentLeftPanel(this.shell.$leftPanel);
    }

    this.centerPanel = new ModelViewerCenterPanel(this.shell.$centerPanel);

    if (this.isRightPanelEnabled()) {
      this.rightPanel = new MoreInfoRightPanel(this.shell.$rightPanel);
    }

    if (this.isFooterPanelEnabled()) {
      this.footerPanel = new FooterPanel(this.shell.$footerPanel);
      this.mobileFooterPanel = new MobileFooterPanel(
        this.shell.$mobileFooterPanel
      );
    } else {
      this.shell.$footerPanel.hide();
    }

    this.$downloadDialogue = $(
      '<div class="overlay download" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$downloadDialogue);
    this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);

    this.$shareDialogue = $(
      '<div class="overlay share" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$shareDialogue);
    this.shareDialogue = new ShareDialogue(this.$shareDialogue);

    this.$settingsDialogue = $(
      '<div class="overlay settings" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$settingsDialogue);
    this.settingsDialogue = new SettingsDialogue(this.$settingsDialogue);

    if (this.isLeftPanelEnabled()) {
      this.leftPanel.init();
    } else {
      this.shell.$leftPanel.hide();
    }

    if (this.isRightPanelEnabled()) {
      this.rightPanel.init();
    } else {
      this.shell.$rightPanel.hide();
    }
  }

  render(): void {
    super.render();

    this.checkForTarget();
    this.checkForAnnotations();
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

      // trigger SET_TARGET which sets the camera-orbit attribute in ModelViewerCenterPanel
      const selector: string = components[1];
      this.extensionHost.publish(
        IIIFEvents.SET_TARGET,
        Orbit.fromString(selector)
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
        match.addPoint3D(annotation);
      } else {
        annotationGroup.addPoint3D(annotation);
        groupedAnnotations.push(annotationGroup);
      }
    }

    return groupedAnnotations;
  }

  isLeftPanelEnabled(): boolean {
    return false;
    // return (
    //   Bools.getBool(this.data.config!.options.leftPanelEnabled, true) &&
    //   (this.helper.isMultiCanvas() || this.helper.isMultiSequence())
    // );
  }

  bookmark(): void {
    super.bookmark();

    const canvas: Canvas = this.helper.getCurrentCanvas();
    const bookmark: Bookmark = new Bookmark();

    bookmark.index = this.helper.canvasIndex;
    bookmark.label = <string>LanguageMap.getValue(canvas.getLabel());
    bookmark.thumb = canvas.getProperty("thumbnail");
    bookmark.title = this.helper.getLabel();
    bookmark.trackingLabel = window.trackingLabel;
    bookmark.type = ExternalResourceType.PHYSICAL_OBJECT;

    this.fire(IIIFEvents.BOOKMARK, bookmark);
  }

  getEmbedScript(template: string, width: number, height: number): string {
    const hashParams = new URLSearchParams({
      manifest: this.helper.manifestUri,
      c: this.helper.collectionIndex.toString(),
      m: this.helper.manifestIndex.toString(),
      cv: this.helper.canvasIndex.toString(),
    });

    return super.buildEmbedScript(template, width, height, hashParams);
  }
}
