/**
 *         ▂▃╬▄▄▃▂▁▁
 *  ●●●█〓██████████████▇▇▇▅▅▅▅▅▅▅▅▅▇▅▅          BUG
 *  ▄▅████☆RED █ WOLF☆██▄▄▃▂
 *  ████████████████████████████
 *  ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤
 *
 * 功能函数库类
 * @author 路漫漫
 * @link ahmerry@qq.com
 * @version
 * v2017/11/3 12:46 初版
 */
"use strict";
// 页面重绘前，通知浏览器调用一个指定的函数
// 具体看https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame
window._requestAnimFrame = (function() {
        return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 30);
            };
    }
)();

/**
 * 底层定义
 */
let OS_PC = "pc",
    OS_IPHONE = "iPhone",
    OS_IPOD = "iPod",
    OS_IPAD = "iPad",
    OS_ANDROID = "Android",
    OS_WINDOWS_PHONE = "Windows Phone",
    OS_BLACK_BERRY = "BlackBerry",
    NONE = "none",
    UNDEFINED = "undefined",
    mouseX,
    mouseY;
let Lib = {};
Lib.os = OS_PC;
Lib.canTouch = false;
Lib.ios = false;
(function (userAgent) {
    if (userAgent.indexOf(OS_IPHONE) > 0) {
        Lib.os = OS_IPHONE;
        Lib.canTouch = true;
        Lib.ios = true;
    } else if (userAgent.indexOf(OS_IPOD) > 0) {
        Lib.os = OS_IPOD;
        Lib.canTouch = true;
        Lib.ios = true;
    } else if (userAgent.indexOf(OS_IPAD) > 0) {
        Lib.os = OS_IPAD;
        Lib.ios = true;
        Lib.canTouch = true;
    } else if (userAgent.indexOf(OS_ANDROID) > 0) {
        Lib.os = OS_ANDROID;
        Lib.canTouch = true;
        Lib.android = true;
    } else if (userAgent.indexOf(OS_WINDOWS_PHONE) > 0) {
        Lib.os = OS_WINDOWS_PHONE;
        Lib.canTouch = true;
    } else if (userAgent.indexOf(OS_BLACK_BERRY) > 0) {
        Lib.os = OS_BLACK_BERRY;
        Lib.canTouch = true;
    }
})(navigator.userAgent);


let randd = function(max, min) {
    min = min || 0;
    return ~~(Math.random() * (max - min) + min);
};
let randu = function(max, min) {
    min = min || 0;
    return (Math.random() * (max - min) + min);
};
let randg = function(sigma, mu) {
    let s, u, v;
    sigma = sigma === undefined ? 1 : sigma;
    mu = mu || 0;
    do {
        u = randu(1.0, -1.0);
        v = randu(1.0, -1.0);
        s = u * u + v * v;
    } while (s == 0.0 || s >= 1.0);
    return mu + sigma * u * Math.sqrt(-2.0 * Math.log(s) / s);
};
let rande = function(decay, min) {
    min = min || 0.0;
    return min - Math.log(Math.random()) / decay;
};

class Path
{
    constructor(list) {
        this.list = list;
    }
    propagate(pathLength) {
        let lastIndex = ~~pathLength;
        let dir = Direction.bottom;
        if (lastIndex + 1 >= this.list.length)
            return false;
        if (this.list[lastIndex].x < this.list[lastIndex + 1].x)
            dir = Direction.right;
        else if (this.list[lastIndex].x > this.list[lastIndex + 1].x)
            dir = Direction.left;
        else if (this.list[lastIndex].y > this.list[lastIndex + 1].y)
            dir = Direction.top;
        let point = this.list[lastIndex + 1].subtract(this.list[lastIndex]);
        point = point.scale(pathLength - lastIndex);
        point = this.list[lastIndex].add(point);
        return {
            point: point,
            direction: dir,
        };
    }
}
/**
 * 游戏事件系统,负责管理已被注册的事件、以及相关事件的侦听者
 * @type {void|*}
 */
