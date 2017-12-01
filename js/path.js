/**
 *         ▂▃╬▄▄▃▂▁▁
 *  ●●●█〓██████████████▇▇▇▅▅▅▅▅▅▅▅▅▇▅▅          BUG
 *  ▄▅████☆RED █ WOLF☆██▄▄▃▂
 *  ████████████████████████████
 *  ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤
 *
 * 寻路行走控制类
 * @author 路漫漫
 * @link ahmerry@qq.com
 * @version
 * v2017/11/3 12:43 初版
 */
"use strict";
let PathFinderNodeType = {
    start: 1,
    end: 2,
    open: 4,
    close: 8,
    current: 16,
    path: 32
};
class Point
{
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    clone() {
        return new Point(this.x,this.y);
    }
    add(pt) {
        return new Point(this.x + pt.x,this.y + pt.y);
    }
    subtract(pt) {
        return new Point(this.x - pt.x,this.y - pt.y);
    }
    projectOn(pt) {
        return this.x * pt.x + this.y * pt.y;
    }
    norm() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    square() {
        return this.x * this.x + this.y * this.y;
    }
    scale(factor) {
        return new Point(this.x * factor,this.y * factor);
    }
    normalize() {
        let norm = 1.0 / this.norm();
        return this.scale(norm);
    }
    regularize() {
        if (this.x === 0 && this.y === 0)
            return new Point(2 * Math.round(Math.random()) - 1,2 * Math.round(Math.random()) - 1);
        return this;
    }
    toDirection() {
        if (this.x > this.y)
            return this.x > -this.y ? Direction.right : Direction.top;
        else if (this.x > -this.y)
            return Direction.bottom;
        return Direction.left;
    }
}

class Size
{
    constructor(width, height) {
        this.width = width || 0;
        this.height = height || 0;
    }
    clone() {
        return new Size(this.width,this.height);
    }
    /**
     * 分割成格子坐标
     * @param sz
     * @returns {*}
     */
    divide(sz) {
        return new Size(this.width / sz.width,this.height / sz.height);
    }
}

class PathFinderNode
{
    constructor() {
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.x = 0;
        this.y = 0;
        this.px = 0;
        this.py = 0;
    }
    clone() {
        let c = new PathFinderNode();
        c.f = this.f;
        c.g = this.g;
        c.h = this.h;
        c.x = this.x;
        c.y = this.y;
        c.px = this.px;
        c.py = this.py;
        return c;
    }
}

class PriorityQueue
{
    constructor(comparer, type) {
        this.type = type;
        this.innerList = [];
        this.comparer = comparer;
    }
    switchElements(i, j) {
        let h = this.innerList[i];
        this.innerList[i] = this.innerList[j];
        this.innerList[j] = h;
    }
    onCompare(i, j) {
        return this.comparer(this.innerList[i], this.innerList[j]);
    }
    push(item) {
        let p = this.innerList.length, p2;
        this.innerList.push(item);
        do {
            if (p === 0)
                break;
            p2 = ~~((p - 1) * 0.5);
            if (this.onCompare(p, p2) < 0) {
                this.switchElements(p, p2);
                p = p2;
            } else
                break;
        } while (true);return p;
    }
    pop() {
        let result = this.innerList[0];
        let p = 0, p1, p2, pn;
        this.innerList[0] = this.innerList[this.innerList.length - 1];
        this.innerList.splice(this.innerList.length - 1, 1);
        do {
            pn = p;
            p1 = 2 * p + 1;
            p2 = 2 * p + 2;
            if (this.innerList.length > p1 && this.onCompare(p, p1) > 0)
                p = p1;
            if (this.innerList.length > p2 && this.onCompare(p, p2) > 0)
                p = p2;
            if (p === pn)
                break;
            this.switchElements(p, pn);
        } while (true);return result;
    }
    update(i) {
        let p = i, pn;
        let p1, p2;
        do {
            if (p === 0)
                break;
            p2 = ~~((p - 1) * 0.5);
            if (this.onCompare(p, p2) < 0) {
                this.switchElements(p, p2);
                p = p2;
            } else
                break;
        } while (true);if (p < i)
            return;
        do {
            pn = p;
            p1 = 2 * p + 1;
            p2 = 2 * p + 2;
            if (this.innerList.length > p1 && this.onCompare(p, p1) > 0)
                p = p1;
            if (this.innerList.length > p2 && this.oCompare(p, p2) > 0)
                p = p2;
            if (p === pn)
                break;
            this.switchElements(p, pn);
        } while (true);
    }
    peek() {
        if (this.innerList.length)
            return this.innerList[0];
        return new this.type();
    }
    clear() {
        this.innerList = [];
    }
    count() {
        return this.innerList.length;
    }
    removeLocation(item) {
        let index = -1;
        for (let i = 0; i < this.innerList.length; i++) {
            if (this.comparer.compare(this.innerList[i], item) === 0)
                index = i;
        }
        if (index !== -1)
            this.innerList.splice(index, 1);
    }
    get(index) {
        return this.innerList[index];
    }
    set(index, value) {
        this.innerList[index] = value;
        this.update(index);
    }
}

