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
    window.youTubeData = this.options.data; // necessary unfortunately due to the way the YouTube API works
    this._init();
  }

  private _getYouTubeVideoId(id: string): string {
    if (id.indexOf("v=")) {
      id = id.split("v=")[1];
    }
    return id;
  }

  private _init(): void {
    this._playerDiv = document.createElement("div");
    this._playerDiv.id = "player";
    this._el.append(this._playerDiv);

    // todo: use loadScript util
    this._scriptTag = document.createElement("script");
    this._scriptTag.src = "//www.youtube.com/iframe_api?controls=0";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode!.insertBefore(this._scriptTag, firstScriptTag);

    if (window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        window.youTubePlayer = new YT.Player("player", {
          height: "100%",
          width: "100%",
          videoId: this._getYouTubeVideoId(window.youTubeData.youTubeVideoId), // must be specified on init
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

  private _onPlayerReady(event) {
    const player = event.target;
    this.fire(BaseEvents.LOAD, { duration: player.getDuration() });
    this.set(window.youTubeData);
  }

  private _onPlayerStateChange(_event) {
    // const currentTime = this._player.getCurrentTime();
    // console.log(currentTime);
    // currentTimeInput.value = currentTime;
  }

  public set(data: YouTubeData): void {
    console.log(window.youTubePlayer);
    if (data.youTubeVideoId) {
      const videoId: string = this._getYouTubeVideoId(data.youTubeVideoId);
      // const currentVideoId: string = window.youTubePlayer.getVideoData().video_id;
      // if (videoId !== currentVideoId) {
      if (data.autoPlay) {
        window.youTubePlayer.loadVideoById(videoId);
      } else {
        window.youTubePlayer.cueVideoById(videoId);
      }
      // }
    }

    if (data.currentTime) {
      window.youTubePlayer.seekTo(data.currentTime, true);
    }
  }

  public exitFullScreen(): void {}

  public resize(): void {
    // this._playerDiv.style.width = this._el.clientWidth + "px";
    // this._playerDiv.style.height = this._el.clientHeight + "px";
  }

  public dispose(): void {
    console.log("dispose YouTubeContentHandler");
    this._el.innerHTML = "";
  }
}
