/**
 *         ▂▃╬▄▄▃▂▁▁
 *  ●●●█〓██████████████▇▇▇▅▅▅▅▅▅▅▅▅▇▅▅          BUG
 *  ▄▅████☆RED █ WOLF☆██▄▄▃▂
 *  ████████████████████████████
 *  ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤
 *
 * 游戏主类
 * 定义你自己的资源，并在main.js中修改相关的全局变量
 * 定制防御塔，替换/修改tower.js
 * 定制游戏单元，替换/修改unit.js
 * 定制发射类，替换/修改shot.js
 * 你想用不同于<canvas>的东西来做绘图么？可以考虑扩展view.js
 * @author 路漫漫
 * @link ahmerry@qq.com
 * @version
 * v2017/11/3 12:38 初版
 */
"use strict";

let
    HEIGHT=450,
    WIDTH=900;
//TODO：移动端后续还要再优化
HEIGHT = ~~(window.innerHeight/1.3);
WIDTH = window.innerWidth-100;

//游戏常量设定值
const
    FPS = ~~(1000/30),
    MONEY=50,
    HIT_POINTS=10,//血量
    MEDIPACK_COST=5,//回血初始单价
    MEDIPACK_FACTOR=1.2,//回血价格涨幅系数
    MEDIPACK_HEALTH=1,//回血量
    TOWER_BUILD_COST=5,//最大建造数单价
    TOWER_BUILD_FACTOR=1.5,//最大建造单价涨幅系数
    TOWER_BUILD_NUMBER=4;//初始最大建造单价涨幅系数
let images = {};
let sounds = {};
/**
 * 游戏里的静态属性基本都放这里了，感觉应该跟game对象合并，后面再优化吧
 * @type {{units: {}, towers: {}, shots: {}}}
 */
let types = {
    units: {},//单位
    towers: {},//防御塔
    shots: {}//弹药
};
let events = {
    click: 'click',
    mousemove: 'mousemove',
    mouseover: 'mouseover',
    mouseout: 'mouseout',
    contextmenu: 'contextmenu',//鼠标右键事件
    refreshed: 'refreshed',
    died: 'died',
    shot: 'shot',
    hit: 'hit',
    accomplished: 'accomplished',
    playerDefeated: 'playerDefeated',
    moneyChanged: 'moneyChanged',
    waveCreated: 'waveCreated',
    waveFinished: 'waveFinished',
    waveDefeated: 'waveDefeated',
    healthChanged: 'healthChanged',
    unitSpawned: 'unitSpawned',
    towerNumberChanged: 'towerNumberChanged',
    towerBuildCostChanged: 'towerBuildCostChanged',
    mediPackCostChanged: 'mediPackCostChanged'
};
//游戏状态
let GameState = {
    //未开始
    unstarted: 0,
    //布防
    building: 1,
    //出怪中
    waving: 2,
    //出怪结束
    finished: 3
};

/**
 * 宫格路径策略枚举
 */
let MazeStrategy = {
    //manhattan计量方式 不允许走对角线捷径,从(1,1)走到(2,2)被算作至少需要2步
    manhattan: 1,
    maxDXDY: 2,
    diagonalShortCut: 3,
    //Euclidean计量方式，从(1,1)走到(2,2)会被只算作1步
    euclidean: 4,
    //不对平方距离计算平方根的Euclidean算法的变体
    euclideanNoSQR: 5,
    custom: 6,
    //“最短路径”,忽略掉一切障碍物直取目标
    air: 7
};

let Direction = {
    bottom: 0,
    left: 1,
    right: 2,
    top: 3,
};

let Steps = {
    WithDiagonals: [[0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1]],
    OnlyStraight: [[0, -1], [1, 0], [0, 1], [-1, 0]],
};

let game,start;

