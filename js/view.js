/**
 *         ▂▃╬▄▄▃▂▁▁
 *  ●●●█〓██████████████▇▇▇▅▅▅▅▅▅▅▅▅▇▅▅          BUG
 *  ▄▅████☆RED █ WOLF☆██▄▄▃▂
 *  ████████████████████████████
 *  ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤
 *
 * 游戏UI图像类
 * @author 路漫漫
 * @link ahmerry@qq.com
 * @version
 * v2017/11/3 12:40 初版
 */
"use strict";
/**
 * UI之间的交互通过事件来完成，包括两个方向上的事件：
 * 来自UI元素的事件，例如点击了一个按钮
 * 来自游戏逻辑的事件，例如一波攻击已经结束
 * @type {void|*}
 */
class View
{
    constructor(width, height) {
        this.running = false;
        this.visuals = [];
        this.background = undefined;
        this.width = width || 300;
        this.height = height || 200;
        this.mazeSize = new Size(24,24);
    }

    pause() {
        this.running = false;
    }
    add(visual) {
        if (Array.isArray(visual)) {
            for (let i = 0, n = visual.length; i < n; ++i){
                this.visuals.push(visual[i]);
            }
        } else{
            this.visuals.push(visual);
        }
        this.visuals.sort(function(a, b) {
            return a.z - b.z;
        });
    }
    remove(visual) {
        let index = this.visuals.indexOf(visual);
        this.visuals.splice(index, 1);
    }
    draw() {
        this.drawBackground();
        this.drawSpawn();
        this.drawHome();
        if (this.showGrid){
            this.drawGrid();
            // this.drawGridNum();
        }
        for (let i = 0, n = this.visuals.length; i < n; ++i)
            this.drawVisual(this.visuals[i]);
    }
    drawBackground() {}
    drawGrid() {}
    drawGridNum() {}
    drawHome() {}
    drawSpawn() {}
    drawVisual(element) {}
}

class CanvasView extends View
{
    constructor(element) {
        super(element.width, element.height);
        this.showGrid = true;
        this.view = element;
        this.context = element.getContext('2d');
    }
    /**
     * 该方法现在废弃
     */
    start() {
        let me = this;
        me.draw();
        me.running = true;
        let render = function() {
            if (me.running)
                window._requestAnimFrame(render);
            me.draw();
        };
        window._requestAnimFrame(render);
    }
    /**
     * 绘制img到canvas
     * @param element
     */
    drawVisual(element) {
        let ctx = this.context;
        let visual = element.visual;
        //即将绘制的图片区域
        let sx = visual.index * visual.width;
        let sy = 0;
        if(visual.length !== 1){
            sy = visual.height * visual.direction;
        }
        this.wo = ~~(this.width / this.mazeSize.width);
        this.ho = ~~(this.height / this.mazeSize.height);
        //该单元格在地图的坐标
        let dx = element.mazeCoordinates.x * this.wo;
        let dy = element.mazeCoordinates.y * this.ho;
        //计算图片比例
        let imgScaleW = visual.width / visual.height;
        let scaleW = 1 < imgScaleW ? 1 : imgScaleW;
        let imgScaleH = visual.height / visual.width;
        let scaleH = 1 < imgScaleH ? 1 : imgScaleH;
        //计算缩放后的大小
        let w = visual.scale * this.wo * scaleW;
        let h = visual.scale * this.ho * scaleH;
        //修正坐标
        dx += (this.wo - w)>>1;
        dy += (this.ho - h)>>1;
        ctx.drawImage(visual.image, sx, sy, visual.width, visual.height, dx, dy, w, h);
        //绘制单位个性元素，血条，塔可以考虑升级的玩意
        element.draw(ctx, dx, dy, w, h);
    }
    /**
     * 绘制游戏背景
     */
    drawBackground() {
        let ctx = this.context;
        if (this.background) {
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.fillStyle = ctx.drawImage(this.background, 0, 0, this.width, this.height);
            // ctx.fillRect(0, 0, this.width, this.height);
        } else {
            //绘制纯色背景
            //ctx.clearRect(0, 0, this.width, this.height);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, this.width, this.height);
        }
    }
    //敌人终点
    drawHome() {
        let ctx = this.context;
        let width = this.width / this.mazeSize.width;
        let x = (this.mazeSize.width - 1) * width;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.fillRect(x, 0, width, this.height);
    }
    //敌人起点
    drawSpawn() {
        let ctx = this.context;
        let x = 0;
        let y = ~~(this.mazeSize.height * 0.5) * this.height / this.mazeSize.height;
        let width = this.width / this.mazeSize.width;
        let height = this.height / this.mazeSize.height;
        ctx.fillStyle = 'rgba(255, 149, 0, 0.8)';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y + 0.5 * height);
        ctx.lineTo(x, y + height);
        ctx.closePath();
        ctx.fill();
    }
    /**
     * 绘制格子
     */
    drawGrid() {
        let ctx = this.context;
        ctx.strokeStyle = 'rgba(0, 255, 247, 0.8)';
        ctx.lineWidth = 1;
        for (let i = 1, w = this.mazeSize.width; i < w; ++i) {
            let x = i * this.width / w;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
            ctx.closePath();
        }
        for (let j = 1, h = this.mazeSize.height; j < h; ++j) {
            let y = j * this.height / h;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
            ctx.closePath();
        }
    }

    drawGridNum(){
        let ctx = this.context;
        ctx.strokeStyle = 'rgba(0, 255, 247, 0.8)';
        ctx.font = "18px serif";
        for (let i = 1, w = this.mazeSize.width; i < w; ++i) {
            let x = i * this.width / w;
            for (let j = 1, h = this.mazeSize.height; j < h; ++j) {
                let y = j * this.height / h;
                ctx.fillText(i + ',' + (j-1), x+5, y-10);
            }
        }
    }

    /**
     * 创建canvas 游戏窗口
     * @param width
     * @param height
     */
    addCanvas(width,height) {
        let str = `<canvas id="${id}_canvas" width=${width} height=${height} style="margin: 0; display: block;background-color: transparent;position: absolute;"><p><b>浏览器不支持canvas.</b></p></canvas>`;
        game.dom = document.querySelector('#' + id);
        this.dom.innerHTML = str;
        return document.querySelector('#' + id + '_canvas');
    }
}

let UI = {

};