/**
 * 游戏迷宫地图类
 */
class Maze
{
    constructor(size, start, end) {
        this.gridDim = size;
        let grid = [];
        for (let i = 0; i < size.width + 1; i++) {
            let a = [];
            for (let j = 0; j < size.height; j++)
                a.push(1);
            grid.push(a);
        }
        this.grid = grid;
        this.start = start || new Point(0,(size.height>>1));
        this.end = end || new Point(size.width,(size.height>>1));
        this.pf = new PathFinder(this.grid);
        this.pf.diagonals = false;
        this.paths = {};
    }
    isPointInGrid(point) {
        if (point.x > this.gridDim.width - 1 || point.x < 0){
            return false;
        }
        if (point.y > this.gridDim.height - 1 || point.y < 0){
            return false;
        }
        return true;
    }

    /**
     * 判断建造的各种条件是否具备
     * @param point
     * @param weight
     * @returns {boolean}
     */
    tryBuild(point, weight) {
        if (this.grid[point.x][point.y] !== 1)
            return false;
        else if (point.x === this.gridDim.width - 1 || point.x === 0)
            return false;
        this.grid[point.x][point.y] = weight || 0;
        this.pf.formula = MazeStrategy.euclidean;
        if (this.pf.findPath(this.start, this.end)) {
            this.paths = {};
            return true;
        } else {
            this.grid[point.x][point.y] = 1;
            return false;
        }
    }
    tryRemove(point) {
        if (this.grid[point.x][point.y] !== 1) {
            this.grid[point.x][point.y] = 1;
            this.paths = {};
            return true;
        }
        return false;
    }
    getPath(mazeStrategy) {
        if (mazeStrategy === MazeStrategy.air)
            return this.getPathAir();
        if (!this.paths[mazeStrategy])
            this.calculate(mazeStrategy);
        return this.paths[mazeStrategy];
    }
    getPathAir() {
        let path = [];
        for (let i = this.start.x; i < this.end.x + 1; ++i)
            path.push(new Point(i,this.start.y));
        return path;
    }
    calculate(mazeStrategy) {
        let path;
        if (mazeStrategy === MazeStrategy.air) {
            path = this.getPathAir();
        } else {
            path = [];
            this.pf.formula = mazeStrategy;
            let nodes = this.pf.findPath(this.start, this.end);
            for (let i = 0; i < nodes.length; i++)
                path.push(new Point(nodes[i].x,nodes[i].y));
        }
        this.paths[mazeStrategy] = path;
    }
}

/**
 * A *搜索算法的实现
 */