class Base
{
    constructor() {
        this.events = {};
    }
    registerEvent(event) {
        if (!this.events[event])
            this.events[event] = [];
    }
    unregisterEvent(event) {
        if (this.events[event])
            delete this.events[event];
    }
    triggerEvent(event, args) {
        if (this.events[event]) {
            let e = this.events[event];
            for (let i = e.length; i--; )
                e[i].apply(this, [args || {}]);
        }
    }
    addEventListener(event, handler) {
        if (this.events[event] && handler && typeof (handler) === 'function')
            this.events[event].push(handler);
    }
    removeEventListener(event, handler) {
        if (this.events[event]) {
            if (handler && typeof (handler) === 'function') {
                let index = this.events[event].indexOf(handler);
                this.events[event].splice(index, 1);
            } else
                this.events[event].splice(0, this.events[event].length);
        }
    }
}

class Player extends Base
{
    constructor(name) {
        super();
        this.name = name || 'Player';
        this.money = 0;
        this.points = 0;
        this.hitpoints = 0;
        this.registerEvent(events.playerDefeated);
        this.registerEvent(events.moneyChanged);
        this.registerEvent(events.healthChanged);
    }
    setMoney(value) {
        this.money = value;
        this.triggerEvent(events.moneyChanged, this);
    }
    addMoney(value) {
        this.points += Math.max(0, value);
        this.setMoney(this.money + value);
    }
    getMoney() {
        return this.money;
    }
    setHitpoints(value) {
        this.hitpoints = Math.max(0, value);
        this.triggerEvent(events.healthChanged, this);
        if (this.hitpoints === 0)
            this.triggerEvent(events.playerDefeated, this);
    }
    addHitpoints(value) {
        this.setHitpoints(this.hitpoints + value);
    }
    getHitpoints() {
        return this.hitpoints;
    }
    hit(unit) {
        this.setHitpoints(this.hitpoints - unit.damage);
    }
}


class GameObject extends Base
{
    constructor(speed, animationDelay) {
        super();
        this.z = 0;
        this.mazeCoordinates = new Point();
        this.speed = speed || 0;
        //帧速，多久更新下一帧
        this.animationDelay = animationDelay || 15;
        this.dead = false;
        this.direction = Direction.right;
    }
    distanceTo(point) {
        return point.subtract(this.mazeCoordinates).norm();
    }
    update() {
        let visual = this.visual;
        let direction = this.direction;
        if(visual.length===1){
            if(visual.currentFrames===1) return;
        } else {
            //改变方向
            if (visual.direction !== direction) {
                visual.direction = direction;
                visual.time = 0;
                visual.index = 0;
                //设置该方向的画面帧索引
                visual.currentFrames = visual.frames[direction];
            }
        }
        visual.time += FPS;
        //更新帧动画
        if (visual.delay < visual.time) {
            visual.index++;
            visual.time = 0;
            if (visual.index === visual.currentFrames) {
                visual.index = 0;
            }
        }
    }
    draw(ctx, x, y, width, height) {}
    getClosestTarget(targets, maximum) {
        let closestTarget;
        let dist = Number.MAX_VALUE;
        for (let i = targets.length; i--; ) {
            let target = targets[i];
            let t = this.distanceTo(target.mazeCoordinates);
            if (t < dist) {
                closestTarget = target;
                dist = t;
            }
        }
        if (dist <= maximum)
            return closestTarget;
    }
    playSound(soundName) {
        let audio = sounds[soundName];
        if (audio) {
            let sound = new Sound(audio);
            sound.play();
        }
    }
    createVisual(imageName, frames, scale, direction) {
        let total = frames.length;
        let index = 0;
        let image = images[imageName];
        let currentFrames;
        direction = direction || this.direction;
        if(total===1){
            currentFrames = frames[0];
        }else {
            currentFrames = frames[direction];
        }
        this.visual = {
            direction: direction,
            index: index,
            time: 0,
            length: total,
            currentFrames: currentFrames,
            frames: frames,
            image: image,
            delay: this.animationDelay,
            width: ~~(image.width / currentFrames),
            height: ~~(image.height / total),
            scale: scale || 1,
        };
    }
}

