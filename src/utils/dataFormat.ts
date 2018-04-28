export default function dataFormat(data): any[] {
    if (data && data.dataSet && data.dataSet.length > 0 && data.dataSet[0] !== null) {
        return data.dataSet;
    }
    return [];
}
export function splitNumber(source: number, target: number, slice = 30): number[] {
    const delta = target - source;
    const everyDelta = Math.floor(delta / slice);
    let split = [];
    if (delta === 0 || target === delta || everyDelta === 0) {
        split = new Array(slice).fill(target)
    } 
    else {
        let next = source;
        for (let i = 0; i < slice; i++) {
            const d = Math.round(Math.random() * (everyDelta / 10) + everyDelta);
            next = next + d;
            if (next >= target) {
                split.push(target)
            } else {
                if (i === slice - 1) {
                    split.push(target);
                } else {
                    split.push(next);
                }
            }
        }
        
    }
    return split;
}


function parseColor(hexStr) {
    return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
}
function pad(s) {
    return (s.length === 1) ? '0' + s : s;
};

export function gradient(start, end, steps, gamma = 1) {
    var i, j, ms, me, output = [], so = [];
    var normalize = function (channel) {
        return Math.pow(channel / 255, gamma);
    };
    start = parseColor(start).map(normalize);
    end = parseColor(end).map(normalize);
    for (i = 0; i < steps; i++) {
        ms = i / (steps - 1);
        me = 1 - ms;
        for (j = 0; j < 3; j++) {
            so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
        }
        output.push('#' + so.join(''));
    }
    return output;
}
