'use strict';

const mathJs = require('mathjs');
const coreConv = require('./coreConv');

/** @const {Object} */
const textForOperators = {
	plus: '+',
	'added to': '+',
	adds: '+',
	with: '+',
	minus: '-',
	subtract: '-',
	less: '-',
	'divided by': '/',
	by: '/',
	'multiplied by': '*',
	into: '*',
	cross: '*',
	'%': '/100'
};

/** @const {string} */
const currencyUnits = Object.keys(coreConv.currencyUnits).join('|');

const lengthUnits = Object.keys(coreConv.lengthUnits).join('|');

const weightUnits = Object.keys(coreConv.weightUnits).join('|');

const timeUnits = Object.keys(coreConv.timeUnits).join('|');

const tempratureUnits = coreConv.temperatureUnits.join('|');

const numberUnits = Object.keys(coreConv.numberUnits).join('|');

const scientificUnits1 = Object.keys(coreConv.scientificUnits1).join('|');

const scientificUnits2 = Object.keys(coreConv.scientificUnits2).join('|');

const dateUnits = coreConv.dateUnits.join('|');

/** @const {object} */
const commentRegExp = new RegExp(/^(\s*)#+(.*)/, 'm');

/**
 * This function generates a RegExp for the given units
 * @example generate(km|cm|in)
 * @param {string} units - list of the conversion units
 * @private
 * @returns {object}
 */
const generateRegExpFordate = units =>
	new RegExp(`^(${units})\\s+([-|+])\\s+\\d+`, 'm');

const generateRegExpForMaths1 = units =>
	new RegExp(`^(${units})\\s+([-|+])?\\d+(.\\d+)?`, 'm');

const generateRegExpForMaths2 = units =>
	new RegExp(`^(${units})\\s+([-|+])?\\d+(.\\d+)?\\s+\\d*(.\\d+)?`, 'm');

const generateRegExpForUnits = units =>
	new RegExp(
		`^(([0-9a-zA-Z]+)\\s*)+\\s*(${units})\\s*(to|TO|tO|To)\\s*(${units})`,
		'm'
	);

const generateRegExpForUnits2 = units =>
	new RegExp(
		`^(${units})\\s*(in|IN|iN|In)\\s*(([0-9a-zA-Z]+)\\s*)+\\s*(${units})`,
		'm'
	);

/** @const {object} */
const currencyRegExp = generateRegExpForUnits(currencyUnits);
const currencyRegExp2 = generateRegExpForUnits2(currencyUnits);

const lengthRegExp = generateRegExpForUnits(lengthUnits);
const lengthRegExp2 = generateRegExpForUnits2(lengthUnits);

const weightRegExp = generateRegExpForUnits(weightUnits);
const weightRegExp2 = generateRegExpForUnits2(weightUnits);

const tempratureRegExp = generateRegExpForUnits(tempratureUnits);
const tempratureRegExp2 = generateRegExpForUnits2(tempratureUnits);

const numberRegExp = generateRegExpForUnits(numberUnits);
const numberRegExp2 = generateRegExpForUnits2(numberUnits);

const timeRegExp = generateRegExpForUnits(timeUnits);
const timeRegExp2 = generateRegExpForUnits2(timeUnits);

const scientificRegExp1 = generateRegExpForMaths1(scientificUnits1);
const scientificRegExp2 = generateRegExpForMaths2(scientificUnits2);

const dateRegExp = generateRegExpFordate(dateUnits);

/**
 * This function filters the given value with
 * filter conditions :  null, undefined, empty or to
 * return false if it meets any of the above conditions
 * @param {*} v - value which is filtered for null, undefined, empty or to.
 * @returns {boolean} - result after filtering
 * @private
 * @returns {object}
 */
const filterValues = v =>
	v !== null &&
	v !== undefined &&
	v !== '' &&
	v !== 'to' &&
	v !== 'in' &&
	v !== 'IN' &&
	v !== 'TO';

/**
 * This function parses the given expression with the provided regExp and passes the values to the core modules
 * @param {string} inp - each
 * @param {object} type - regExp type
 * @param {string} unit - conversion for 'l', 'c', 'w', 't', 'r', 'p' for length, currency and weight. check coreConv.convert(mode)
 * @returns {number}
 */
const parseExp = (inp, type, unit) => {
	inp = inp.split(' ').filter(v => filterValues(v));

	const value = inp.slice(0, inp.length - 2).join(' ');

	const result = coreConv.convert(
		unit,
		value,
		inp[inp.length - 2],
		inp[inp.length - 1]
	);

	return result;
};

const parseExp2 = (inp, type, unit) => {
	inp = inp.split(' ').filter(v => filterValues(v));

	const value = inp.slice(1, inp.length - 1).join(' ');

	const result = coreConv.convert(unit, value, inp[inp.length - 1], inp[0]);
	return result;
};

const parsescientific1 = (inp, type, unit) => {
	inp = inp.split(' ').filter(v => filterValues(v));
	const result = coreConv.convert(unit, inp[inp.length - 1], null, inp[0]);
	return result;
};

const parsescientific2 = (inp, type, unit) => {
	inp = inp.split(' ').filter(v => filterValues(v));

	const result = coreConv.convert(
		unit,
		inp[inp.length - 2],
		inp[0],
		inp[inp.length - 1]
	);
	return result;
};

const parseDate = (inp, type, unit) => {
	inp = inp.split(' ').filter(v => filterValues(v));

	const result = coreConv.convert(unit, inp[0], inp[1], inp[2]);
	return result;
};
/**
 * This is main function which parses and sends the values to the core modules
 * @param {string} exp - provides user input, that can be an equation or conversion. But not both, yet.
 * @returns {number}
 */

// TODO: refactor
const evaluate = exp => {
	exp = exp.trim();

	// Ignores if starts with #
	if (commentRegExp.test(exp)) return '';

	// Replaces the text alternatives for operators
	Object.keys(textForOperators).forEach(operator => {
		const regExp = new RegExp(`\s*${operator}\s*`, 'gi');
		exp = exp.replace(regExp, textForOperators[operator]);
	});

	if (currencyRegExp.test(exp.toUpperCase())) {
		return parseExp(exp.toUpperCase(), currencyRegExp, 'c');
	}
	if (currencyRegExp2.test(exp.toUpperCase())) {
		return parseExp2(exp.toUpperCase(), curreencyRegExp2, 'c');
	}

	if (lengthRegExp.test(exp.toLowerCase())) {
		return parseExp(exp.toLowerCase(), lengthRegExp, 'l');
	}
	if (lengthRegExp2.test(exp.toLowerCase())) {
		return parseExp2(exp.toLowerCase(), lengthRegExp2, 'l');
	}

	if (weightRegExp.test(exp.toLowerCase())) {
		return parseExp(exp.toLowerCase(), weightRegExp, 'w');
	}
	if (weightRegExp2.test(exp.toLowerCase())) {
		return parseExp2(exp.toLowerCase(), weightRegExp2, 'w');
	}

	if (tempratureRegExp.test(exp.toLowerCase())) {
		return parseExp(exp.toLowerCase(), tempratureRegExp, 't');
	}
	if (tempratureRegExp2.test(exp.toLowerCase())) {
		return parseExp2(exp.toLowerCase(), tempratureRegExp2, 't');
	}

	if (numberRegExp.test(exp.toLowerCase())) {
		return parseExp(exp.toLowerCase(), numberRegExp, 'n');
	}
	if (numberRegExp2.test(exp.toLowerCase())) {
		return parseExp2(exp.toLowerCase(), numberRegExp2, 'n');
	}

	if (timeRegExp.test(exp.toLowerCase())) {
		return parseExp(exp.toLowerCase(), timeRegExp, 'tm');
	}

	if (timeRegExp2.test(exp.toLowerCase())) {
		return parseExp2(exp.toLowerCase(), timeRegExp2, 'tm');
	}

	if (scientificRegExp2.test(exp.toLowerCase())) {
		return parsescientific2(exp.toLowerCase(), scientificRegExp2, 's2');
	}

	if (scientificRegExp1.test(exp.toLowerCase())) {
		return parsescientific1(exp.toLowerCase(), scientificRegExp1, 's1');
	}
	if (dateRegExp.test(exp.toLowerCase())) {
		return parseDate(exp.toLowerCase(), dateRegExp, 'd');
	}

	return mathJs.evaluate(exp);
};

const main = exp => {
	try {
		return evaluate(exp)
			? typeof evaluate(exp) !== 'function' // To filter function printing
				? evaluate(exp)
				: 0
			: 0;
	} catch (error) {
		return '';
	}
};

module.exports = main;