window.onload = function() {
    game = new GameLogic('game',30,15);
    let towerButtons = [];
    let nextwave = document.querySelector('#nextwave');
    let towerPanel = document.querySelector('#towers');
    let moneyInfo = document.querySelector('#money-info');
    let healthInfo = document.querySelector('#health-info');
    let towerInfo = document.querySelector('#tower-info');
    let timeInfo = document.querySelector('#time-info');
    let soundInfo = document.querySelector('#sound-info');
    let startWaveButton = document.querySelector('#startWave');
    let buyMedipackButton = document.querySelector('#buyMedipack');
    let buyTowerbuildButton = document.querySelector('#buyTowerbuild');
    let towerType = undefined;
    /**
     * 获取点击的相对坐标
     * @param evt
     * @returns {{x: number, y: number}}
     */
    let getMousePosition = function(evt) {
        let rect = game.canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };
    /**
     * 绘制下一波敌人ICO到界面
     */
    let updateNextWave = function() {
        nextwave.innerHTML = '';
        let names = game.waves.nextOpponents();
        let scale = 1;
        for (let i = 0; i < names.length; i++) {
            let name = names[i];
            let unit = types.units[name];
            let img = images[unit.sprite];
            let div = document.createElement('div');
            let icon = document.createElement('canvas');
            let width = ~~(img.width / unit.frames[0]);
            let height = ~~(img.height / unit.frames.length);
            icon.width = width*scale;
            icon.height = height*scale;
            // let targetHeight = img.height > 32 ? 32 : img.height;
            // let targetWidth = ~~(width * targetHeight / img.height);
            let ctx = icon.getContext('2d');
            ctx.scale(scale,scale);
            ctx.drawImage(img, 0, 0, width, height, 0, 0, width, height);
            div.appendChild(icon);
            let info = document.createElement('div');
            info.innerHTML = ['<div class=title>', unit.nickName, '</div>', '<div class=description>', unit.description, '</div>', '<div class=speed>', unit.speed, '</div>', '<div class=health>', unit.hitpoints, '</div><div style="clear:both"></div>', ].join('');
            info.classList.add('info');
            div.appendChild(info);
            nextwave.appendChild(div);
        }
    };
    /**
     * 添加事件绑定触发
     */
    let addHandlers = function() {
        game.addEventListener(events.waveFinished, function() {
            timeInfo.textContent = '本波结束';
        });
        game.addEventListener(events.waveDefeated, function() {
            timeInfo.textContent = '游戏已保存';
            startWaveButton.disabled = false;
            localStorage.towerDefense = JSON.stringify(game.saveState());
            updateNextWave();
        });
        game.addEventListener(events.playerDefeated, function() {
            //清除存档
            delete localStorage.towerDefense;
            timeInfo.textContent = '游戏结束';
            alert('loser! 刷新重来吧.');
            location.href = location.href;
        });

        //开始一波新的
        game.addEventListener(events.waveCreated, function(wave) {
            timeInfo.textContent = wave.units.length + '单位';
            //开始按钮提示波数+1
            startWaveButton.querySelector('span').textContent = (wave.index + 1);
            //不可点击
            startWaveButton.disabled = true;
        });
        game.addEventListener(events.unitSpawned, function(remaining) {
            timeInfo.textContent = '剩' + remaining + '单位';
        });
        game.addEventListener(events.moneyChanged, function(player) {
            moneyInfo.textContent = player.money;
            buyMedipackButton.disabled = player.money < game.mediPackCost;
            buyTowerbuildButton.disabled = player.money < game.towerBuildCost;
            for (let i = 0; i < towerButtons.length; ++i)
                towerButtons[i].element.disabled = towerButtons[i].tower.cost > player.money;
        });
        game.addEventListener(events.healthChanged, function(player) {
            healthInfo.textContent = player.hitpoints;
        });
        game.addEventListener(events.towerBuildCostChanged, function(cost) {
            buyTowerbuildButton.querySelector('span').textContent = cost;
        });
        game.addEventListener(events.mediPackCostChanged, function(cost) {
            buyMedipackButton.querySelector('span').textContent = cost;
        });
        game.addEventListener(events.towerNumberChanged, function(info) {
            towerInfo.textContent = info.current + ' / ' + info.maximum;
        });
        startWaveButton.addEventListener(events.click, function() {
            game.beginWave();
        });
        buyMedipackButton.addEventListener(events.click, function() {
            game.buyMediPack();
        });
        buyTowerbuildButton.addEventListener(events.click, function() {
            game.buyTowerBuildRight();
        });
        soundInfo.addEventListener(events.click, function() {
            let on = 'on';
            let off = 'off';
            let status = this.classList.contains('on');
            this.classList.remove(status ? on : off);
            this.classList.add(status ? off : on);
            Sound.setVolume(status ? 0 : 1);
        });
        game.canvas.addEventListener(events.click, function(evt) {
            let mousePos = getMousePosition(evt);
            let pos = game.transformCoordinates(mousePos.x, mousePos.y);
            evt.preventDefault();
            if (towerType) {
                game.buildTower(pos, towerType);
            } else {
                game.destroyTower(pos);
            }
        });
        //鼠标右键事件
        game.canvas.addEventListener(events.contextmenu, function(evt) {
            let mousePos = getMousePosition(evt);
            let pos = game.transformCoordinates(mousePos.x, mousePos.y);
            evt.preventDefault();
            game.destroyTower(pos);
        });

        //显示格子
        game.canvas.addEventListener(events.mouseover, function(evt) {
            game.view.showGrid = true;
        });
        //隐藏
        game.canvas.addEventListener(events.mouseout, function(evt) {
            game.view.showGrid = false;
        });
    };
    /**
     * 为每一种塔创建并添加一个按钮
     * @param tower
     */
    let addTower = function(tower) {
        console.log(tower.sprite);
        let img = images[tower.sprite];
        let div = document.createElement('button');
        div.innerHTML = [
            '<div class=preview>' +
            '<div style="background: url(', img.src, ') no-repeat; width: ', ~~(img.naturalWidth / tower.frames[0]), 'px; height: ', ~~(img.naturalHeight / tower.frames.length), 'px" class="preview-image"></div>' +
            '</div>',
            '<div class=title>', tower.nickName, '</div>' +
            '<div class=info>',
            '<div class=description>', tower.description, '</div>',
            '<div class=speed>', tower.speed, '</div>',
            '<div class=damage>', tower.shotType.damage, '</div>',
            '<div class=range>', tower.range, '</div>',
            '<div class=cost>', tower.cost, '</div>' +
            '</div>'
        ].join('');
        towerButtons.push({
            tower: tower,
            element: div
        });
        div.addEventListener(events.click, function() {
            towerType = tower;
            for (let i = towerButtons.length; i--;){
                towerButtons[i].element.classList.remove('selected-tower');
            }
            this.classList.add('selected-tower');
        });
        towerPanel.appendChild(div);
    };
    let addTowers = function() {
        for (let key in types.towers) {
            addTower(types.towers[key]);
        }
    };
    let startMusic = function() {
        let music = sounds['theme'];
        if (music) {
            let sound = new Sound(music,true);
            sound.setVolume(0.3);
            sound.play();
        } else{
            soundInfo.classList.add('hidden');
        }
    };

    //资源载入完成
    let completed = function(e) {
        addTowers();
        addHandlers();
        game.view.background = images.background;
        game.view.showGrid = false;
        buyMedipackButton.querySelector('span').textContent = game.mediPackCost;
        buyTowerbuildButton.querySelector('span').textContent = game.towerBuildCost;
        document.querySelector('#frame').classList.remove('hidden');
        document.querySelector('#wait').classList.add('hidden');
        startMusic();
        game.start();
        if (localStorage.towerDefense !== undefined) {
            let result = confirm('是否继续游戏？');
            if (result) {
                let state = JSON.parse(localStorage.towerDefense);
                game.loadState(state);
                startWaveButton.querySelector('span').textContent = game.waves.index + 1;
            }
        }
        updateNextWave();
    };
    //显示载入进度
    let progress = function(e) {
        document.querySelector('#wait-message').textContent = '载入中 (' + e.name + ', ' + ~~(e.progress * 100) + '% of ' + e.total + ')';
    };
    let loader = new Loader(completed,progress);
    loader.set('Images', ImageLoader, images, resources.images);
    loader.set('Sounds', SoundLoader, sounds, resources.sounds);
    //执行载入
    loader.start();
};

