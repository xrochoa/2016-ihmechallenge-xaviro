/*----------  DEDENT  ----------*/
// Tagged-template helper that strips the minimum common leading whitespace
// from every line. Replaces the original `babel-plugin-dedent` dependency.

export function dedent(strings, ...values) {
    let raw = typeof strings === 'string' ? strings : strings.raw || strings;
    let result = '';
    if (typeof raw === 'string') {
        result = raw;
    } else {
        for (let i = 0; i < raw.length; i++) {
            result += raw[i];
            if (i < values.length) result += values[i];
        }
    }

    const lines = result.split('\n');
    let indent = Infinity;
    for (const line of lines) {
        const match = line.match(/^(\s+)\S/);
        if (match) indent = Math.min(indent, match[1].length);
    }
    if (indent !== Infinity) {
        const re = new RegExp('^' + ' '.repeat(indent));
        for (let i = 0; i < lines.length; i++) lines[i] = lines[i].replace(re, '');
    }
    return lines.join('\n').trim();
}
