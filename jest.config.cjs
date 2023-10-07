module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.json',
		},
	},
	testPathIgnorePatterns: [
		'<rootDir>/node_modules/',
		'prepare.ts',
	],
	injectGlobals: false,
};
