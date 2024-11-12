import BaseContentHandler, { EventListener } from "../../BaseContentHandler";
import { IUVOptions } from "../../UniversalViewer";
import { YouTubeData } from "./YouTubeData";
import { Events } from "../../Events";
import { YouTubeEvents } from "./YouTubeEvents";
import { UVAdapter } from "@/UVAdapter";

interface Player {
  id: string;
  data: YouTubeData;
  ref: YouTubeContentHandler;
}

interface YouTubeConfig {
  controls?: boolean;
}

export default class YouTubeContentHandler extends BaseContentHandler<YouTubeData> {
  private _id: string;
  public config: YouTubeConfig;

  constructor(
    public options: IUVOptions,
    public adapter?: UVAdapter,
    eventListeners?: EventListener[]
  ) {
    super(options, adapter, eventListeners);
    // console.log("create YouTubeContentHandler");
    this._init(this.options.data);
  }

  private _getYouTubeVideoId(id: string): string {
    if (id.indexOf("v=")) {
      id = id.split("v=")[1];
    }
    return id;
  }

  private async _init(data: YouTubeData): Promise<void> {
    if (!window.youTubePlayers) {
      window.youTubePlayers = [];
    }

    this._id = "YTPlayer-" + new Date().getTime();

    window.youTubePlayers.push({
      id: this._id,
      data: data,
      ref: this,
    });

    this._el.id = this._id;

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
          player.ref
            .configure({
              // default config
              controls: true,
            })
            .then((config: YouTubeConfig) => {
              window[player.id] = new YT.Player(player.id, {
                height: "100%",
                width: "100%",
                videoId: this._getYouTubeVideoId(player.data.youTubeVideoId!),
                playerVars: {
                  playsinline: 1,
                  enablejsapi: 1,
                  controls: config.controls ? 1 : 0,
                  showInfo: 0,
                  rel: 0,
                  // iv_load_policy: 3,
                  modestbranding: 1,
                  // start: 10,
                  // end: 20,
                },
                events: {
                  onReady: (event) => {
                    const YTPlayer = event.target;
                    const id = YTPlayer.getIframe().id;
                    // const duration = YTPlayer.getDuration();

                    // get the ref to the associated content handler
                    const handler: Player = window.youTubePlayers.find(
                      (p) => p.id === id
                    );

                    if (handler) {
                      handler.ref.config = config;
                      handler.ref.set(player.data);
                      handler.ref.fire(Events.CREATED);
                      // handler.ref.fire(Events.LOAD, {
                      //   duration: duration,
                      // });
                    }
                  },
                  onStateChange: (event) => {
                    const YTPlayer = event.target;
                    const id = YTPlayer.getIframe().id;
                    const duration = YTPlayer.getDuration();

                    // get the ref to the associated content handler
                    const handler: Player = window.youTubePlayers.find(
                      (p) => p.id === id
                    );

                    if (handler) {
                      switch (event.data) {
                        case -1:
                          handler.ref.fire(YouTubeEvents.UNSTARTED);
                          handler.ref.fire(Events.LOAD, {
                            player: YTPlayer,
                            duration: duration,
                          });
                          break;
                        case 0:
                          handler.ref.fire(YouTubeEvents.ENDED);
                          break;
                        case 1:
                          handler.ref.fire(YouTubeEvents.PLAYING);
                          break;
                        case 2:
                          handler.ref.fire(YouTubeEvents.PAUSED);
                          break;
                        case 3:
                          handler.ref.fire(YouTubeEvents.BUFFERING);
                          break;
                        case 5:
                          handler.ref.fire(YouTubeEvents.CUED);
                          break;
                      }
                    }
                    // const currentTime = this._player.getCurrentTime();
                    // console.log(currentTime);
                    // currentTimeInput.value = currentTime;
                  },
                },
              });
            });
        }
      };
    }
  }

  // public async configure(config: any): Promise<any> {
  //   config = await super.configure(config);
  //   return config;
  // }

  public set(data: YouTubeData): void {
    const player = window[this._id];

    if (data.muted) {
      player.mute();
    } else {
      player.unMute();
    }

    if (data.youTubeVideoId) {
      const videoId: string = this._getYouTubeVideoId(data.youTubeVideoId);

      if (data.autoPlay) {
        if (data.duration) {
          player.loadVideoById({
            videoId: videoId,
            startSeconds: data.duration[0],
            endSeconds: data.duration[1],
          });
        } else {
          player.loadVideoById(videoId);
        }
      } else {
        if (data.duration) {
          player.cueVideoById({
            videoId: videoId,
            startSeconds: data.duration[0],
            endSeconds: data.duration[1],
          });
        } else {
          player.cueVideoById(videoId);
        }
      }
    }

    if (data.currentTime) {
      player.seekTo(data.currentTime, true);
    }
  }

  public exitFullScreen(): void {}

  public resize(): void {
    const width = this._el.clientWidth + "px";
    const height = this._el.clientHeight + "px";
    this._el.style.width = width;
    this._el.style.height = height;
  }

  public dispose(): void {
    // console.log("dispose YouTubeContentHandler");
    super.dispose();
    // remove from window.youTubePlayers where hostId === this._id
    window.youTubePlayers = window.youTubePlayers.filter(
      (p) => p.id !== this._id
    );
  }
}
