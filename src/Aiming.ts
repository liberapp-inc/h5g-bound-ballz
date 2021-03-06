// Liberapp 2019 - Tahiti Katagai
// 狙って撃つ方向表示　ゲーム展開

class Aiming extends GameObject{

    static I:Aiming = null;

    readonly x:number;
    readonly y:number;
    readonly ballSpeed;

    readonly lineColor:number = 0x0080ff;
    dir:number = 0;     // 真下方向(0,1)を０度とするラジアン
    readonly ballMax:number = 9;
    ballCount:number = 2;
    interval:number = 0;
    rowCount:number = 0;
    state:()=>void = this.stateWave;
    step:number = 60*2;
    shapeLine:egret.Shape = null;
    textGuide:egret.TextField = null;
    textBalls:egret.TextField = null;

    constructor() {
        super();
        
        Aiming.I = this;
        this.x = Util.width  * 0.5;
        this.y = Util.height * 0.1;
        this.ballSpeed = BALL_RADIUS_PER_WIDTH * Util.width * 0.75;

        this.shapeLine = new egret.Shape();
        this.shapeLine.graphics.beginFill(0x00c0ff);
        this.shapeLine.graphics.drawCircle( this.x, this.y, BALL_RADIUS_PER_WIDTH * Util.width * 0.75);
        this.shapeLine.graphics.endFill();
        this.shapeLine.graphics.lineStyle(5, 0x808090);
        this.shapeLine.graphics.moveTo( 0, this.y );
        this.shapeLine.graphics.lineTo( Util.width * 0.45, this.y );
        this.shapeLine.graphics.moveTo( Util.width * 0.55, this.y );
        this.shapeLine.graphics.lineTo( Util.width, this.y );
        GameObject.display.addChild(this.shapeLine);

        this.textGuide = Util.newTextField("スワイプでねらって\nボールをおとせ！", Util.width / 18, 0x0080ff, 0.5, 0.3, true);
        this.textBalls = Util.newTextField("x"+this.ballCount, Util.width / 22, 0x0080ff, 0.55, 0.06, true);
        GameObject.display.addChild(this.textGuide);
        GameObject.display.addChild(this.textBalls);

        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.onTapToStart(), this);
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => this.touchBegin(e), this);
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, (e: egret.TouchEvent) => this.touchMove(e), this);
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_END, (e: egret.TouchEvent) => this.touchEnd(e), this);
    }

    onDestroy(){
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, () => this.onTapToStart(), this);
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => this.touchBegin(e), this);
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, (e: egret.TouchEvent) => this.touchMove(e), this);
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_END, (e: egret.TouchEvent) => this.touchEnd(e), this);
        if( this.shapeLine ){
            GameObject.display.removeChild(this.shapeLine);
            this.shapeLine = null;
        }
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
        if( this.shape == null ){
            this.shape = new egret.Shape();
            GameObject.display.addChild(this.shape);
        }else{
            this.shape.graphics.clear();
        }
        
        // 点線 dot line
        let rate = (this.step & 15) / 16;
        let px = this.x;
        let py = this.y;
        let vx = Math.sin( this.dir ) * this.ballSpeed;
        let vy = Math.cos( this.dir ) * this.ballSpeed;
        let radius = BALL_RADIUS_PER_WIDTH * Util.width;
        
        this.shape.graphics.lineStyle(5 * rate, this.lineColor);
        px += vx * rate;
        py += vy * rate;
        vx *= 1 - 0.01*rate;
        vy *= 1 - 0.01*rate;
        vy += radius * 0.01 * rate;
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

        this.shape.graphics.lineStyle(5*(1-rate), this.lineColor);
        px += vx;
        py += vy;
        vx *= 0.99;
        vy *= 0.99;
        vy += radius * 0.01;
        this.shape.graphics.drawCircle( px, py, radius * 0.02 );
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

    stateNone(){}

    stateWave(){
        if( this.step > 0 ){
            this.step--;
            return;
        }

        Score.I.combo = 0;
        
        // ターゲット生成 Generate new targets
        this.rowCount++;
        let delta = Util.clamp( 1 - this.rowCount / 30, 0.45, 1.0 );
        let y = Util.height + TARGET_RADIUS_PER_WIDTH * Util.width;
        let maxHp = Math.min( this.rowCount*0.75+1, Target.maxHp );
        let ratio = delta * Util.random( 0, 1 );
        while( ratio < 1 ){
            let x = Util.width * ( TARGET_RADIUS_PER_WIDTH + ratio * (1 - TARGET_SIZE_PER_WIDTH) );
            if( this.ballCount < this.ballMax && Util.randomInt(0, 3) == 2 ){
                new Item( x, y );
            }else{
                new Target( x, y, Util.randomInt( Math.max(1, maxHp*0.33), maxHp ) );
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

        Target.scrollUp( delta );
        Item.scrollUp( delta );

        if( this.step >= 30 ) {
            let isOver = false;
            Target.targets.forEach( target => {
                if( target.shape.y - target.radius < Aiming.I.y ) isOver = true;
            });
            if( isOver ){
                new GameOver();
                this.state = this.stateNone;
                return;
            }

            if( this.rowCount < 3 ) {
                this.state = this.stateWave;
                this.step = 0;
            }else if( this.textGuide ){
                this.state = this.stateNone;
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
                this.step = 0;
            }
        }
    }

    onTapToStart(){
        if( this.textGuide ){
            GameObject.display.removeChild(this.textGuide);
            this.textGuide = null;
            if( this.state == this.stateNone )
                this.state = this.stateAim;
        }
    }

    touchBegin(e:egret.TouchEvent){
        if( this.state != this.stateAim )
            return;
        this.setDir( e.localX, e.localY );
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
        if( this.ballCount < this.ballMax ){
            this.ballCount++;
        }else{
            Score.I.addPoint( 1 );
        }
        this.textBalls.text = "x" + this.ballCount;
    }
}
