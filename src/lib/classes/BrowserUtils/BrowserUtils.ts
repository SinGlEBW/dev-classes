export type BrowserPlatforms_OR = 'iOS/Mac' | 'iOS' | 'Android' | 'Windows' | 'Mac' | 'Linux' | 'unknown'

export class BrowserUtils {
  static getWebPlatform = ():BrowserPlatforms_OR => {
 
    const ua = navigator.userAgent;
    const platform = navigator?.platform;

    if (platform) {
      const lowerPlatform = platform.toLowerCase();
      if (lowerPlatform.includes("mac")) return "iOS/Mac";
      if (lowerPlatform.includes("win")) return "Windows";
      if (lowerPlatform.includes("linux")) return "Linux";
    }

    if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
    if (/Android/.test(ua)) return "Android";
    if (/Windows/.test(ua)) return "Windows";
    if (/Mac/.test(ua)) return "Mac";
    if (/Linux/.test(ua)) return "Linux";

    return "unknown";
  }

  static initEventsPauseResume(cbInfo: (status: "on" | "off") => void) {
    const platform = BrowserUtils.getWebPlatform();
    if(platform == 'iOS'){
      document.addEventListener('active', (e) => {
        console.log('Событие: active :', e);
        cbInfo('on');
      });
      document.addEventListener('resign', (e) => {
        console.log("Событие: resign: ", e);
        cbInfo('off');
      });
      return;
    }
    document.addEventListener("resume", (e) => {
      console.log("Событие: resume: ", e);
      cbInfo("on");
    });

    document.addEventListener("pause", (e) => {
      console.log("Событие: pause :", e);
      cbInfo("off");
    });
  }
}