/**
 * 游戏主循环逻辑
 * 调用start()方法触发处理,之后以固定间隔调用tick()函数
 * 间隔定义在contants.ticks中
 *
 * @type {void|*}
 */
class GameLogic extends Base
{
    /**
     *
     * @param id
     * @param mazeWidth 地图宽（格子数）
     * @param mazeHeight 地图高（格子数）
     */
    constructor(id, mazeWidth, mazeHeight) {
        super();
        let me = this;
        me.towers = [];
        me.units = [];
        me.shots = [];
        me.mediPackCost = MEDIPACK_COST;
        me.mediPackFactor = MEDIPACK_FACTOR;
        me.towerBuildCost = TOWER_BUILD_COST;
        me.towerBuildFactor = TOWER_BUILD_FACTOR;
        me.maxTowerNumber = TOWER_BUILD_NUMBER;
        me.mediPackHealth = MEDIPACK_HEALTH;
        me.canvas = this.createCanvas(id,WIDTH,HEIGHT);
        me.view = new CanvasView(me.canvas);
        me.player = new Player();
        me.state = GameState.unstarted;
        //初始化战场
        me.maze = new Maze(new Size(mazeWidth || 20,mazeHeight || 11));
        me.view.mazeSize = me.getMazeSize();
        me.waves = new WaveList();
        me.currentWave = new Wave();
        me.player.addEventListener(events.playerDefeated, function(e) {
            me.triggerEvent(events.playerDefeated, e);
            me.finish();
        });
        me.player.addEventListener(events.moneyChanged, function(e) {
            me.triggerEvent(events.moneyChanged, e);
        });
        me.player.addEventListener(events.healthChanged, function(e) {
            me.triggerEvent(events.healthChanged, e);
        });
        me.registerEvent(events.refreshed);
        me.registerEvent(events.waveDefeated);
        me.registerEvent(events.waveFinished);
        me.registerEvent(events.playerDefeated);
        me.registerEvent(events.moneyChanged);
        me.registerEvent(events.healthChanged);
        me.registerEvent(events.waveCreated);
        me.registerEvent(events.unitSpawned);
        me.registerEvent(events.towerNumberChanged);
        me.registerEvent(events.towerBuildCostChanged);
        me.registerEvent(events.mediPackCostChanged);
    }
    /**
     * 创建canvas 游戏窗口
     * @param id
     * @param width
     * @param height
     */
    createCanvas(id,width,height) {
        let str = `<canvas id="${id}_canvas" width=${width} height=${height} style="margin: 8px auto; display: block;"><p><b>浏览器不支持canvas.</b></p></canvas>`;
        let dom = document.querySelector('#'+id);
        dom.innerHTML = str;
        return document.querySelector('#'+id+ '_canvas');
    }
    /**
     * 入口函数
     */
    start() {
        if (this.state === GameState.unstarted) {
            //初始化玩家数据
            this.player.setHitpoints(HIT_POINTS);
            this.player.setMoney(MONEY);
            this.triggerEvent(events.towerNumberChanged, {
                current: this.getNumShooting(),
                maximum: this.maxTowerNumber
            });
            this.state = GameState.building;
        }
        this.restart();
    }
    restart() {
        if (!this.gameLoop) {
            let me = this;
            let lastTime,then=0;
            me.gameLoop = function() {
                let now = Date.now();
                lastTime = now - then;
                if (lastTime>FPS){
                    me.view.draw();
                    me.tick();
                    then = now - (lastTime%FPS);
            }
                window._requestAnimFrame(me.gameLoop);
            };
            me.gameLoop();
            //原逻辑绘图循环和代码逻辑循环分开，这有可能导致“卡顿”
            // this.view.start();
            // this.gameLoop = setInterval(function() {
            //     me.tick();
            // }, FPS);
        }
    }
    pause() {
        if (this.gameLoop) {
            // this.view.pause();
            // clearInterval(this.gameLoop);
            this.gameLoop = undefined;
        }
    }
    /**
     * 把当前的GameLogic实例转换成了一个可移植对象。在该对象中不存在任何外部引用、而是一个"原子"型数据对象。
     * @returns {{mediPackCost: *, mediPackFactor: *, towerBuildCost: *, towerBuildFactor: *, towerBuildNumber: *,
     *     hitpoints: (number|*), money: (number|*), points: (number|*), playerName: *, towers: Array, wave: number,
     *     state: *}}
     */
    saveState() {
        let towers = [];
        for (let i = 0; i < this.towers.length; i++) {
            let tower = this.towers[i];
            towers.push({
                point: {
                    x: tower.mazeCoordinates.x,
                    y: tower.mazeCoordinates.y
                },
                type: tower.typeName,
            });
        }
        return {
            mediPackCost: this.mediPackCost,
            mediPackFactor: this.mediPackFactor,
            towerBuildCost: this.towerBuildCost,
            towerBuildFactor: this.towerBuildFactor,
            towerBuildNumber: this.maxTowerNumber,
            hitpoints: this.player.hitpoints,
            money: this.player.money,
            points: this.player.points,
            playerName: this.player.name,
            towers: towers,
            wave: this.waves.index,
            state: this.state,
        };
    }
    loadState(state) {
        this.towers = [];
        for (let i = 0; i < state.towers.length; i++) {
            let type = types.towers[state.towers[i].type];
            let tower = new type();
            let point = state.towers[i].point;
            let pt = new Point(point.x,point.y);
            if (this.maze.tryBuild(pt, tower.mazeWeight)) {
                tower.mazeCoordinates = pt;
                tower.cost = type.cost;
                this.addTower(tower);
            }
        }
        this.mediPackFactor = state.mediPackFactor;
        this.towerBuildFactor = state.towerBuildFactor;
        this.player.points = state.points;
        this.player.name = state.playerName;
        this.setMediPackCost(state.mediPackCost);
        this.setTowerBuildCost(state.towerBuildCost);
        this.setMaxTowerNumber(state.towerBuildNumber);
        this.player.setHitpoints(state.hitpoints);
        this.player.setMoney(state.money);
        this.waves.index = state.wave;
        this.state = state.state;
    }
    update(objects) {
        for (let i = objects.length; i--; )
            objects[i].update();
    }
    tick() {
        //非建造和攻击状态
        if (this.state !== GameState.building && this.state !== GameState.waving)
            return;
        this.update(this.towers);
        if (this.state === GameState.waving) {
            this.update(this.shots);
            this.update(this.units);
            this.removeDeadObjects();
            let newUnits = this.currentWave.update();
            for (let i = newUnits.length; i--; ) {
                let unit = newUnits[i];
                let path = this.maze.getPath(unit.strategy);
                unit.mazeCoordinates = this.maze.start;
                unit.path = new Path(path);
                this.addUnit(unit);
            }
        }
    }
    finish() {
        this.state = GameState.finished;
    }
    getNumShooting() {
        return this.towers.filter(function(tower) {
            return (tower instanceof Rock) === false;
        }).length;
    }
    getMazeSize() {
        return this.maze.gridDim;
    }
    transformCoordinates(screenX, screenY) {
        let x = screenX * this.maze.gridDim.width / this.view.width;
        let y = screenY * this.maze.gridDim.height / this.view.height;
        return new Point(~~x,~~y);
    }
    removeTower(tower) {
        tower.removeEventListener(events.shot);
        this.towers.splice(this.towers.indexOf(tower), 1);
        this.view.remove(tower);
    }
    addTower(tower) {
        let me = this;
        tower.targets = me.units;
        tower.addEventListener(events.shot, function(shot) {
            me.addShot(shot);
        });
        me.towers.push(tower);
        me.view.add(tower);
    }
    addShot(shot) {
        this.shots.push(shot);
        this.view.add(shot);
    }
    addUnit(unit) {
        let me = this;
        unit.addEventListener(events.accomplished, function(unt) {
            me.player.hit(unt);
        });
        unit.playInitSound();
        me.units.push(unit);
        me.view.add(unit);
    }
    removeDead(objects) {
        for (let i = objects.length; i--; ) {
            if (objects[i].dead) {
                this.view.remove(objects[i]);
                objects.splice(i, 1);
            }
        }
    }
    removeDeadObjects() {
        this.removeDead(this.towers);
        this.removeDead(this.shots);
        this.removeDead(this.units);
        if (this.currentWave.finished && this.units.length === 0)
            this.endWave();
    }
    /**
     * 出怪结束
     */
    endWave() {
        // this.player.addMoney(this.currentWave.prizeMoney);
        this.state = GameState.building;
        for (let i = this.shots.length; i--; ) {
            this.view.remove(this.shots[i]);
            this.shots.splice(i, 1);
        }
        this.triggerEvent(events.waveDefeated, this.currentWave);
        game.beginWave();
    }
    beginWave() {
        if (this.state === GameState.building) {
            let me = this;
            me.state = GameState.waving;
            let wave = me.waves.next();
            wave.addEventListener(events.waveFinished, function() {
                me.triggerEvent(events.waveFinished);
                wave.removeEventListener(events.waveFinished);
                wave.removeEventListener(events.unitSpawned);
            });
            wave.addEventListener(events.unitSpawned, function(e) {
                me.triggerEvent(events.unitSpawned, e);
            });
            me.triggerEvent(events.waveCreated, wave);
            me.currentWave = wave;
        }
    }
    /**
     * 建造防御塔
     * @param pt
     * @param type
     * @returns {boolean}
     */
    buildTower(pt, type) {
        let newTower = new type();
        let isrock = newTower instanceof Rock;
        let numShooting = this.getNumShooting();
        //this.state === GameState.building && 任意状态都可以建造
        if (type.cost <= this.player.money && (isrock || (numShooting < this.maxTowerNumber))) {
            //设置塔坐标
            newTower.mazeCoordinates = pt;
            newTower.cost = type.cost;
            if (this.maze.tryBuild(pt, newTower.mazeWeight)) {
                this.player.addMoney(-type.cost);
                this.addTower(newTower);
                if (!isrock) {
                    this.triggerEvent(events.towerNumberChanged, {
                        current: numShooting + 1,
                        maximum: this.maxTowerNumber,
                    });
                }
                return true;
            }
        }
        return false;
    }

