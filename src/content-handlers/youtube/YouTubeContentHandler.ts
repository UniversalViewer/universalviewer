import BaseContentHandler from "../../BaseContentHandler";
import { IUVOptions } from "../../UniversalViewer";
import { YouTubeData } from "./YouTubeData";
import { Events } from "../../Events";

interface Player {
  id: string;
  data: YouTubeData;
}

export default class YouTubeContentHandler extends BaseContentHandler<
  YouTubeData
> {
  private _playerDiv: HTMLDivElement;
  private _id: string;

  constructor(options: IUVOptions) {
    super(options);
    // console.log("create YouTubeContentHandler");
    this._init(this.options.data);
  }

  private _getYouTubeVideoId(id: string): string {
    if (id.indexOf("v=")) {
      id = id.split("v=")[1];
    }
    return id;
  }

  private _init(data: YouTubeData): void {
    if (!window.youTubePlayers) {
      window.youTubePlayers = [];
    }

    this._id = "YTPlayer-" + window.youTubePlayers.length;

    window.youTubePlayers.push({
      id: this._id,
      data: data,
    });

    if (!this._playerDiv) {
      this._playerDiv = document.createElement("div");
      this._playerDiv.id = this._id;
      this._el.append(this._playerDiv);
    }

    const existingScriptTag = document.getElementById("youtube-iframe-api");

    if (!existingScriptTag) {
      const scriptTag = document.createElement("script");
      scriptTag.id = "youtube-iframe-api";
      scriptTag.src = "//www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode!.insertBefore(scriptTag, firstScriptTag);
    }

    if (window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        for (const player of window.youTubePlayers as Player[]) {
          if (player.id === this._id) {
            window[this._id] = new YT.Player(this._id, {
              height: "100%",
              width: "100%",
              videoId: this._getYouTubeVideoId(player.data.youTubeVideoId!),
              playerVars: {
                playsinline: 1,
                enablejsapi: 1,
                controls: player.data.controls ? 1 : 0,
                showInfo: 0,
                // iv_load_policy: 3,
                modestbranding: 1,
                // start: 10,
                // end: 20,
              },
              events: {
                onReady: (event) => {
                  const YTPlayer = event.target;
                  const duration = YTPlayer.getDuration();
                  this.set(player.data);
                  this.hideSpinner();
                  this.fire(Events.CREATED);
                  this.fire(Events.LOAD, {
                    duration: duration,
                  });
                },
                onStateChange: (_event) => {
                  // const currentTime = this._player.getCurrentTime();
                  // console.log(currentTime);
                  // currentTimeInput.value = currentTime;
                },
              },
            });
          }
        }
      };
    }
  }

  public set(data: YouTubeData): void {
    const player = window[this._id];

    if (data.youTubeVideoId) {
      const videoId: string = this._getYouTubeVideoId(data.youTubeVideoId);

      if (data.autoPlay) {
        player.loadVideoById(videoId);
      } else {
        player.cueVideoById(videoId);
      }
    }

    if (data.currentTime) {
      player.seekTo(data.currentTime, true);
    }
  }

  public exitFullScreen(): void {}

  public resize(): void {
    this._playerDiv.style.width = this._el.clientWidth + "px";
    this._playerDiv.style.height = this._el.clientHeight + "px";
  }

  public dispose(): void {
    // console.log("dispose YouTubeContentHandler");
    this._el.innerHTML = "";
    // remove from window.youTubePlayers where hostId === this._id
    window.youTubePlayers = window.youTubePlayers.filter(
      (p) => p.id !== this._id
    );
    // remove classes
    this._el.className = "";
    this.adapter?.dispose();
  }
}
