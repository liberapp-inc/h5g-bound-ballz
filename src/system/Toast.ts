// @see https://github.com/idealx/egret-eui-modal/blob/master/src/components/Toast.ts

interface ToastOptions {
  text: string;
  delay: number;
  canHide: boolean;
}

const DefaultToastOptions : ToastOptions = {
  text: "",
  delay: 3000,
  canHide: false
}

class Toast extends GameObject  {
  private static I:Toast;

  update(){
  }

  public static show(poptions: Partial<ToastOptions>): void {
    const options : ToastOptions = { ...DefaultToastOptions, ... poptions };
    if (!this.I) {
      this.I = new Toast(Util.width * 0.6);
    }
    this.I.show(options);
  }

  onDestroy() {
    const i = Toast.I;
    Toast.I = undefined;
    if (!i) {
      return;
    }
    i.rect.parent.removeChild( i.rect );
    i.rect.removeChildren();
    i.rect = undefined;
    i.label = undefined;
  }

  private rect: eui.Rect;
  private label: eui.Label;
  private currentTween: egret.Tween;
  private currentOptions: ToastOptions;
  private queue: ToastOptions[] = [];

  private constructor(maxWidth:number) {
    super();

    this.rect = new eui.Rect();
    this.rect.alpha = 0;

    this.label = new eui.Label();
    this.label.maxWidth = maxWidth;

    this.rect.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onRectCreationComplete, this);
    this.label.addEventListener(eui.UIEvent.RESIZE, this.onLabelResized, this);
    GameObject.display.addChild(this.rect);    
  }

  public show(options:ToastOptions) : void {
    console.log(`Toast.show`);
    if (this.currentOptions) {
      if (this.currentOptions.canHide) {
        this.currentTween.setPaused(true);
        this.currentTween = undefined;
        this.currentOptions = undefined;
        this.queue = [];
      } else {
        this.queue.push(options);
        return;
      }
    }
    this.currentOptions = options;
    this.toastText = options.text;
    this.currentTween = egret.Tween.get(this.rect);
    this.currentTween.to({ alpha: 1 }, 300).wait(options.delay).call(this.onStartHide, this);
  }

  private onStartHide() {
    console.log(`Toast.onStartHide`);
    if (this.currentTween === undefined) {
      return;
    }
    this.currentTween = egret.Tween.get(this.rect);
    this.currentTween.to({ alpha: 0 }, 300).call(this.onCompleteHide,this);
  }

  private onCompleteHide() {
    console.log(`Toast.onCompleteHide`);
    this.currentTween = undefined;
    this.currentOptions = undefined;
    if (0 === this.queue.length) {
      this.destroy();
      return;
    } 
    const options = this.queue.shift();
    this.show(options);
  }

  protected onRectCreationComplete() {
    console.log(`Toast.onRectCreationComplete`);

    this.rect.fillColor = 0x000000;
    this.rect.fillAlpha = 0.6;
    this.rect.horizontalCenter = 0;
    this.rect.verticalCenter = 0;
    this.rect.ellipseWidth = 30;
    this.rect.ellipseHeight = 30;

    this.label.x = 20;
    this.label.y = 20;
    this.label.size = 28;
    this.rect.addChild(this.label);

    this.toastText = "";
  }

  set toastText(text: string) {
    console.log(`Toast.toastText:`);
    this.label.text = text;
  }

  private onLabelResized() {
    console.log(`Toast.onLabelResized:`);

    this.rect.width = this.label.width + 40;
    this.rect.height = this.label.height + 40;
    this.rect.x = (Util.width - this.rect.width)/2;
    this.rect.y = (Util.height - this.rect.height)/2;
  }
}
