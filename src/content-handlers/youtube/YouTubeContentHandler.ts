import BaseContentHandler from "../../BaseContentHandler";
import { BaseEvents } from "../../BaseEvents";
import { IUVOptions } from "../../UniversalViewer";
import { YouTubeData } from "./YouTubeData";

export default class YouTubeContentHandler extends BaseContentHandler<
  YouTubeData
> {
  private _playerDiv: HTMLDivElement;
  private _scriptTag: HTMLScriptElement;

  constructor(options: IUVOptions) {
    super(options);
    console.log("create YouTubeContentHandler");
    this._init();
  }

  private _init(): void {
    this._playerDiv = document.createElement("div");
    this._playerDiv.id = "player";
    this._el.append(this._playerDiv);

    // todo: use loadScript util
    this._scriptTag = document.createElement("script");
    this._scriptTag.src = "https://www.youtube.com/iframe_api?controls=0";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode!.insertBefore(this._scriptTag, firstScriptTag);

    if (window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        window.youTubePlayer = new YT.Player("player", {
          height: "100%",
          width: "100%",
          videoId: this.options.data.youTubeVideoId, // equivalent of calling set() - must be specified on init
          playerVars: {
            playsinline: 1,
          },
          events: {
            onReady: this._onPlayerReady.bind(this),
            onStateChange: this._onPlayerStateChange.bind(this),
          },
        });
      };
    }
  }

  private _onPlayerReady(_event) {
    this.fire(BaseEvents.CREATED);
    window.youTubePlayer.playVideo();
  }

  private _onPlayerStateChange(_event) {
    // onst currentTime = this._player.getCurrentTime();
    // console.log(currentTime);
    // currentTimeInput.value = currentTime;
  }

  public set(data: YouTubeData): void {
    // this.mergeDefaults(data);
    window.youTubePlayer.loadVideoById(data.youTubeVideoId);
  }

  public exitFullScreen(): void {}

  public resize(): void {
    // this._playerDiv.style.width = this._el.clientWidth + "px";
    // this._playerDiv.style.height = this._el.clientHeight + "px";
  }

  public dispose(): void {
    console.log("dispose YouTubeContentHandler");
    this._el.innerHTML = "";
    // window.youTubePlayer = undefined;
    // @ts-ignore
    // window.onYouTubeIframeAPIReady = undefined;
    // const scriptTag = document.getElementById("www-widgetapi-script");
    // scriptTag!.parentNode!.removeChild(scriptTag!);
    // this._scriptTag.parentNode!.removeChild(this._scriptTag);
  }
}
