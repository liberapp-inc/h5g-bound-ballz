class Sdk {
  private static env: "production" | "staging" | "development" | "egret-wing";
  private static baseUrls = {
    production: "https://liberapp.net",
    staging: "https://staging.liberapp.net",
    development: "https://localhost",
    "egret-wing": "https://staging.liberapp.net",
  };

  /// 違うバージョンのSDKを読み込むときは書き換えてください
  private static sdkPath = "/dist/sdk/liberapp-ja-0_9.js";

  /**
   * SDKを読み込みます
   */
  static async loadSdk(): Promise<any> {
    console.log("============================================================");
    console.log("Liberapp.loadSdk:");
    this.env = this.detectMode(location.origin);
    console.log("env: ", this.env);
    const srcUrl = this.resolveSdkUrl(this.sdkPath);
    console.log("srcUrl: ", srcUrl);
    const script = await this.loadScript(srcUrl);
    console.log("script:", script);
    const liberappSdk = window["LiberappSdk"];
    if (this.env === "egret-wing") {
      await liberappSdk.enableDebug();
    }
    console.log("liberappSdk:", liberappSdk);
    return liberappSdk;
  }

  /** @internal */
  private static detectMode(
    origin: string
  ): "production" | "staging" | "development" | "egret-wing" {
    if (/^https:\/\/(.+)\.a\.liberapp\.net$/.test(origin)) {
      return "production";
    }
    if (/^https:\/\/(.+)\.a\.staging.\.liberapp\.net$/.test(origin)) {
      return "staging";
    }
    if (/^https:\/\/(.+)\.a\.development\.liberapp\.net$/.test(origin)) {
      return "development";
    }
    return "egret-wing";
  }

  /** @internal */
  private static resolveSdkUrl(path: string): string {
    const baseUrl = this.baseUrls[this.env];
    return `${baseUrl}${path}`;
  }

  /** @internal */
  private static async loadScript(srcUrl: string): Promise<HTMLScriptElement> {
    return new Promise<HTMLScriptElement>((resolve, reject) => {
      const script = document.createElement("script");
      script.async = false;
      script.src = srcUrl;
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Can not load script: src:${srcUrl}`));
      (document.head as any).append(script);
    });
  }
}
