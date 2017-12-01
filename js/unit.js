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
class DogUnit extends Unit
{
    constructor() {
        super(DogUnit.speed, 100, MazeStrategy.manhattan, DogUnit.hitpoints);
        this.createVisual(DogUnit.sprite, DogUnit.frames);
    }
}
DogUnit.speed = 2.0;
DogUnit.frames = [4, 4, 4, 4];
DogUnit.hitpoints = 10;
DogUnit.description = '';
DogUnit.nickName = '战狗';
DogUnit.sprite = 'dogUnit';
DogUnit.rating = DogUnit.speed * DogUnit.hitpoints;
types.units['DogUnit'] = DogUnit;

class MaxierUnit extends Unit
{
    constructor() {
        super(MaxierUnit.speed, 80, MazeStrategy.euclideanNoSQR, MaxierUnit.hitpoints);
        this.createVisual(MaxierUnit.sprite, MaxierUnit.frames);
    }
}
MaxierUnit.speed = 2.0;
MaxierUnit.frames = [4, 4, 4, 4];
MaxierUnit.hitpoints = 20;
MaxierUnit.description = '';
MaxierUnit.nickName = '马歇尔';
MaxierUnit.sprite = 'maxierUnit';
MaxierUnit.rating = MaxierUnit.speed * MaxierUnit.hitpoints;
types.units['MaxierUnit'] = MaxierUnit;

class PaluUnit extends Unit
{
    constructor() {
        super(PaluUnit.speed, 70, MazeStrategy.manhattan, PaluUnit.hitpoints);
        this.createVisual(PaluUnit.sprite, PaluUnit.frames);
    }
}
PaluUnit.speed = 3.0;
PaluUnit.frames = [4, 4, 4, 4];
PaluUnit.hitpoints = 30;
PaluUnit.description = '';
PaluUnit.nickName = '帕鲁';
PaluUnit.sprite = 'paluUnit';
PaluUnit.rating = PaluUnit.speed * PaluUnit.hitpoints;
types.units['PaluUnit'] = PaluUnit;

class SkyUnit extends Unit
{
    constructor() {
        super(SkyUnit.speed, 50, MazeStrategy.air, SkyUnit.hitpoints);
        this.createVisual(SkyUnit.sprite, SkyUnit.frames);
    }
}
SkyUnit.speed = 2.0;
SkyUnit.frames = [4];
SkyUnit.hitpoints = 40;
SkyUnit.description = '';
SkyUnit.nickName = '';
SkyUnit.sprite = 'skyUnit';
SkyUnit.rating = SkyUnit.speed * SkyUnit.hitpoints * 1.2;
types.units['SkyUnit'] = SkyUnit;

class GmsUnit extends Unit
{
    constructor() {
        super(GmsUnit.speed, 25, MazeStrategy.diagonalShortCut, GmsUnit.hitpoints);
        this.createVisual(GmsUnit.sprite, GmsUnit.frames);
    }
}
GmsUnit.speed = 6.0;
GmsUnit.frames = [4, 4, 4, 4];
GmsUnit.hitpoints = 300;
GmsUnit.description = '';
GmsUnit.nickName = '戈麦斯';
GmsUnit.sprite = 'gmsUnit';
GmsUnit.rating = GmsUnit.speed * GmsUnit.hitpoints;
types.units['GmsUnit'] = GmsUnit;

class BlackTank extends Unit
{
    constructor() {
        super(BlackTank.speed, 20, MazeStrategy.manhattan, BlackTank.hitpoints);
        this.createVisual(BlackTank.sprite, BlackTank.frames);
    }
}
BlackTank.speed = 5.0;
BlackTank.frames = [4, 4, 4, 4];
BlackTank.hitpoints = 1000;
BlackTank.description = '大BOSS';
BlackTank.nickName = '黑色战车';
BlackTank.sprite = 'blackTank';
BlackTank.rating = BlackTank.speed * BlackTank.hitpoints;
types.units['BlackTank'] = BlackTank;


/*

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

*/