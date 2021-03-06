import { HTMLTags } from '../../render.js'
import { Commands } from '../../controls.js'
import { getRandomInt } from '../../utils.js'

const defaultStyleClasses = {
    table: {
        main: 'align_center no-border',
        row: 'align_center',
        data: 'width_19'
    },
};

export const CellType = {
    Player: 'PLAYER',
    Cell: {
        Empty: 'CELL-EMPTY',
        Wall: 'CELL-WALL',
        Invisible: 'CELL-INVISIBLE',
    },
    Flag: {
        NotUsed: 'FLAG-NORMAL',
        Used: 'FLAG-USED',
    },
    Door: {
        Next: 'DOOR-NEXT',
        Prev: 'DOOR-PREV',
        Closed: 'DOOR-CLOSED',
    },
};

const CellContent = {
    [CellType.Player]: {
        Value: '@',
        Class: 'map-player',
    },
    [CellType.Cell.Empty]: {
        Value: '.',
        Class: '',
    },
    [CellType.Cell.Wall]: {
        Value: '#',
        Class: '',
    },
    [CellType.Cell.Invisible]: {
        Value: '&nbsp;',
        Class: '',
    },

    [CellType.Flag.NotUsed]: {
        Value: 'F',
        Class: 'map-flag-not-used',
    },
    [CellType.Flag.Used]: {
        Value: '!',
        Class: 'map-flag-used',
    },
    [CellType.Door.Next]: {
        Value: '>',
        Class: 'map-door-open',
    },
    [CellType.Door.Prev]: {
        Value: '<',
        Class: 'map-door-open',
    },
    [CellType.Door.Closed]: {
        Value: 'X',
        Class: 'map-door-close',
    },
};

export function testGenerator(width, height, params) {
    let result = {
        map: new Array(height),
        position: { x: 0, y: 0 },
        flags: { notUsedCount: params.flagCount, list: [] },
        doors: {
            prev: { position: null, isOpen: true },
            next: { position: null, isOpen: false }
        },
    };

    for (let y = 0; y < height; y++) {
        result.map[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            result.map[y][x] = CellType.Cell.Empty;
        }
        result.map[y][0] = CellType.Cell.Wall;
        result.map[y][width - 1] = CellType.Cell.Wall;
    }

    for (let x = 0; x < width; x++) {
        result.map[0][x] = CellType.Cell.Wall;
        result.map[height - 1][x] = CellType.Cell.Wall;
    }

    const wallCount = Math.round((height + width) / 2);
    for (let i = 0; i < wallCount; i++) {
        let x = getRandomInt(1, width - 1);
        let y = getRandomInt(1, height - 1);
        result.map[y][x] = CellType.Cell.Wall;
    }

    function findFreeCell() {
        while (true) {
            let x = getRandomInt(1, width - 2);
            let y = getRandomInt(1, height - 2);
            if (result.map[y][x] == CellType.Cell.Empty) {
                return { x, y };
            }
        }
    }
    result.position = findFreeCell();

    result.doors.prev.position = { x: result.position.x, y: result.position.y };
    result.map[result.position.y][result.position.x] = CellType.Door.Prev;

    for (let i = 0; i < params.flagCount; i++) {
        let flag = { position: findFreeCell(), used: false };
        result.map[flag.position.y][flag.position.x] = CellType.Flag.NotUsed;
        result.flags.list.push(flag);
    }

    result.doors.next.position = findFreeCell();
    result.doors.next.isOpen = params.flagCount > 0;
    result.map[result.doors.next.position.y][result.doors.next.position.x] = params.flagCount > 0
        ? CellType.Door.Closed
        : CellType.Door.Next;

    return result;
}