    /**
     * 删除防御塔
     * @param pt
     */
    destroyTower(pt) {
        //任意状态都可以删除塔
        // if (this.state == GameState.building) {
            let towerToRemove = this.towers.filter(function(t) {
                return t.mazeCoordinates.x === pt.x && t.mazeCoordinates.y === pt.y;
            })[0];
            if (towerToRemove) {
                this.player.addMoney(0.5 * towerToRemove.cost);
                this.removeTower(towerToRemove);
                this.maze.tryRemove(pt);
                if (!(towerToRemove instanceof Rock)) {
                    this.triggerEvent(events.towerNumberChanged, {
                        current: this.getNumShooting(),
                        maximum: this.maxTowerNumber,
                    });
                }
            }
        // }
    }
    /**
     * 购买生命
     * @returns {boolean}
     */
    buyMediPack() {
        let cost = this.mediPackCost;
        if (this.player.money >= cost) {
            this.player.addHitpoints(this.mediPackHealth);
            this.setMediPackCost(~~(this.mediPackFactor * cost));
            this.player.addMoney(-cost);
            return true;
        }
        return false;
    }
    buyTowerBuildRight() {
        let cost = this.towerBuildCost;
        if (this.player.money >= cost) {
            this.setMaxTowerNumber(this.maxTowerNumber + 1);
            this.setTowerBuildCost(~~(this.towerBuildFactor * cost));
            this.player.addMoney(-cost);
            return true;
        }
        return false;
    }
    setMediPackCost(cost) {
        this.mediPackCost = cost;
        this.triggerEvent(events.mediPackCostChanged, cost);
    }
    setTowerBuildCost(cost) {
        this.towerBuildCost = cost;
        this.triggerEvent(events.towerBuildCostChanged, cost);
    }
    setMaxTowerNumber(number) {
        let numShooting = this.getNumShooting();
        this.maxTowerNumber = number;
        this.triggerEvent(events.towerNumberChanged, {
            current: numShooting,
            maximum: number,
        });
    }
}

