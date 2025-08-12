let colors = ["#DCDCDC", "#DC143C", "#00FFFF", "#1E90FF", "#FF00FF", "#32CD32", "#FFD700", "#FF6347"];
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 500;

class Box {
    constructor(data = null) {
        if (data == null) {
            data = [];
            for (let i = 0; i < 5; i++) {
                data[i] = [];
                // space=0, cao=1, sodier=2, general=3~7
                for (let j = 0; j < 4; j++) {
                    data[i][j] = 0;
                }
            }
        }
        this.data = data;
        
        // this.sodiers = []
        this.generls = {};
        this.cao = null;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 4; j++) {
                if (data[i][j] == 1 && this.cao == undefined) this.cao = [i, j];
                // if (data[i][j] == 2) this.sodiers.push([i, j]);
                if (data[i][j] >= 3 && this.generls[data[i][j]] == undefined) {
                    if (j + 1 < 4 && data[i][j + 1] == data[i][j]) 
                        this.generls[data[i][j]] = [i, j, 1];
                    else if (data[i + 1] != undefined && data[i + 1][j] == data[i][j]) 
                        this.generls[data[i][j]] = [i, j, 0];
                }
            }
        }
    }
    movable(ix, iy, direction) {
        if (direction[0] == 0 && direction[1] == 0) return true;
        if (direction[0] != 0 && direction[1] != 0) {
            let a = this.movable(ix, iy, [direction[0], 0]);
            let b = this.movable(ix, iy, [0, direction[1]]);
            return a && b;
        }
        let type = 0;
        if (direction[0] == 0) type = 1;

        let id = this.data[ix][iy];
        if (id == 0) return true;
        if (id == 2) {
            for (let i = 0; i < Math.abs(direction[type]); i++) {
                if (direction[type] > 0) {
                    if (type == 0) ix++;
                    else iy++;
                } else {
                    if (type == 0) ix--;
                    else iy--;
                }
                if (ix < 0 || ix >= 5 || iy < 0 || iy >= 4) return false;
                if (this.data[ix][iy]) return false;
            }
            return true;
        }
        let pos, check;// check = 0: +i, check=1: +j
        if (id == 1) {
            pos = [this.cao[0], this.cao[1]];
            // pos[1] += 1;
            check = 0;
        } else {
            pos = [this.generls[id][0], this.generls[id][1]];
            check = this.generls[id][2];
        }

        for (let i = 0; i < Math.abs(direction[type]); i++) {
            if (direction[type] > 0) pos[type]++;
            else pos[type]--;
            if (pos[0] < 0 || pos[0] >= 5 || pos[1] < 0 || pos[1] >= 4) return false;
            if (this.data[pos[0]][pos[1]] != 0 && this.data[pos[0]][pos[1]] != id) return false;
            pos[check]++;
            if (pos[0] < 0 || pos[0] >= 5 || pos[1] < 0 || pos[1] >= 4) return false;
            if (this.data[pos[0]][pos[1]] != 0 && this.data[pos[0]][pos[1]] != id) return false;
            pos[check]--;
        }
        if (id == 1) {
            pos = [this.cao[0], this.cao[1]];
            pos[1] += 1;
            for (let i = 0; i < Math.abs(direction[type]); i++) {
                if (direction[type] > 0) pos[type]++;
                else pos[type]--;
                if (pos[0] < 0 || pos[0] >= 5 || pos[1] < 0 || pos[1] >= 4) return false;
                if (this.data[pos[0]][pos[1]] != 0 && this.data[pos[0]][pos[1]] != id) return false;
                pos[check]++;
                if (pos[0] < 0 || pos[0] >= 5 || pos[1] < 0 || pos[1] >= 4) return false;
                if (this.data[pos[0]][pos[1]] != 0 && this.data[pos[0]][pos[1]] != id) return false;
                pos[check]--;
            }
            pos[1] -= 1;
        }
        return true;
    }
    move(ix, iy, direction) {
        if (direction[0] == 0 && direction[1] == 0) return true;
        if (direction[0] != 0 && direction[1] != 0) {
            let a = this.move(ix, iy, [direction[0], 0]);
            let b = this.move(ix, iy, [0, direction[1]]);
            return a && b;
        }
        let type = 0;
        if (direction[0] == 0) type = 1;

        let id = this.data[ix][iy];
        if (id == 0) return true;
        if (id == 2) {
            let [ox, oy] = [ix, iy]
            for (let i = 0; i < Math.abs(direction[type]); i++) {
                if (direction[type] > 0) {
                    if (type == 0) ix++;
                    else iy++;
                } else {
                    if (type == 0) ix--;
                    else iy--;
                }
                if (ix < 0 || ix >= 5 || iy < 0 || iy >= 4) return false;
                if (this.data[ix][iy]) return false;
            }
            this.data[ox][oy] = 0;
            this.data[ix][iy] = id;
            return true;
        }
        let pos, check;// check = 0: +i, check=1: +j
        if (id == 1) {
            pos = [this.cao[0], this.cao[1]];
            // pos[1] += 1;
            check = 0;
        } else {
            pos = [this.generls[id][0], this.generls[id][1]];
            check = this.generls[id][2];
        }
        let opos = [pos[0], pos[1]];

        for (let i = 0; i < Math.abs(direction[type]); i++) {
            if (direction[type] > 0) pos[type]++;
            else pos[type]--;
            if (pos[0] < 0 || pos[0] >= 5 || pos[1] < 0 || pos[1] >= 4) return false;
            if (this.data[pos[0]][pos[1]] != 0 && this.data[pos[0]][pos[1]] != id) return false;
            pos[check]++;
            if (pos[0] < 0 || pos[0] >= 5 || pos[1] < 0 || pos[1] >= 4) return false;
            if (this.data[pos[0]][pos[1]] != 0 && this.data[pos[0]][pos[1]] != id) return false;
            pos[check]--;
        }
        if (id == 1) {
            pos = [this.cao[0], this.cao[1]];
            pos[1] += 1;
            for (let i = 0; i < Math.abs(direction[type]); i++) {
                if (direction[type] > 0) pos[type]++;
                else pos[type]--;
                if (pos[0] < 0 || pos[0] >= 5 || pos[1] < 0 || pos[1] >= 4) return false;
                if (this.data[pos[0]][pos[1]] != 0 && this.data[pos[0]][pos[1]] != id) return false;
                pos[check]++;
                if (pos[0] < 0 || pos[0] >= 5 || pos[1] < 0 || pos[1] >= 4) return false;
                if (this.data[pos[0]][pos[1]] != 0 && this.data[pos[0]][pos[1]] != id) return false;
                pos[check]--;
            }
            pos[1] -= 1;
        }
        if (id == 1) {
            // pos[1] -= 1;
            // opos[1] -= 1;
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    this.data[opos[0] + i][opos[1] + j] = 0;
                }
            }
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    this.data[pos[0] + i][pos[1] + j] = id;
                }
            }
            this.cao = pos;
            return true;
        } else {
            this.data[opos[0]][opos[1]] = 0;
            opos[check]++;
            this.data[opos[0]][opos[1]] = 0;

            this.data[pos[0]][pos[1]] = id;
            pos[check]++;
            this.data[pos[0]][pos[1]] = id;
            pos[check]--;

            this.generls[id][0] = pos[0];
            this.generls[id][1] = pos[1];
            return true;
        }
    }
    win() {
        return this.data[4][1] == 1 && this.data[4][2] == 1;
    }
    draw() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 4; j++) {
                ctx.fillStyle = colors[this.data[i][j]];
                ctx.fillRect(j * 100, i * 100, 100, 100);
                ctx.strokeWidth = 1;
                ctx.strokeStyle = "#ffffff";
                ctx.strokeRect(j * 100, i * 100, 100, 100);
            }
        }
    }
    hash() {
        let out = 0n;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 4; j++) {
                out = (out << 3n) | BigInt(this.data[i][j]);
            }
        }
        return out;
    }
    fromHash(hash) {
        let data = [];
        for (let i = 0; i < 5; i++) {
            data[i] = [];
            for (let j = 0; j < 4; j++) {
                data[i][j] = 0;
            }
        }
        for (let i = 4; i >= 0; i--) {
            for (let j = 3; j >= 0; j--) {
                data[i][j] = Number(hash & 7n);
                hash >>= 3n;
            }
        }
        this.data = data;

        this.generls = {};
        this.cao = null;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 4; j++) {
                if (data[i][j] == 1 && this.cao == undefined) this.cao = [i, j];
                // if (data[i][j] == 2) this.sodiers.push([i, j]);
                if (data[i][j] >= 3 && this.generls[data[i][j]] == undefined) {
                    if (j + 1 < 4 && data[i][j + 1] == data[i][j]) 
                        this.generls[data[i][j]] = [i, j, 1];
                    else if (data[i + 1] != undefined && data[i + 1][j] == data[i][j]) 
                        this.generls[data[i][j]] = [i, j, 0];
                }
            }
        }
    }
}
function bfs(box) {
    let queue = [];
    let visited = new Set();
    let dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    // let graph = {};
    queue.push([box.hash(), null]);
    while (queue.length > 0) {
        let node = queue.shift();
        state = node[0]
        if (visited.has(state)) continue;
        visited.add(state);
        let currentBox = new Box();
        // currentBox.fromHash(state);
        for (let k = 0; k < 4; k++) {
            let map = {};
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 4; j++) {
                    currentBox.fromHash(state);
                    let id = currentBox.data[i][j];
                    if (id == 0) continue;
                    if (id != 2 && map[id]) continue;
                    map[id] = true;
                    if (currentBox.move(i, j, dirs[k])) {
                        let newHash = currentBox.hash();
                        if (visited.has(newHash)) {
                            // currentBox.move(i, j, [-dirs[k][0], -dirs[k][1]]);
                            continue;
                        }
                        // graph[newHash] = state;
                        if (currentBox.win()) {
                            return [visited, [[i, j, dirs[k]], node[1]]];
                        }
                        queue.push([newHash, [[i, j, dirs[k]], node[1]]]);
                        // currentBox.move(i, j, [-dirs[k][0], -dirs[k][1]]);
                    }
                }
            }
        }
        // continue;
    }
    return [visited, null];
}

