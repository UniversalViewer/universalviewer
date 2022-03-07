import BaseContentHandler from "../../BaseContentHandler";
import { IUVOptions } from "../../UniversalViewer";
import { YouTubeData } from "./YouTubeData";
import { Events } from "../../Events";
const merge = require("lodash/merge");

interface Player {
  id: string;
  data: YouTubeData;
  ref: any;
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
          player.ref.configure(player.data).then((config) => {
            window[player.id] = new YT.Player(player.id, {
              height: "100%",
              width: "100%",
              videoId: this._getYouTubeVideoId(player.data.youTubeVideoId!),
              playerVars: {
                playsinline: 1,
                enablejsapi: 1,
                controls: config.options?.youtube?.controls ? 1 : 0,
                showInfo: 0,
                // iv_load_policy: 3,
                modestbranding: 1,
                // start: 10,
                // end: 20,
              },
              events: {
                onReady: (event) => {
                  const YTPlayer = event.target;
                  const id = YTPlayer.getIframe().id;
                  const duration = YTPlayer.getDuration();

                  // get the ref to the associated content handler
                  const handler: Player = window.youTubePlayers.find(
                    (p) => p.id === id
                  );

                  if (handler) {
                    // handler.ref.configure(player.data);
                    handler.ref.set(player.data);
                    handler.ref.fire(Events.CREATED);
                    handler.ref.fire(Events.LOAD, {
                      duration: duration,
                    });
                  }
                },
                onStateChange: (_event) => {
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

  public async configure(data: any): Promise<any> {
    let promises: Promise<any>[] = [] as any;

    // default config
    let config = {
      options: {
        youtube: {
          controls: true,
        },
      },
    };

    this.fire(Events.CONFIGURE, {
      config,
      cb: (promise) => {
        promises.push(promise);
      },
    });

    if (promises.length) {
      const configs = await Promise.all(promises);

      const mergedConfigs = configs.reduce((previous, current) => {
        return merge(previous, current);
      });

      config = merge(config, mergedConfigs);
    }

    return config;
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
    const width = this._el.clientWidth + "px";
    const height = this._el.clientHeight + "px";
    this._playerDiv.style.width = width;
    this._playerDiv.style.height = height;
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