class WaveList
{
    constructor(){
        this.waves = [];
        this.index = 0;
        this.unitNames = Object.keys(types.units);
    }

    /**
     * 攻击波算法 高斯随机数生成->调用高斯算法
     * 早期产生容易应对的攻击波、而在后期产生更难的。首先我们使用一个多项式来得出某一轮所应有的怪物数量，这里会用到一些魔法数字，这些魔法是通过将一个多项式应用于某个指定值来活的的。目前产生的行为结果就是，最初几轮只会有少量怪物出现，而从第20关开始会遇到大量怪物。等到第50关时我们已经要面对同150个怪物的战斗了。
     *
     * 高斯分布算法，解决强力怪物、弱怪一样的出现概率
     * 唯一的问题是，该把高斯分布的峰值设置在哪里。峰值决定了我们希望那种怪物出现得最多，这将随着关卡变化而变。
     * 需要以代码形式写出一个较简单的高斯随机数生成算法。一个十分简单的Box-Muller转换。
     *
     *
     * @returns {*}
     */
    random(){
        let wave = new Wave(this.index);
        //某一轮所应有的怪物数量
        let n = ~~(1.580451 - 0.169830 * this.index + 0.071592 * this.index * this.index);
        //怪物选择的最高值 通过upper变量标识
        let upper = this.index * 0.3 + 1;
        let m = Math.min(this.unitNames.length, ~~upper);
        //对每种怪物都 进行数量乘以1s
        let maxtime = 1000 * this.index;
        //增加的金钱
        wave.prizeMoney = n;
        for (let i = 0; i < n; ++i) {
            //优化算法，提升速度
            let tmp1 = m-1,
                tmp2 = (~~randg(1.0, 0.5 * upper));
            let j = tmp1 < tmp2 ? ((tmp1 > 0) ? tmp1 : 0) : ((tmp2 > 0) ? tmp2 : 0);
            //Math算法效率慢
            // let j = Math.max(Math.min(m - 1, ~~randg(1.0, 0.5 * upper)), 0);
            let name = this.unitNames[j];
            let unit = new (types.units[name])();
            wave.add(unit, i === 0 ? 0 : randd(maxtime));
        }
        return wave;
    }

