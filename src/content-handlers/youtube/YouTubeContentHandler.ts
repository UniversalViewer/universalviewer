import { getUUID } from "../../Utils";
import BaseContentHandler from "../../BaseContentHandler";
import { BaseEvents } from "../../BaseEvents";
import { IUVOptions } from "../../UniversalViewer";
import { YouTubeData } from "./YouTubeData";

interface Player {
  videoId: string;
  hostId: string;
  duration?: number;
  data: YouTubeData;
}

export default class YouTubeContentHandler extends BaseContentHandler<
  YouTubeData
> {
  private _playerDiv: HTMLDivElement;
  private _id: string;

  constructor(options: IUVOptions) {
    super(options);
    console.log("create YouTubeContentHandler");
    this._init(this.options.data);
  }

  private _getYouTubeVideoId(id: string): string {
    if (id.indexOf("v=")) {
      id = id.split("v=")[1];
    }
    return id;
  }

  private _init(data: YouTubeData): void {
    console.log("init");

    if (!window.youTubePlayers) {
      window.youTubePlayers = [];
    }

    this._id = "YTPlayer-" + getUUID();

    const videoId = this._getYouTubeVideoId(data.youTubeVideoId!);
    let player = this._getPlayerById(videoId);

    if (!player) {
      player = {
        videoId: videoId,
        hostId: this._id,
        data: {
          ...data,
        },
      };
      window.youTubePlayers.push(player);
    }

    // mark as the current player in use
    // window.youTubePlayers.forEach((p: Player) => {
    //   p.current = p.videoId === videoId;
    // });

    if (!this._playerDiv) {
      this._playerDiv = document.createElement("div");
      this._playerDiv.id = this._id;
      this._el.append(this._playerDiv);
    }

    const existingScriptTab = document.getElementById("youtube-iframe-api");
    if (!existingScriptTab) {
      const scriptTag = document.createElement("script");
      scriptTag.id = "youtube-iframe-api";
      scriptTag.src = "//www.youtube.com/iframe_api?controls=0";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode!.insertBefore(scriptTag, firstScriptTag);
    }

    if (window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        for (const player of window.youTubePlayers as Player[]) {
          if (player.hostId === this._id) {
            window[this._id] = new YT.Player(this._id, {
              height: "100%",
              width: "100%",
              videoId: player.videoId,
              playerVars: {
                playsinline: 1,
              },
              events: {
                onReady: (event) => {
                  const YTPlayer = event.target;
                  const duration = YTPlayer.getDuration();
                  this.set(player.data);
                  this.fire(BaseEvents.LOAD, {
                    youTubeVideoId: player.data.youTubeVideoId,
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

  // private _onPlayerReady(event) {
  //   const player = event.target;
  //   this.fire(BaseEvents.LOAD, { duration: player.getDuration() });
  //   this.set(window.youTubeData);
  // }

  // private _onPlayerStateChange(_event) {
  // const currentTime = this._player.getCurrentTime();
  // console.log(currentTime);
  // currentTimeInput.value = currentTime;
  // }

  private _getPlayerById(videoId: string): Player {
    return window.youTubePlayers.find((p) => p.id === videoId);
  }

  // private _getCurrentPlayer(): Player {
  //   return window.youTubePlayers.find((p) => p.current);
  // }

  public set(data: YouTubeData): void {
    const player = window[this._id];

    if (data.youTubeVideoId) {
      const videoId: string = this._getYouTubeVideoId(data.youTubeVideoId);
      // this._init(data);
      // const player = this._getCurrentPlayer();

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
    // this._playerDiv.style.width = this._el.clientWidth + "px";
    // this._playerDiv.style.height = this._el.clientHeight + "px";
  }

  public dispose(): void {
    console.log("dispose YouTubeContentHandler");
    this._el.innerHTML = "";
    // todo: remove from window.youTubePlayers where hostId === this._uuid
  }
}
