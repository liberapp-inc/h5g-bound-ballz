// Liberapp 2019 - Tahiti Katagai
// 狙って撃つ方向表示　ゲーム展開

class Aiming extends GameObject{

    static I:Aiming = null;

    readonly x:number;
    readonly y:number;
    readonly ballSpeed;

    readonly lineColor:number = 0x0080ff;
    dir:number = 0;     // 真下方向(0,1)を０度とするラジアン
    ballCount:number = 2;
    interval:number = 0;
    rowCount:number = 0;
    state:()=>void = this.stateWave;
    step:number = 0;
    textGuide:egret.TextField = null;
    textBalls:egret.TextField = null;

    constructor() {
        super();
        
        Aiming.I = this;
        this.x = Util.width  * 0.5;
        this.y = Util.height * 0.1;
        this.ballSpeed = BALL_RADIUS_PER_WIDTH * Util.width * 0.75;

        this.textGuide = Util.newTextField("スワイプでねらって\nボールをおとせ！", Util.width / 18, 0x0080ff, 0.5, 0.3, true);
        this.textBalls = Util.newTextField("x"+this.ballCount, Util.width / 22, 0x0080ff, 0.55, 0.08, true);
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
        if( this.textBalls ){
            GameObject.display.removeChild(this.textBalls);
            this.textBalls = null;
        }
        Aiming.I = null;
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
        let rate = (this.step & 15) / 16;
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
    }

    stateWave(){
        Score.I.combo = 0;
        
        // Generate new targets
        this.rowCount++;
        let delta = Util.clamp( 1 - this.rowCount / 30, 0.45, 1.0 );
        let y = Util.height * (1+TARGET_RADIUS_PER_WIDTH);
        let maxHp = Math.min( this.rowCount + 2, Target.maxHp );
        let ratio = delta * Util.random( 0, 1 );
        while( true ){
            if( ratio > 1 )
                break;
            let x = Util.width * ( TARGET_RADIUS_PER_WIDTH + ratio * (1 - TARGET_SIZE_PER_WIDTH) );
            if( Util.randomInt(0, 5) != 0 ){
                new Target( x, y, Util.randomInt( Math.max(1,maxHp * 0.33), maxHp ) );
            }else{
                new Item( x, y );
            }
            ratio += delta * Util.random( 1-0.5, 1+0.5 );
        }
        this.state = this.stateScroll;
        this.step = 0;
    }

    stateScroll(){
        this.step++;
        const frames = 30;
        const scrollHeight = TARGET_SIZE_PER_WIDTH * Util.width * -1.25;
        const delta = scrollHeight / frames * Math.sin(Math.PI * this.step/30) * Math.PI/2;

        let isGameOver = 
        Target.scrollUp( delta );
        Item.scrollUp( delta );

        if( this.step >= 30 ) {
            if( isGameOver ){
                new GameOver();
                this.state = this.stateGameOver;
                return;
            }
            if( this.rowCount < 3 ) {
                this.state = this.stateWave;
            }else{
                this.state = this.stateAim;
            }
        }
    }

    stateAim(){
        this.step++;
        this.setShape();
    }

    stateBound(){
        this.interval++;
        // ボールを撃つ（弾数分を連射）
        if( this.interval / 15 <= this.ballCount ) {
            if( (this.interval % 15) == 0 ){
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

    stateGameOver(){}

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
        if( this.ballCount < 9 ){
            this.ballCount++;
        }else{
            Score.I.point += 1;
        }
        this.textBalls.text = "x" + this.ballCount;
    }
}