export function MapComponent(width, height, params = { fieldOfView: () => 12, flagCount: 3 }, generator = testGenerator, css = defaultStyleClasses) {
    let instance = this;
    this.mainController = undefined;
    this.styleClasses = css;
    this.config = { width, height, params, primaryGenerator: generator, generator: () => generator(width, height, params) };

    this.map = undefined;

    function isInMap(x, y) {
        return y >= 0 || y < instance.config.height
            && x >= 0 || x < instance.config.width;
    }

    function tryMove(position, xMove, yMove) {
        const x = xMove(position.x);
        const y = yMove(position.y);
        if (isInMap(x, y) && instance.map.map[y][x] != CellType.Cell.Wall) {
            position.x = x;
            position.y = y;
        }
    }

    this.mapObjectActions = {
        [CellType.Flag.NotUsed]: function(position) {
            if (instance.map.flags.notUsedCount > 0) {
                instance.map.map[position.y][position.x] = CellType.Flag.Used;
                let flag = instance.map.flags.list.find(value =>
                    value.position.x == position.x && value.position.y == position.y);
                if (flag) {
                    flag.used = true;
                    instance.map.flags.notUsedCount--;
                    if (instance.map.flags.notUsedCount < 1) {
                        instance.map.doors.next.isOpen = true;
                        let doorPos = instance.map.doors.next.position;
                        instance.map.map[doorPos.y][doorPos.x] = CellType.Door.Next;
                    }
                }
            }
        },
        [CellType.Door.Prev]: function(position) {
            alert('prev');
        },
        [CellType.Door.Next]: function(position) {
            alert('next');
        },
        [CellType.Door.Closed]: function(position) {
            alert('closed');
        },
    };

    function tryUseObject(position) {
        if (!isInMap(position.x, position.y)) return;
        const cell = instance.map.map[position.y][position.x];
        const action = instance.mapObjectActions[cell];
        if (action) {
            action(position);
        }
    }

    this.commandActions = {
        [Commands.Up]: function() {
            tryMove(instance.map.position, x => x, y => y - 1);
            tryUseObject(instance.map.position);
        },
        [Commands.Down]: function() {
            tryMove(instance.map.position, x => x, y => y + 1);
            tryUseObject(instance.map.position);
        },
        [Commands.Left]: function() {
            tryMove(instance.map.position, x => x - 1, y => y);
            tryUseObject(instance.map.position);
        },
        [Commands.Right]: function() {
            tryMove(instance.map.position, x => x + 1, y => y);
            tryUseObject(instance.map.position);
        },
        [Commands.Use]: function() {},
        [Commands.Back]: function() {},
    };
}

MapComponent.prototype = {
    customInit: function(mainController) {},
    init(mainController) {
        this.mainController = mainController;
        this.map = this.config.generator();
        if (this.customInit) {
            this.customInit(mainController);
        }
    },
    executeCommand(command) {
        let action = this.commandActions[command];
        if (action) {
            action();
        }
    },
    createElement() {
        let table = {
            tag: HTMLTags.Table,
            attributes: { class: this.styleClasses.table.main, cellspacing: 0 },
            childs: []
        };

        const fov = this.config.params.fieldOfView();
        for (let y = -fov; y <= fov; y++) {
            let tableRow = {
                tag: HTMLTags.TableRow,
                attributes: { class: this.styleClasses.table.row },
                childs: []
            };

            for (let x = -fov; x <= fov; x++) {
                let currentCell;
                if (x == 0 && y == 0) {
                    currentCell = CellContent[CellType.Player];
                } else {
                    let px = this.map.position.x + x;
                    let py = this.map.position.y + y;
                    if (px < 0 || px >= this.config.width || py < 0 || py >= this.config.height) {
                        currentCell = CellContent[CellType.Cell.Invisible];
                    } else {
                        let cell = this.map.map[py][px];
                        currentCell = CellContent[cell];
                    }
                }
                let currentCellClass = this.styleClasses.table.data;
                if (currentCell.Class) {
                    currentCellClass += ' ' + currentCell.Class;
                }
                tableRow.childs.push({
                    tag: HTMLTags.TableData,
                    attributes: { class: currentCellClass },
                    value: currentCell.Value
                });
            }

            table.childs.push(tableRow);
        }

        return table;
    }
};