class PathFinder
{
    constructor(grid) {
        this.grid = grid;
        this.formula = MazeStrategy.manhattan;
        this.horiz = 0;
        this.stopped = true;
        this.diagonals = true;
        this.stop = false;
        this.heuristicEstimate = 2;
        this.punishChangeDirection = false;
        this.reopenCloseNodes = false;
        this.tieBreaker = false;
        this.heavyDiagonals = false;
        this.searchLimit = 2000;
        this.reset();
    }
    reset() {
        this.close = [];
        this.open = new PriorityQueue(function(x, y) {
                if (x.f > y.f)
                    return 1;
                else if (x.f < y.f)
                    return -1;
                return 0;
            }
            ,PathFinderNode);
    }
    findPath(start, end) {
        let me = this;
        let parentNode = new PathFinderNode();
        let found = false;
        let gridX = me.grid.length;
        let gridY = me.grid[0].length;
        me.stop = false;
        me.stopped = false;
        me.reset();
        let direction = me.diagonals ? Steps.WithDiagonals : Steps.OnlyStraight;
        let ndiag = me.diagonals ? 8 : 4;
        parentNode.g = 0;
        parentNode.h = me.heuristicEstimate;
        parentNode.f = parentNode.g + parentNode.h;
        parentNode.x = start.x;
        parentNode.y = start.y;
        parentNode.px = parentNode.x;
        parentNode.py = parentNode.y;
        me.open.push(parentNode);
        while (me.open.count() > 0 && !me.stop) {
            parentNode = me.open.pop();
            if (parentNode.x === end.x && parentNode.y === end.y) {
                me.close.push(parentNode);
                found = true;
                break;
            }
            if (me.close.length > me.searchLimit) {
                me.stopped = true;
                return;
            }
            if (me.punishChangeDirection)
                me.horiz = (parentNode.x - parentNode.px);
            for (let i = 0; i < ndiag; i++) {
                let newNode = new PathFinderNode();
                newNode.x = parentNode.x + direction[i][0];
                newNode.y = parentNode.y + direction[i][1];
                if (newNode.x < 0 || newNode.y < 0 || newNode.x >= gridX || newNode.y >= gridY)
                    continue;
                let newG = parentNode.g;
                if (me.heavyDiagonals && i > 3)
                    newG += ~~(me.grid[newNode.x][newNode.y] * 2.41);
                else
                    newG += this.grid[newNode.x][newNode.y];
                if (newG === parentNode.g)
                    continue;
                if (me.punishChangeDirection) {
                    if (newNode.x - parentNode.x && !me.horiz)
                        newG += 20;
                    if (newNode.y - parentNode.y && me.horiz)
                        newG += 20;
                }
                let foundInOpenIndex = -1;
                for (let j = 0, n = me.open.count(); j < n; j++) {
                    if (me.open.get(j).x === newNode.x && me.open.get(j).y === newNode.y) {
                        foundInOpenIndex = j;
                        break;
                    }
                }
                if (foundInOpenIndex !== -1 && me.open.get(foundInOpenIndex).g <= newG)
                    continue;
                let foundInCloseIndex = -1;
                for (let j = 0, n = me.close.length; j < n; j++) {
                    if (me.close[j].x === newNode.x && me.close[j].y === newNode.y) {
                        foundInCloseIndex = j;
                        break;
                    }
                }
                if (foundInCloseIndex !== -1 && (me.reopenCloseNodes || me.close[foundInCloseIndex].g <= newG))
                    continue;
                newNode.px = parentNode.x;
                newNode.py = parentNode.y;
                newNode.g = newG;
                switch (me.formula) {
                    case MazeStrategy.maxDXDY:
                        newNode.h = me.heuristicEstimate * (Math.max(Math.abs(newNode.x - end.x), Math.abs(newNode.y - end.y)));
                        break;
                    case MazeStrategy.diagonalShortCut:
                        let h_diagonal = Math.min(Math.abs(newNode.x - end.x), Math.abs(newNode.y - end.y));
                        let h_straight = (Math.abs(newNode.x - end.x) + Math.abs(newNode.y - end.y));
                        newNode.h = (me.heuristicEstimate * 2) * h_diagonal + me.heuristicEstimate * (h_straight - 2 * h_diagonal);
                        break;
                    case MazeStrategy.euclidean:
                        newNode.h = ~~(me.heuristicEstimate * Math.sqrt(Math.pow((newNode.x - end.x), 2) + Math.pow((newNode.y - end.y), 2)));
                        break;
                    case MazeStrategy.euclideanNoSQR:
                        newNode.h = ~~(me.heuristicEstimate * (Math.pow((newNode.x - end.x), 2) + Math.pow((newNode.y - end.y), 2)));
                        break;
                    case MazeStrategy.custom:
                        let dxy = new Point(Math.abs(end.x - newNode.x),Math.abs(end.y - newNode.y));
                        let orthogonal = Math.abs(dxy.x - dxy.y);
                        let diagonal = Math.abs(((dxy.x + dxy.y) - orthogonal) * 0.5);
                        newNode.h = me.heuristicEstimate * (diagonal + orthogonal + dxy.x + dxy.y);
                        break;
                    case MazeStrategy.manhattan:
                    default:
                        newNode.h = me.heuristicEstimate * (Math.abs(newNode.x - end.x) + Math.abs(newNode.y - end.y));
                        break;
                }
                if (me.tieBreaker) {
                    let dx1 = parentNode.x - end.x;
                    let dy1 = parentNode.y - end.y;
                    let dx2 = start.x - end.x;
                    let dy2 = start.y - end.y;
                    let cross = Math.abs(dx1 * dy2 - dx2 * dy1);
                    newNode.h = ~~(newNode.h + cross * 0.001);
                }
                newNode.f = newNode.g + newNode.h;
                me.open.push(newNode);
            }
            me.close.push(parentNode);
        }
        if (found) {
            let fNode = me.close[me.close.length - 1].clone();
            for (let i = me.close.length - 1; i >= 0; i--) {
                if ((fNode.px === me.close[i].x && fNode.py === me.close[i].y) || i === me.close.Count - 1)
                    fNode = me.close[i].clone();
                else
                    me.close.splice(i, 1);
            }
            me.stopped = true;
            return me.close;
        }
        me.stopped = true;
    }
}