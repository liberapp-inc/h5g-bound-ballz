// Liberapp 2019 - Tahiti Katagai
// ゲームで便利に使えるUtilityクラス

class Util{

    public static height: number;
    public static width: number;

    static init( eui:eui.UILayer ) {
        this.height = eui.stage.stageHeight;
        this.width  = eui.stage.stageWidth;
    }

    static random(min:number, max:number):number {
        return min + Math.random() * (max - min);
    }

    static randomInt(min:number, max:number):number {
        min = Math.floor(min);
        max = Math.floor(max)+0.999;
        return Math.floor( min + Math.random() * (max - min) );
    }

    static clamp(value:number, min:number, max:number):number {
        if( value < min ) value = min;
        if( value > max ) value = max;
        return value;
    }

    static color( r:number, g:number, b:number):number {
        return ( Math.floor(r * 0xff)*0x010000 + Math.floor(g * 0xff)*0x0100 + Math.floor(b * 0xff) );
    }

    static colorLerp( c0:number, c1:number, rate01:number):number {
        let rate10 = 1 - rate01;
        let color = 
            ( ((c0&0xff0000) * rate10 + (c1&0xff0000) * rate01) & 0xff0000 ) +
            ( ((c0&0xff00) * rate10 + (c1&0xff00) * rate01) & 0xff00 ) +
            ( ((c0&0xff) * rate10 + (c1&0xff) * rate01) & 0xff );
        return color;
    }

    static newTextField(text:string, size:number, color:number, xRatio:number, yRatio:number, bold:boolean): egret.TextField {
        let tf = new egret.TextField();
        tf.text = text;
        tf.bold = bold;
        tf.size = size;
        tf.textColor = color;
        tf.x = (Util.width  - tf.width)  * xRatio;
        tf.y = (Util.height - tf.height) * yRatio;
        return tf;
    }
}

