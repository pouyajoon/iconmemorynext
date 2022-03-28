module.exports = {
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "moduleNameMapper": {
        "^file-loader": "<rootDir>/__mocks__/fileMock.js"
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$",
    "moduleFileExtensions": [
        "js",
        "ts",
        "tsx",
        "json",
        "node"
    ]
};