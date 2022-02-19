import { IContentHandler } from "../../IContentHandler";
import { IUVOptions } from "../../UniversalViewer";
import { YouTubeData } from "./YouTubeData";

export default class YouTubeContentHandler
  implements IContentHandler<YouTubeData> {
  public _el: HTMLElement;
  private _playerDiv: HTMLDivElement;
  private _player;
  private _scriptTag: HTMLScriptElement;
  private _videoId = "Tax-S8PpJf4";

  constructor(private options: IUVOptions) {
    // this.mergeDefaults(this.options.data);
    console.log("create YouTubeContentHandler", this.options);
    this._el = options.target;
    this._init();
    this.set(this.options.data);
  }

  private _init(): void {
    this._playerDiv = document.createElement("div");
    this._playerDiv.id = "player";
    this._el.append(this._playerDiv);

    // todo: use loadScript util
    this._scriptTag = document.createElement("script");
    this._scriptTag.src = "https://www.youtube.com/iframe_api?controls=0";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode!.insertBefore(this._scriptTag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.

    if (window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        console.log("onYouTubeIframeAPIReady");
        this._player = new YT.Player("player", {
          height: "100%",
          width: "100%",
          videoId: this._videoId,
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
    this._player.playVideo();
  }

  private _onPlayerStateChange(_event) {
    const currentTime = this._player.getCurrentTime();
    console.log(currentTime);
    // currentTimeInput.value = currentTime;
  }

  public set(data: YouTubeData): void {
    // this.mergeDefaults(data);
  }

  public on(name: string, callback: Function): void {
    // var e = this._e || (this._e = {});
    // (e[name] || (e[name] = [])).push({
    //   fn: callback,
    //   ctx: ctx,
    // });
  }

  public exitFullScreen(): void {}

  public resize(): void {
    // this._playerDiv.style.width = this._el.clientWidth + "px";
    // this._playerDiv.style.height = this._el.clientHeight + "px";
  }

  public dispose(): void {
    console.log("dispose YouTubeContentHandler");
    this._el.innerHTML = "";
    this._player = undefined;
    // @ts-ignore
    // window.onYouTubeIframeAPIReady = undefined;
    // const scriptTag = document.getElementById("www-widgetapi-script");
    // scriptTag!.parentNode!.removeChild(scriptTag!);
    // this._scriptTag.parentNode!.removeChild(this._scriptTag);
  }
}