let box;

let flg = false;
let win = false;
let oi, oj;
canvas.onmousemove = function (e) {
    if (win || solution) return;
    let j = Math.floor(e.offsetX / 100);
    let i = Math.floor(e.offsetY / 100);
    // console.log(i, j, box.data[i][j]);
    if (j < 0 || j >= 4 || i < 0 || i >= 5) return;
    if (box.data[i][j] == 0) return;
    box.draw();
    ctx.strokeStyle = "#A9A9A9";
    let w = 100, h = 100;
    if (box.data[i][j] == 1) {
        w = 200;
        h = 200;
    }
    if (box.data[i][j] >= 3) {
        if (box.generls[box.data[i][j]][2] == 0) h = 200;
        else w = 200;
    }
    let [ti, tj] = [i, j];
    if (box.data[i][j] == 1) {
        [ti, tj] = box.cao;
    } else if (box.data[i][j] >= 3) {
        ti = box.generls[box.data[i][j]][0];
        tj = box.generls[box.data[i][j]][1];
    }
    ctx.strokeWidth = w * h / 5000;
    ctx.strokeRect(tj * 100, ti * 100, w, h);
}
canvas.onclick = function (e) {
    if (win || solution) return;
    let j = Math.floor(e.offsetX / 100);
    let i = Math.floor(e.offsetY / 100);
    // console.log(i, j, box.data[i][j]);
    if (j < 0 || j >= 4 || i < 0 || i >= 5) return;
    if (flg) {
        // console.log(oi, oj, i, j)
        let direction = [i - oi, j - oj];
        // console.log(direction);
        if (box.data[oi][oj] == 1) {
            [oi, oj] = box.cao;
        } else if (box.data[oi][oj] >= 3) {
            let ti = box.generls[box.data[oi][oj]][0];
            let tj = box.generls[box.data[oi][oj]][1];
            oi = ti;
            oj = tj;
        }
        box.move(oi, oj, direction);
        box.draw();
        if (box.win()) {
            document.getElementById("output").style.display = "block";
            win = true;
        }
        flg = false;
        return;
    }
    if (box.data[i][j] == 0) return;
    oi = i, oj = j;
    flg = true;
    box.draw();
    ctx.strokeStyle = "#696969"
    let w = 100, h = 100;
    if (box.data[oi][oj] == 1) {
        w = 200;
        h = 200;
    }
    if (box.data[oi][oj] >= 3) {
        if (box.generls[box.data[oi][oj]][2] == 0) h = 200;
        else w = 200;
    }
    let [ti, tj] = [oi, oj];
    if (box.data[oi][oj] == 1) {
        [ti, tj] = box.cao;
    } else if (box.data[oi][oj] >= 3) {
        ti = box.generls[box.data[oi][oj]][0];
        tj = box.generls[box.data[oi][oj]][1];
    }
    ctx.strokeWidth = w * h / 10000;
    ctx.strokeRect(tj * 100, ti * 100, w, h);
}

