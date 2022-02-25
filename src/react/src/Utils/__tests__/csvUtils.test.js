import { cleanData, checkData } from '../csvUtils';

describe('function cleanData', () => {
    const testData = [
        [188, 'o1', true, 4995.263, 0.01844, 1238160133.5651631],
        [188, 'o2', false, 4995.263, 0.01844, 1238160166.1664348],
        [],
        [188, 'o2', true, 4995.263, 0.01844, 1238160231.3689783],
        [],
        [188, 'o3', true, 4995.263, 0.01844, 1238160296.5715218],
        [188, 'o2', true, 4995.263, 0.01844, 1238160329.1727934],
        [188, 'o2', false, null, null, null],
        [188, 'o2', true, 4995.263, 0.01844, 1238160394.375337]
    ];
    it('removes items of array that have no length', () => {
        expect.hasAssertions();
        expect(cleanData(testData)).toStrictEqual(
            [
                [188, 'o1', true, 4995.263, 0.01844, 1238160133.5651631],
                [188, 'o2', false, 4995.263, 0.01844, 1238160166.1664348],
                [188, 'o2', true, 4995.263, 0.01844, 1238160231.3689783],
                [188, 'o3', true, 4995.263, 0.01844, 1238160296.5715218],
                [188, 'o2', true, 4995.263, 0.01844, 1238160329.1727934],
                [188, 'o2', false, null, null, null],
                [188, 'o2', true, 4995.263, 0.01844, 1238160394.375337]
            ]
        );
    });
});

describe('function checkData', () => {
    it('passes legitimate data', () => {
        expect.hasAssertions();
        const testData = [
            [188, 'o1', true, 4995.263, 0.01844, 1238160133.5651631],
            [188, 'o2', false, 4995.263, 0.01844, 1238160166.1664348],
            [188, 'o2', false, null, null, null],
        ];
        expect(checkData(testData)).toBeNull();
    });

    it('checks each row has at least 6 columns', () => {
        expect.hasAssertions();
        const testData1 = [
            ['a', 'o1', true, 4995.263, 0.01844],
            [188, 'o2', false, 4995.263, 0.01844, 1238160166.1664348],
            [188, 'o2', false, null, null, null],
        ];
        expect(checkData(testData1)).toBe('Row 1 doesn\'t have enough columns');
        const testData2 = [
            [188, 'o1', true, 4995.263, 0.01844, 1238160133.5651631],
            [188, 'o2', false, 4995.263, 0.01844, 1238160166.1664348],
            [188, 'o2', false, null, null],
        ];
        expect(checkData(testData2)).toBe('Row 3 doesn\'t have enough columns');
    });

    it('checks for numbers in columns 1, 4, 5, 6', () => {
        expect.hasAssertions();
        const testData1 = [
            ['a', 'o1', true, 4995.263, 0.01844, 1238160133.5651631],
            [188, 'o2', false, 4995.263, 0.01844, 1238160166.1664348],
            [188, 'o2', false, null, null, null],
        ];
        expect(checkData(testData1)).toBe('Row 1, column 1 must be a number');
        const testData2 = [
            [188, 'o1', true, 4995.263, 0.01844, 1238160133.5651631],
            [188, 'o2', false, true, 0.01844, 1238160166.1664348],
            [188, 'o2', false, null, null, null],
        ];
        expect(checkData(testData2)).toBe('Row 2, column 4 must be a number');
    });

    it('checks for o1-4 in column 2', () => {
        expect.hasAssertions();
        const testData1 = [
            [188, 'o1', true, 4995.263, 0.01844, 1238160133.5651631],
            [188, true, false, 4995.263, 0.01844, 1238160166.1664348],
            [188, 'o2', false, null, null, null],
        ];
        expect(checkData(testData1)).toBe('Row 2, column 2 must be in the range O1-4');
        const testData2 = [
            [188, 'o1', true, 4995.263, 0.01844, 1238160133.5651631],
            [188, 'o2', false, 4995.263, 0.01844, 1238160166.1664348],
            [188, 1, false, null, null, null],
        ];
        expect(checkData(testData2)).toBe('Row 3, column 2 must be in the range O1-4');
        const testData3 = [
            [188, 'o_1', true, 4995.263, 0.01844, 1238160133.5651631],
            [188, 'o2', false, 4995.263, 0.01844, 1238160166.1664348],
            [188, 'o2', false, null, null, null],
        ];
        expect(checkData(testData3)).toBe('Row 1, column 2 must be in the range O1-4');
    });

    it('checks for boolean in column 3', () => {
        expect.hasAssertions();
        const testData1 = [
            [188, 'o1', 1, 4995.263, 0.01844, 1238160133.5651631],
            [188, 'o2', false, 4995.263, 0.01844, 1238160166.1664348],
            [188, 'o2', false, null, null, null],
        ];
        expect(checkData(testData1)).toBe('Row 1, column 3 must be a boolean');
        const testData2 = [
            [188, 'o1', true, 4995.263, 0.01844, 1238160133.5651631],
            [188, 'o2', false, 4995.263, 0.01844, 1238160166.1664348],
            [188, 'o2', 'false', null, null, null],
        ];
        expect(checkData(testData2)).toBe('Row 3, column 3 must be a boolean');
    });
});