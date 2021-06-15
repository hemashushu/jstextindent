const { TextSelection } = require('jstextselection');

class TextIndent {

    /**
     * 缩进文本块
     *
     * @param {*} lineTextContents 每一行文本
     * @param {*} indentString 缩进字符串，一般是 2 个或 4 个空格，或者一个 Tab 字符。
     * @param {*} blockTextSelection 文本块的范围，即第一行文本的起始索引到最后一行
     *     文本结束的位置
     * @param {*} cursorTextSelection 当前光标的位置。
     * @returns 返回 {textContent, selection}
     */
    static indent(lineTextContents, indentString, blockTextSelection, cursorTextSelection) {
        let indentedLineTextContents = [];
        for (let lineTextContent of lineTextContents) {
            indentedLineTextContents.push(indentString + lineTextContent);
        }

        let indentedText = indentedLineTextContents.join('\n');

        // 计算新的光标位置
        let selectionAfter = new TextSelection(0);

        if (cursorTextSelection.start === blockTextSelection.start) {
            // 光标开始位置位于文本块第一行起始位置
            selectionAfter.start = blockTextSelection.start;
        } else {
            // 光标开始位置位于文本块第一行“非起始”位置，添加一个“缩进字符串的长度”
            selectionAfter.start = cursorTextSelection.start + indentString.length;
        }

        // 光标的结束位置增加：“缩进字符串的长度” × 行数
        selectionAfter.end = cursorTextSelection.end + (lineTextContents.length * indentString.length);

        return {
            textContent: indentedText,
            selection: selectionAfter
        };
    }

    /**
     * 反缩进文本块
     *
     * 每行的 Tab 字符、指定缩进字符串、或者（比指定缩进字符串短的）空格都
     * 会可能被删除。
     *
     * @param {*} lineTextContents 每一行文本
     * @param {*} indentString 缩进字符串，一般是 2 个或 4 个空格，或者一个 Tab 字符。
     * @param {*} blockTextSelection 文本块的范围，即第一行文本的起始索引到最后一行
     *     文本结束的位置
     * @param {*} cursorTextSelection 当前光标的位置。
     * @returns 返回 {textContent, selection}
     */
    static reverseIndent(lineTextContents, indentString, blockTextSelection, cursorTextSelection) {

        // 记录总共被删除了多少个字符，用于计算新的光标位置
        let totalRemoveChars = 0;

        // 记录第一行被删除了多少个空白字符，用于计算新的光标位置
        let firstLineRemoveCharCount = undefined;

        let reverseIndentedLineTextContents = [];
        for (let lineTextContent of lineTextContents) {
            if (lineTextContent.startsWith('\t')) { // tab char
                reverseIndentedLineTextContents.push(lineTextContent.substring(1, lineTextContent.length));
                if (firstLineRemoveCharCount === undefined) { // 仅记录第一行
                    firstLineRemoveCharCount = 1;
                }
                totalRemoveChars += 1;

            } else if (lineTextContent.startsWith(indentString)) { // 空格字符串（2 或 4 空格）
                reverseIndentedLineTextContents.push(lineTextContent.substring(indentString.length, lineTextContent.length));
                if (firstLineRemoveCharCount === undefined) { // 仅记录第一行
                    firstLineRemoveCharCount = indentString.length;
                }
                totalRemoveChars += indentString.length;

            } else {
                // 行首既不是 tab 字符，也不是指定的缩进字符串（比指定的缩进
                // 字符串短），则计算有多少个空格，把空格都删除。
                let spaceLength = 0;
                let match = /^(\s+)/.exec(lineTextContent);
                if (match !== null) {
                    let spaceChars = match[1];
                    spaceLength = spaceChars.length;
                }

                if (spaceLength > 0) {
                    lineTextContent = lineTextContent.substring(spaceLength);
                }

                reverseIndentedLineTextContents.push(lineTextContent);
                if (firstLineRemoveCharCount === undefined) { // 仅记录第一行
                    firstLineRemoveCharCount = spaceLength;
                }

                totalRemoveChars += spaceLength;
            }
        }

        let reverseIndentedText = reverseIndentedLineTextContents.join('\n');

        if (totalRemoveChars === 0) {
            // 没有任何前导的 Tab 字符或者空白字符
            return {
                textContent: reverseIndentedText,
                selection: cursorTextSelection
            };
        }

        // 计算新的光标位置
        let selectionAfter = new TextSelection(0);

        if (cursorTextSelection.start >= blockTextSelection.start + firstLineRemoveCharCount) {
            // 光标开始位置位于前导 Tab 字符或者缩进字符串的后面（index >= Tab 字符或缩进字符串长度）
            selectionAfter.start = cursorTextSelection.start - firstLineRemoveCharCount;
            selectionAfter.end = cursorTextSelection.end - totalRemoveChars;

        } else {
            // 光标开始位置位于前导 Tab 字符或者缩进字符串的后面（index < Tab 字符或缩进字符串长度）
            selectionAfter.start = blockTextSelection.start;
            if (cursorTextSelection.start === cursorTextSelection.end) {
                selectionAfter.end = selectionAfter.start;
            } else {
                selectionAfter.end = cursorTextSelection.end - totalRemoveChars;
            }
        }

        return {
            textContent: reverseIndentedText,
            selection: selectionAfter
        };
    }
}

module.exports = TextIndent;