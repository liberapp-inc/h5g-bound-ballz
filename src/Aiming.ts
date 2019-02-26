// Liberapp 2019 - Tahiti Katagai
// 狙って撃つ方向表示

class Aiming extends GameObject{

    x:number;
    y:number;
    dir:number = 0;         // 真下方向(0,1)を０度とするラジアン
    ballCount:number = 4;
    interval:number = 0;
    rowCount:number = 0;
    state:()=>void = this.stateWave;

    constructor() {
        super();
        
        this.x = Util.width  * 0.5;
        this.y = Util.height * 0.1;

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
        if( this.shape ){
            GameObject.display.removeChild(this.shape);
            this.shape = null;
        }
        
        // ボールを撃つ方向　ライン表示
        let px = this.x;
        let py = this.y;
        let vx = x - px;
        let vy = y - py;
        if( vy < 0 ){
            vy = 0;
        }
        
        this.dir = Util.clamp( Math.atan2( vx, vy ), -Math.PI*0.45, +Math.PI*0.45 );
        //console.log( this.dir );
        vx = Math.sin( this.dir );
        vy = Math.cos( this.dir );

        this.shape = new egret.Shape();
        this.shape.graphics.lineStyle(5, 0x800000);
        this.shape.graphics.moveTo(px, py);
        const lineLength = Util.height*0.3;
        this.shape.graphics.lineTo(px + vx*lineLength, py + vy*lineLength);
        GameObject.display.addChild(this.shape);
    }

    update() {
        this.state();
    }

    stateWave(){
        Score.I.combo = 0;

        // scroll up
        Target.targets.forEach( target => {
            target.shape.y -= TARGET_SIZE_PER_WIDTH * Util.width;
        });

        // Generate new targets
        this.rowCount++;
        let ratio = 0;
        let delta = Util.clamp( 1 - this.rowCount / 20, 0.25, 1.0 );
        let y = Util.height * (1-TARGET_RADIUS_PER_WIDTH);
        let maxHp = Math.min( this.rowCount, Target.maxHp );

        ratio += delta * Util.random( 0, 1 );
        while( true ){
            if( ratio > 1 )
                break;
            let x = Util.width * ( TARGET_RADIUS_PER_WIDTH + ratio * (1 - TARGET_SIZE_PER_WIDTH) );
            new Target( x, y, Util.randomInt( maxHp * 0.33, maxHp ) );
            ratio += delta * ( 1 + Util.random( -0.5, 0.5 ) );
        }
        this.state = this.stateAim;
    }

    stateAim(){
        
    }

    stateBound(){
        this.interval++;
        // ボールを撃つ（弾数分を連射）
        if( this.interval / 10 <= this.ballCount ) {
            if( (this.interval % 10) == 0 ){
                const speed = BALL_RADIUS_PER_WIDTH * Util.width;
                new Ball( this.x, this.y, Math.sin(this.dir) * speed, Math.cos(this.dir) * speed );
            }
        }
        else{
            // すべてのボールが消えたら次へ
            if( Ball.balls.length == 0 ) {
                this.state = this.stateWave;
            }
        }
    }

    touchBegin(e:egret.TouchEvent){
        if( this.state != this.stateAim )
            return;
        this.setShape( e.localX, e.localY );
    }

    touchMove(e:egret.TouchEvent){
        if( this.state != this.stateAim )
            return;
        this.setShape( e.localX, e.localY );
    }

    touchEnd(e:egret.TouchEvent){
        if( this.state != this.stateAim )
            return;
        
        // shoot( this.dir );
        this.state = this.stateBound;
        this.interval = 0;
    }
}