class Tower extends GameObject
{
    constructor(speed, animationDelay, range, shotType) {
        super(speed, animationDelay);
        this.range = range || 0;
        this.targets = [];
        this.timeToNextShot = 0;
        this.mazeWeight = 0;
        this.direction = Direction.left;
        this.shotType = shotType || {};
        this.registerEvent(events.shot);
    }
    /**
     * 过滤塔防的攻击目标
     * 所有的塔，除了防空塔，只会用一种标准过滤器，就是过滤掉空军单位。防空塔的代码只需要覆盖掉缺省方法就行。
     * @param target
     * @returns {boolean}
     */
    targetFilter(target) {
        return target.strategy !== MazeStrategy.air;
    }
    update() {
        super.update();
        if(Object.keys(this.shotType).length === 0) return;
        let shot = undefined;
        if (this.timeToNextShot <= 0){
            shot = this.shoot();
        }
        if (shot) {
            this.triggerEvent(events.shot, shot);
            this.timeToNextShot = ~~(1000 / this.speed);
        } else
            this.timeToNextShot -= FPS;
    }
    shoot() {
        let targets = this.targets.filter(this.targetFilter);
        let closestTarget = this.getClosestTarget(targets, this.range);
        if (closestTarget) {
            let shot = new (this.shotType)();
            shot.mazeCoordinates = this.mazeCoordinates;
            shot.velocity = closestTarget.mazeCoordinates.subtract(this.mazeCoordinates);
            shot.direction = shot.velocity.toDirection();
            shot.targets = targets;
            this.direction = shot.direction;
            return shot;
        }
    }
}

/**
 * 游戏单位基类
 */
class Unit extends GameObject
{
    constructor(speed, animationDelay, mazeStrategy, hitpoints, rating=0) {
        super(speed, animationDelay);
        this.timer = 0;
        this.path = new Path([]);
        this.mazeCoordinates = new Point();
        this.damage = 1;
        this.strategy = mazeStrategy || MazeStrategy.air;
        this.hitpoints = hitpoints || 0;
        this.health = this.hitpoints;
        this.direction = Direction.right;
        this.rating = rating;
        this.registerEvent(events.accomplished);
        this.registerEvent(events.died);
    }
    playInitSound() {
        this.playSound('showUnit');
    }
    playDeathSound() {
        this.playSound('cannonAttackEnd');
    }
    playVictorySound() {
        this.playSound('flee');
    }
    update() {
        super.update();
        this.timer += FPS;
        let s = this.speed * 0.001;
        if (!this.dead && s > 0) {
            let sigma = this.path.propagate(s * this.timer);
            if (!sigma) {
                this.dead = true;
                this.triggerEvent(events.accomplished, this);
                this.playVictorySound();
            } else {
                this.mazeCoordinates = sigma.point;
                this.direction = sigma.direction;
            }
        }
    }

    /**
     * 新建防御塔后，重新计算寻路
     */
    updatePath(){
        let path = game.maze.getPath(this.strategy);
        // this.mazeCoordinates = this.maze.start;
        this.path = new Path(path);
    }

    /**
     * 绘制敌人血量
     * @param ctx
     * @param x
     * @param y
     * @param width
     * @param height
     */
    draw(ctx, x, y, width, height) {
        //计算血条
        let maxLength = 12;
        let barLength = maxLength * this.health / this.hitpoints;
        x += (width - maxLength) * 0.5;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(x, y - 6, maxLength, 3);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(x, y - 6, barLength, 3);
    }

    /**
     * 被攻击
     * @param shot
     */
    hit(shot) {
        this.health -= shot.damage;
        if (!this.dead && this.health <= 0) {
            this.health = 0;
            game.player.addMoney(this.speed>>1);
            this.dead = true;
            this.triggerEvent(events.died, this);
            this.playDeathSound();
        }
    }
}

/**
 * 攻击类型基类
 */