let solution = false, solutionStep = 0;
/*
3114
3114
5667
5007
2222
*/
function newGame() {
    win = false;
    solution = false;
    document.getElementById("stepCount").innerText = "";
    let input = document.getElementById("input").value;
    let data;
    if (input) {
        let lines = input.split("\n");
        data = [];
        for (let i = 0; i < 5; i++) {
            data.push([]);
            for (let j = 0; j < 4; j++) {
                data[i].push(parseInt(lines[i].charAt(j)));
            }
        }
        console.log(data)
    } else {
        // data = [
        //     [3, 1, 1, 4],
        //     [3, 1, 1, 4],
        //     [5, 6, 6, 7],
        //     [5, 0, 0, 7],
        //     [2, 2, 2, 2]
        // ];
        data = [
            [4, 5, 5, 2],
            [4, 0, 2, 2],
            [2, 1, 1, 3],
            [2, 1, 1, 3],
            [2, 2, 0, 2]
        ];
    }
    box = new Box(data);
    box.draw();
}
newGame();
document.getElementById("start").onclick = function() {
    document.getElementById("output").style.display = "none";
    document.getElementById("step").style.display = "none";
    document.getElementById("tipsOutput").style.display = "none";
    newGame();
};

let tips = [];
document.getElementById("tips").onclick = function() {
    if (win || solution) return;
    tips = [];
    let st = new Date().getTime();
    let [visited, result] = bfs(box);
    if (result == null) {
        document.getElementById("tipsOutput").style.display = "block";
        document.getElementById("tipsOutput").innerText = "没有找到解法";
        return;
    }
    let end = new Date().getTime();
    solution = true;
    solutionStep = 0;
    console.log(result);
    document.getElementById("step").style.display = "inline";
    let node = result;
    while (node != null) {
        tips.unshift(node[0]);
        node = node[1];
    }
    console.log(tips);
    document.getElementById("tipsOutput").style.display = "block";
    document.getElementById("tipsOutput").innerHTML = "<p>找到解法！遍历了共计 " + visited.size + " 个状态; 用时 " + (end - st) + " 毫秒. </p><p>最优解有 " + tips.length + " 步.</p><p style='color: red;'>本局将禁止用户操作.</p>";
    drawTip();
}
document.getElementById("step").onclick = function() {
    if (win || !solution) return;
    if (solutionStep >= tips.length) {
        return;
    }
    let tip = tips[solutionStep];
    let [i, j, direction] = tip;
    box.move(i, j, direction);
    box.draw();
    solutionStep++;
    if (box.win()) {
        document.getElementById("output").style.display = "block";
        win = true;
        return;
    }
    drawTip();
}

function drawArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color){
    var headlen = 10;
    var angle = Math.atan2(toy-fromy,tox-fromx);
 
    ctx.save();
    ctx.strokeStyle = color;
 
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineWidth = arrowWidth;
    ctx.stroke();
 
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
 

    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
               toy-headlen*Math.sin(angle+Math.PI/7));
 
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
 
    ctx.stroke();
    ctx.restore();
}
function drawTip() {
    if (solutionStep >= tips.length) {
        // document.getElementById("tipsOutput").innerText = "没有更多提示了";
        return;
    }
    let tip = tips[solutionStep];
    let [i, j, direction] = tip;
    drawArrow(ctx, j * 100 + 50, i * 100 + 50, j * 100 + 50 + direction[1] * 100, i * 100 + 50 + direction[0] * 100, 5, "#2F4F4F");
    document.getElementById("stepCount").innerText = "第 " + (solutionStep + 1) + "/" + tips.length + " 步提示";
}