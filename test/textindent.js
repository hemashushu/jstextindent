const assert = require('assert/strict');

const { TextSelection } = require('jstextselection');
const { TextLineReader } = require('jstextlinereader');

const { TextIndent } = require('../index');

describe('TextIndent Test', () => {
    it('Test indent', () => {
        let textContent1 = '0123\n5678\nabcde';
        let cursorTextSelection1 = new TextSelection(0, 15);
        let textLineReader1 = new TextLineReader(textContent1, cursorTextSelection1);

        let lineTextContents1 = textLineReader1.getSelectedTextLines()
            .map( textLine => textLine.textContent);

        let selectionInfo1 = textLineReader1.selectionInfo;
        let blockTextSelection1 = new TextSelection(
            selectionInfo1.startPositionOfSelectedLines,
            selectionInfo1.endPositionOfSelectedLines);

        let result1 = TextIndent.indent(lineTextContents1, '  ', blockTextSelection1, cursorTextSelection1);
        assert.equal(result1.textContent, '  0123\n  5678\n  abcde');
        assert.equal(result1.selection.start, 0);
        assert.equal(result1.selection.end, 21);

        // TODO::
    });

    it('Test reverseIndent', () => {
        let textContent1 = '  0123\n  5678\n  abcde';
        let cursorTextSelection1 = new TextSelection(0, 21);
        let textLineReader1 = new TextLineReader(textContent1, cursorTextSelection1);

        let lineTextContents1 = textLineReader1.getSelectedTextLines()
            .map( textLine => textLine.textContent);

        let selectionInfo1 = textLineReader1.selectionInfo;
        let blockTextSelection1 = new TextSelection(
            selectionInfo1.startPositionOfSelectedLines,
            selectionInfo1.endPositionOfSelectedLines);

        let result1 = TextIndent.reverseIndent(lineTextContents1, '  ', blockTextSelection1, cursorTextSelection1);
        assert.equal(result1.textContent, '0123\n5678\nabcde');
        assert.equal(result1.selection.start, 0);
        assert.equal(result1.selection.end, 15);

        // TODO::
    });
});