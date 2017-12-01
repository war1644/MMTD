/**
 *         ▂▃╬▄▄▃▂▁▁
 *  ●●●█〓██████████████▇▇▇▅▅▅▅▅▅▅▅▅▇▅▅          BUG
 *  ▄▅████☆RED █ WOLF☆██▄▄▃▂
 *  ████████████████████████████
 *  ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤
 *
 * 游戏敌人单位类
 * @author 路漫漫
 * @link ahmerry@qq.com
 * @version
 * v2017/11/3  初版
 */
"use strict";
class Tank extends Unit
{
    constructor() {
        super(Tank.speed, 100, MazeStrategy.manhattan, Tank.hitpoints);
        this.createVisual(Tank.sprite, Tank.frames);
    }
}
Tank.speed = 1.0;
Tank.frames = [4, 4, 4, 4];
Tank.hitpoints = 100;
Tank.description = 'test';
Tank.nickName = '战车';
Tank.sprite = 'tank';
Tank.rating = Tank.speed * Tank.hitpoints;
types.units['Tank'] = Tank;


/*
class Zelda extends Unit
{
    constructor() {
        super(Zelda.speed, 100, MazeStrategy.manhattan, Zelda.hitpoints);
        this.createVisual(Zelda.sprite, [5, 5, 5, 5]);
    }
}
Zelda.speed = 2.0;
Zelda.frames = 20;
Zelda.hitpoints = 10;
Zelda.description = 'xxx';
Zelda.nickName = '塞尔达';
Zelda.sprite = 'zelda';
Zelda.rating = Zelda.speed * Zelda.hitpoints;
// types.units['zelda'] = Zelda;

class Mario extends Unit
{
   constructor() {
        super(Mario.speed, 100, MazeStrategy.manhattan, Mario.hitpoints);
        this.createVisual(Mario.sprite, [8, 8, 8, 8]);
    }
}
Mario.speed = 2.0;
Mario.frames = 32;
Mario.hitpoints = 10;
Mario.description = '小心这个水管工.';
Mario.nickName = '马里奥';
Mario.sprite = 'mario';
Mario.rating = Mario.speed * Mario.hitpoints;
// types.units['Mario'] = Mario;

class Rope extends Unit
{
   constructor() {
        super(Rope.speed, 80, MazeStrategy.euclideanNoSQR, Rope.hitpoints);
        this.createVisual(Rope.sprite, [4, 4, 4, 4], 0.8);
    }
}
Rope.speed = 2.0;
Rope.frames = 16;
Rope.hitpoints = 20;
Rope.description = '试图征服这个区域的蛇。注意他们的血量!';
Rope.nickName = '蛇';
Rope.sprite = 'rope';
Rope.rating = Rope.speed * Rope.hitpoints;
// types.units['Rope'] = Rope;

class FireWizzrobe extends Unit
{
   constructor() {
        super(FireWizzrobe.speed, 70, MazeStrategy.manhattan, FireWizzrobe.hitpoints);
        this.createVisual(FireWizzrobe.sprite, [3, 3, 3, 3], 1.4);
    }
}
FireWizzrobe.speed = 3.0;
FireWizzrobe.frames = 12;
FireWizzrobe.hitpoints = 30;
FireWizzrobe.description = '火袍巫师速度非常快, 但血量不高。';
FireWizzrobe.nickName = '女巫';
FireWizzrobe.sprite = 'firewizzrobe';
FireWizzrobe.rating = FireWizzrobe.speed * FireWizzrobe.hitpoints;
// types.units['FireWizzrobe'] = FireWizzrobe;

class AirWolf extends Unit
{
   constructor() {
        super(AirWolf.speed, 50, MazeStrategy.air, AirWolf.hitpoints);
        this.createVisual(AirWolf.sprite, [4]);
    }
}
AirWolf.speed = 2.0;
AirWolf.frames = 4;
AirWolf.hitpoints = 40;
AirWolf.description = '阿帕奇是空中部队。不要小看他, 因为一个阿帕奇舰队会让你game over。';
AirWolf.nickName = '阿帕奇';
AirWolf.sprite = 'airwolf';
AirWolf.rating = AirWolf.speed * AirWolf.hitpoints * 1.2;
// types.units['AirWolf'] = AirWolf;

class DarkNut extends Unit
{
   constructor() {
        super(DarkNut.speed, 80, MazeStrategy.euclideanNoSQR, DarkNut.hitpoints);
        this.createVisual(DarkNut.sprite, [4, 4, 4, 4]);
    }
}
DarkNut.speed = 2.5;
DarkNut.frames = 16;
DarkNut.hitpoints = 150;
DarkNut.description = '小心，黑骑士速度快，并且拥有高血量。';
DarkNut.nickName = '黑骑士';
DarkNut.sprite = 'darknut';
DarkNut.rating = DarkNut.speed * DarkNut.hitpoints;
// types.units['DarkNut'] = DarkNut;

class Speedy extends Unit
{
   constructor() {
        super(Speedy.speed, 25, MazeStrategy.diagonalShortCut, Speedy.hitpoints);
        this.createVisual(Speedy.sprite, [20]);
    }
}
Speedy.speed = 7.0;
Speedy.frames = 20;
Speedy.hitpoints = 200;
Speedy.description = '该单位只是一个斑点，但速度超快, 血量比黑骑士更叼。相信我，它会是你的麻烦！';
Speedy.nickName = '光';
Speedy.sprite = 'newunit';
Speedy.rating = Speedy.speed * Speedy.hitpoints;
// types.units['Speedy'] = Speedy;

class Armos extends Unit
{
   constructor() {
        super(Armos.speed, 125, MazeStrategy.euclidean, Armos.hitpoints);
        this.createVisual(Armos.sprite, [4, 4, 4, 4], 1.2);
    }
}
Armos.speed = 1.0;
Armos.frames = 16;
Armos.hitpoints = 600;
Armos.description = '我不知取啥名了，反正集中火力，干掉他吧！注意：集中火力！';
Armos.nickName = '独眼暗黑骑士';
Armos.sprite = 'armos';
Armos.rating = Armos.speed * Armos.hitpoints;
// types.units['Armos'] = Armos;

class Sonic extends Unit
{
   constructor() {
        super(Sonic.speed, 20, MazeStrategy.manhattan, Sonic.hitpoints);
        this.createVisual(Sonic.sprite, [5]);
    }
}
Sonic.speed = 5.0;
Sonic.frames = 5;
Sonic.hitpoints = 1000;
Sonic.description = '索尼克，大BOSS';
Sonic.nickName = '索尼克';
Sonic.sprite = 'sonic';
Sonic.rating = Sonic.speed * Sonic.hitpoints;
// types.units['Sonic'] = Sonic;

*/