class Shot extends GameObject
{
    constructor(speed, animationDelay, damage, impactRadius) {
        super(speed, animationDelay);
        //攻击力
        this.damage = damage || 0;
        this.targets = [];
        //攻击范围
        this.impactRadius = impactRadius || 0.5;

        this.timeToDamagability = ~~(200 / this.speed);
        //向量
        this.velocity = new Point();
        this.registerEvent(events.hit);
    }
    update() {
        let pt = this.velocity.scale(this.speed * FPS * 0.001);
        this.mazeCoordinates = this.mazeCoordinates.add(pt);
        super.update();
        if (this.timeToDamagability > 0) {
            this.timeToDamagability -= FPS;
        } else {
            let closestTarget = this.getClosestTarget(this.targets, this.impactRadius);
            if (closestTarget) {
                closestTarget.hit(this);
                this.dead = true;
                this.triggerEvent(events.hit, closestTarget);
            }
        }
    }
}

/**
 * 游戏声效基类
 * @type {Array}
 */
let deposit = [];
class Sound
{
    constructor(tag, loop) {
        this.source = tag.src;
        this.loop = !!loop;
        this.setVolume(0.6);
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.element)
            this.element.volume = Sound.volume * this.volume;
    }

    play() {
        if (this.element || Sound.active > Sound.channels)
            return;
        let me = this;
        me.element = Sound.createAudio(this.source);
        me.setVolume(me.volume);
        let ended = function () {
            if (me.loop) {
                this.currentTime = 0;
                this.play();
            } else {
                me.element = undefined;
                this.removeEventListener('ended', ended);
                Sound.destroyAudio(this);
            }
        };
        me.element.addEventListener('ended', ended);
        if (Sound.enabled)
            me.element.play();
    }

    static createAudio(src) {
    let d;
    Sound.active++;
    for (let i = deposit.length; i--;) {
        d = deposit[i];
        if (!d.active && d.src === src) {
            d.active = true;
            d.element.currentTime = 0;
            return d.element;
        }
    }
    d = {
        active: true,
        src: src,
        element: new Audio(src),
    };
    deposit.push(d);
    return d.element;
}
    static destroyAudio(element) {
    Sound.active--;
    for (let i = deposit.length; i--;) {
        if (deposit[i].element === element) {
            deposit[i].active = false;
            break;
        }
    }
}
    static disable() {
    if (Sound.enabled) {
        Sound.enabled = false;
        for (let i = deposit.length; i--;) {
            if (deposit[i].active)
                deposit[i].element.pause();
        }
    }
}
    static enable() {
    if (!Sound.enabled) {
        Sound.enabled = true;
        for (let i = deposit.length; i--;) {
            if (deposit[i].active)
                deposit[i].element.play();
        }
    }
}
    static setVolume(volume) {
    Sound.volume = volume;
    for (let i = deposit.length; i--;) {
        deposit[i].element.volume = volume;
    }
}
}
Sound.volume = 1.0;
Sound.channels = 6;
Sound.active = 0;
Sound.sounds = [];
Sound.enabled = true;
/*Sound.createAudio = function (src) {
    let d;
    Sound.active++;
    for (let i = deposit.length; i--;) {
        d = deposit[i];
        if (!d.active && d.src === src) {
            d.active = true;
            d.element.currentTime = 0;
            return d.element;
        }
    }
    d = {
        active: true,
        src: src,
        element: new Audio(src),
    };
    deposit.push(d);
    return d.element;
}
Sound.destroyAudio = function (element) {
    Sound.active--;
    for (let i = deposit.length; i--;) {
        if (deposit[i].element === element) {
            deposit[i].active = false;
            break;
        }
    }
}
Sound.disable = function () {
    if (Sound.enabled) {
        Sound.enabled = false;
        for (let i = deposit.length; i--;) {
            if (deposit[i].active)
                deposit[i].element.pause();
        }
    }
}
Sound.enable = function () {
    if (!Sound.enabled) {
        Sound.enabled = true;
        for (let i = deposit.length; i--;) {
            if (deposit[i].active)
                deposit[i].element.play();
        }
    }
}
Sound.setVolume = function (volume) {
    Sound.volume = volume;
    for (let i = deposit.length; i--;) {
        deposit[i].element.volume = volume;
    }
}*/
