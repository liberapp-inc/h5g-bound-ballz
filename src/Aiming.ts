// Liberapp 2019 - Tahiti Katagai
// 狙って撃つ方向表示

class Aiming extends GameObject{

    x:number;
    y:number;
    
    readonly ballSpeed;
    dir:number = 0;         // 真下方向(0,1)を０度とするラジアン
    frame:number = 0;
    readonly lineColor:number = 0x0080ff;
    ballCount:number = 4;
    interval:number = 0;
    rowCount:number = 0;
    state:()=>void = this.stateWave;
    textGuide:egret.TextField = null;
    textBalls:egret.TextField = null;

    constructor() {
        super();
        
        this.x = Util.width  * 0.5;
        this.y = Util.height * 0.1;
        this.ballSpeed = BALL_RADIUS_PER_WIDTH * Util.width * 0.75;

        for( let i=0 ; i<2 ; i++ ) this.generateTargets();

        this.textGuide = Util.newTextField("スワイプでねらって\nボールをおとせ！", Util.width / 18, 0x0080ff, 0.5, 0.3, true);
        this.textBalls = Util.newTextField("x2", Util.width / 22, 0x0080ff, 0.55, 0.08, true);
        GameObject.display.addChild(this.textGuide);
        GameObject.display.addChild(this.textBalls);

        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => this.touchBegin(e), this);
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, (e: egret.TouchEvent) => this.touchMove(e), this);
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_END, (e: egret.TouchEvent) => this.touchEnd(e), this);
    }

    onDestroy(){
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => this.touchBegin(e), this);
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, (e: egret.TouchEvent) => this.touchMove(e), this);
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_END, (e: egret.TouchEvent) => this.touchEnd(e), this);
        if( this.textGuide ){
            GameObject.display.removeChild(this.textGuide);
            this.textGuide = null;
        }
    }

    setShape(){
        if( this.shape )
            GameObject.display.removeChild(this.shape);
        
        // 点線
        this.shape = new egret.Shape();
        let px = this.x;
        let py = this.y;
        let vx = Math.sin( this.dir ) * this.ballSpeed;
        let vy = Math.cos( this.dir ) * this.ballSpeed;
        let radius = BALL_RADIUS_PER_WIDTH * Util.width;
        let rate = (this.frame & 15) / 16;
        px += vx * rate;
        py += vy * rate;
        vx *= 1 - 0.01*rate;
        vy *= 1 - 0.01*rate;
        vy += radius * 0.01 * rate;
        this.shape.graphics.lineStyle(5 * rate, this.lineColor);
        this.shape.graphics.drawCircle( px, py, radius * 0.02 );

        this.shape.graphics.lineStyle(5, this.lineColor);
        for( let i=0 ; i<20 ; i++ ){
            px += vx;
            py += vy;
            vx *= 0.99;
            vy *= 0.99;
            vy += radius * 0.01;
            this.shape.graphics.drawCircle( px, py, radius * 0.02 );
        }
        px += vx;
        py += vy;
        vx *= 0.99;
        vy *= 0.99;
        vy += radius * 0.01;
        this.shape.graphics.lineStyle(5*(1-rate), this.lineColor);
        this.shape.graphics.drawCircle( px, py, radius * 0.02 );
        GameObject.display.addChild(this.shape);
    }

    setDir( x:number, y:number ) {
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
    }

    update() {
        this.state();
        this.frame++;
    }

    stateWave(){
        Score.I.combo = 0;
        this.generateTargets();
        this.state = this.stateAim;
    }

    generateTargets(){
        // scroll up
        Target.targets.forEach( target => {
            target.shape.y -= TARGET_SIZE_PER_WIDTH * Util.width * 1.25;
        });

        // Generate new targets
        this.rowCount++;
        let ratio = 0;
        let delta = Util.clamp( 1 - this.rowCount / 20, 0.5, 1.0 );
        let y = Util.height * (1-TARGET_RADIUS_PER_WIDTH);
        let maxHp = Math.min( this.rowCount, Target.maxHp );

        ratio += delta * Util.random( 0, 1 );
        while( true ){
            if( ratio > 1 )
                break;
            let x = Util.width * ( TARGET_RADIUS_PER_WIDTH + ratio * (1 - TARGET_SIZE_PER_WIDTH) );
            new Target( x, y, Util.randomInt( Math.max(1,maxHp * 0.33), maxHp ) );
            ratio += delta * Util.random( 1-0.5, 1+0.5 );
        }
    }

    stateAim(){
        this.setShape();
    }

    stateBound(){
        this.interval++;
        // ボールを撃つ（弾数分を連射）
        if( this.interval / 10 <= this.ballCount ) {
            if( (this.interval % 10) == 0 ){
                new Ball( this.x, this.y, Math.sin(this.dir) * this.ballSpeed, Math.cos(this.dir) * this.ballSpeed );
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
        this.setDir( e.localX, e.localY );
        if( this.textGuide ){
            GameObject.display.removeChild(this.textGuide);
            this.textGuide = null;
        }
    }

    touchMove(e:egret.TouchEvent){
        if( this.state != this.stateAim )
            return;
        this.setDir( e.localX, e.localY );
    }

    touchEnd(e:egret.TouchEvent){
        if( this.state != this.stateAim )
            return;
        
        // shoot( this.dir );
        this.state = this.stateBound;
        this.interval = 0;
    }

    addBall(){
        this.ballCount++;
        this.textBalls.text = "x" + this.ballCount;
    }
}
