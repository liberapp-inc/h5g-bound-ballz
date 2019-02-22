// Liberapp 2019 - Tahiti Katagai
// 狙って撃つ方向表示

class Aiming extends GameObject{

    padx:number;
    pady:number;

    // aim direction (unit vector)
    dir:number = 0; // まっすぐ上方向(0,-1)を０度とするラジアン

    constructor( padx:number, pady:number ) {
        super();
        
        this.padx = padx;
        this.pady = pady;

        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => this.touchBegin(e), this);
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, (e: egret.TouchEvent) => this.touchMove(e), this);
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_END, (e: egret.TouchEvent) => this.touchEnd(e), this);
    }

    onDestroy(){
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => this.touchBegin(e), this);
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, (e: egret.TouchEvent) => this.touchMove(e), this);
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_END, (e: egret.TouchEvent) => this.touchEnd(e), this);
    }

    setShape( x:number, y:number ){
        if( this.shape )
            GameObject.display.removeChild(this.shape);
/*
        // ボールを撃つ方向　ライン表示
        const lineLength = Util.height*0.5;
        let px = Paddle.I.shape.x;
        let py = Paddle.I.shape.y - Paddle.I.sizeH*0.5 - (BALL_SIZE_PER_WIDTH*Util.width*0.5);
        let vx = x - px;
        let vy = y - py;
        // 下の方をタッチすると反対方向を狙うように
        if( vy > 0 ){
            vy *= -1;
            vx *= -1;
        }
        this.dir = Util.clamp( Math.atan2( -vx, -vy ), -Math.PI*0.45, +Math.PI*0.45 );
        //console.log( this.dir );
        vx = -Math.sin( this.dir );
        vy = -Math.cos( this.dir );

        this.shape = new egret.Shape();
        this.shape.graphics.lineStyle(5, 0xc0c000);
        this.shape.graphics.moveTo(px, py);
        this.shape.graphics.lineTo(px + vx*lineLength, py + vy*lineLength);
        GameObject.display.addChild(this.shape);
*/
    }

    update() {
    }

    touchBegin(e:egret.TouchEvent){
        if( this.deleteFlag )
            return;
        this.setShape( e.localX, e.localY );
    }

    touchMove(e:egret.TouchEvent){
        if( this.deleteFlag )
            return;
        this.setShape( e.localX, e.localY );
    }

    touchEnd(e:egret.TouchEvent){
        if( this.deleteFlag )
            return;
        // shoot( this.dir );
        this.destroy();
    }
}