    nextOpponents(){
        let upper = this.index * 0.3 + 1.3;
        let m = Math.min(this.unitNames.length, ~~upper);
        let units = [];
        for (let i = 0; i < this.unitNames.length && i < m; i++)
            units.push(this.unitNames[i]);
        return units;
    }

    next(){
        if (this.index < this.waves.length){
            return this.waves[this.index++];
        }
        ++this.index;
        return this.random();
    }
}


class Wave extends Base
{
    constructor(index) {
        super();
        this.index = index || 0;
        this.startTime = 0;
        this.units = [];
        this.prizeMoney = 0;
        this.finished = false;
        this.registerEvent(events.unitSpawned);
        this.registerEvent(events.waveFinished);
    }
    add(unit, time) {
        this.units.push({
            time: time,
            unit: unit
        });
    }

    update() {
        let unitsToSpawn = [];
        if (!this.finished) {
            for (let i = this.units.length; i--; ) {
                if (this.units[i].time < this.startTime) {
                    unitsToSpawn.push(this.units[i].unit);
                    this.units.splice(i, 1);
                }
            }
            if (this.units.length === 0) {
                this.finished = true;
                this.triggerEvent(events.waveFinished);
            }
            if (unitsToSpawn.length > 0) {
                let remaining = this.units.length;
                this.triggerEvent(events.unitSpawned, remaining);
            }
            this.startTime += FPS;
        }
        return unitsToSpawn;
    }
}