'use strict';

const config = require('../store');
const money = require('../lib/money');
const defaultRates = require('./defaultRates');
const wordToNum = require('word-to-numbers');
const mathJs = require('mathjs');

// The supported weight units
/*
 * The property is the abbreviation of supported units.
 * The value needed to convert to or from gram.
 * Unit's abbreviations could be found in https://www.weightconversions.org/abbreviations.htm
 */
const weightUnits = {
	mg: 1000,
	cg: 100,
	gr: 15.43236,
	dg: 10,
	g: 1,
	dr: 0.5643834,
	dag: 0.1,
	oz: 0.03527396,
	hg: 0.01,
	lb: 0.002204623,
	kg: 0.001,
	st: 0.000157473,
	ton: 0.000001102311
};

// The supported length units
/*
 * The property is the abbreviation of supported units.
 * The value needed to convert to or from meter.
 */
const lengthUnits = {
	nm: 1000000000,
	mm: 1000,
	cm: 100,
	inch: 39.37008,
	dm: 10,
	ft: 3.28084,
	yd: 1.093613,
	m: 1,
	hm: 0.01,
	km: 0.001,
	mi: 0.0006213712
};

// The supported temperature units
/*
 * The property is the abbreviation of supported units.
 */
const temperatureUnits = ['c', 'f', 'k'];

/**
 * get cached currency rates
 */

/**
 * supported hex format list
 */

const numberUnits = {
	bin: 2,
	binary: 2,
	dec: 10,
	decimal: 10,
	oct: 8,
	octal: 8,
	hex: 16,
	hexadecimal: 16
};

const scientificUnits1 = {
	root: 'nthRoot',
	sqrt: 'sqrt',
	squareroot: 'sqrt',
	cbrt: 'cbrt',
	cuberoot: 'cbrt',
	abs: 'abs',
	absolute: 'abs',
	fact: 'factorial',
	factorial: 'factorial',
	round: 'round',
	ceil: 'ceil',
	ceiling: 'ceil',
	floor: 'floor',
	sin: 'sin',
	sine: 'sin',
	cos: 'cos',
	cosine: 'cos',
	tan: 'tan',
	tangent: 'tan',
	csc: 'csc',
	cosec: 'csc',
	cosecant: 'csc',
	cot: 'cot',
	cotangent: 'cot',
	sec: 'sec',
	secant: 'sec'
};

const scientificUnits2 = {
	root: 'nthRoot',
	log: 'log',
	round: 'round',
	ceil: 'ceil',
	floor: 'floor'
};

const timeUnits = {
	seconds: 1,
	second: 1,
	sec: 1,
	minutes: 60,
	minute: 60,
	min: 60,
	hours: 3600,
	hour: 3600,
	hr: 3600,
	day: 86400,
	days: 86400,
	week: 604800,
	weeks: 604800,
	month: 2592000,
	months: 2592000,
	mon: 2592000,
	year: 31536000,
	years: 31536000
};

const dateUnits = ['yesterday', 'today', 'tomorrow'];

const currencyUnits = config.has('rates') ? config.get('rates') : defaultRates;

/**
 * Setup money.fx for currencry conversion
 */
money.fx.base = 'USD';
money.fx.rates = currencyUnits;

/**
 * This is a function to perform conversion
 * @param {String} mode - Type of conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convert = (mode, value, oldUnit, newUnit) => {
	switch (mode) {
		case 'w':
			return convertWeight(value, oldUnit, newUnit);
		case 'l':
			return convertLength(value, oldUnit, newUnit);
		case 't':
			return convertTemperature(value, oldUnit, newUnit);
		case 'c':
			return convertCurrency(value, oldUnit, newUnit);
		case 'r':
			return convertRatio(value, oldUnit, newUnit);
		case 'p':
			return convertPercent(value, oldUnit, newUnit);
		case 'n':
			return convertNumber(value, oldUnit, newUnit);
		case 'tm':
			return convertTime(value, oldUnit, newUnit);
		case 's2':
			return convertScientific2(value, oldUnit, newUnit);
		case 's1':
			return convertScientific1(value, oldUnit, newUnit);
		case 'd':
			return convertDate(value, oldUnit, newUnit);
	}
};

/**
 * This is a function to perform weight conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convertRatio = (ratio, ofValue) => {
	ratio = eval(ratio);
	return ratio * ofValue;
};

/**
 * This is a function to perform weight conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convertPercent = (percent, _, ofValue) => {
	return (percent / 100) * ofValue;
};

/**
 * This is a function to perform weight conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convertWeight = (value, oldUnit, newUnit) => {
	value = wordToNum(value);
	if (oldUnit === newUnit) {
		return value;
	} else {
		return (value / weightUnits[oldUnit]) * weightUnits[newUnit];
	}
};

/**
 * This is a function to perform length conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convertLength = (value, oldUnit, newUnit) => {
	value = wordToNum(value);
	if (oldUnit === newUnit) {
		return value;
	} else {
		return (value / lengthUnits[oldUnit]) * lengthUnits[newUnit];
	}
};

/**
 * This is a function to perform temperature conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convertTemperature = (value, oldUnit, newUnit) => {
	value = wordToNum(value);

	if (oldUnit === newUnit) {
		return value;
	} else if (oldUnit === 'c' && newUnit === 'f') {
		return (9 / 5) * value + 32;
	} else if (oldUnit === 'k' && newUnit === 'f') {
		return (9 / 5) * (value - 273) + 32;
	} else if (oldUnit === 'f' && newUnit === 'c') {
		return (5 / 9) * (value - 32);
	} else if (oldUnit === 'c' && newUnit === 'k') {
		return value + 273;
	} else if (oldUnit === 'k' && newUnit === 'c') {
		return value - 273;
	} else if (oldUnit === 'f' && newUnit === 'k') {
		return (5 / 9) * (value - 32) + 273;
	}
};

/**
 * This is a function to perform currency conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convertCurrency = (value, oldUnit, newUnit) => {
	value = wordToNum(value);
	if (oldUnit === newUnit) return value;
	return money.fx
		.convert(Number(value), { from: oldUnit, to: newUnit })
		.toFixed(2);
};

const convertNumber = (value, oldUnit, newUnit) => {
	return parseInt(value, numberUnits[oldUnit])
		.toString(numberUnits[newUnit])
		.toUpperCase();
};

const convertTime = (value, oldUnit, newUnit) => {
	value = wordToNum(value);

	if (oldUnit === newUnit) {
		return value;
	} else {
		return (value * timeUnits[oldUnit]) / timeUnits[newUnit];
	}
};

const convertScientific1 = (value, oldUnit, newUnit) => {
	return mathJs[scientificUnits1[newUnit]](value);
};

const convertScientific2 = (value, oldUnit, newUnit) => {
	return mathJs[scientificUnits2[oldUnit]](value, newUnit);
};

const convertDate = (value, oldUnit, newUnit) => {
	const today = new Date();
	switch (value) {
		case 'yesterday':
			if (oldUnit === '+') {
				const answer = new Date(
					today.setDate(today.getDate() + (Number(newUnit) - 1))
				);
				return answer
					.toString()
					.split(' ')
					.slice(0, 4)
					.join(' ');
			} else if (oldUnit === '-') {
				const answer = new Date(
					today.setDate(today.getDate() - (Number(newUnit) + 1))
				);
				return answer
					.toString()
					.split(' ')
					.slice(0, 4)
					.join(' ');
			}
		case 'today':
			if (oldUnit === '+') {
				const answer = new Date(
					today.setDate(today.getDate() + Number(newUnit))
				);

				return answer
					.toString()
					.split(' ')
					.slice(0, 4)
					.join(' ');
			} else if (oldUnit === '-') {
				const answer = new Date(
					today.setDate(today.getDate() - Number(newUnit))
				);
				return answer
					.toString()
					.split(' ')
					.slice(0, 4)
					.join(' ');
			}
		case 'tomorrow':
			if (oldUnit === '+') {
				const answer = new Date(
					today.setDate(today.getDate() + (Number(newUnit) + 1))
				);
				return answer
					.toString()
					.split(' ')
					.slice(0, 4)
					.join(' ');
			} else if (oldUnit === '-') {
				const answer = new Date(
					today.setDate(today.getDate() - (Number(newUnit) - 1))
				);
				return answer
					.toString()
					.split(' ')
					.slice(0, 4)
					.join(' ');
			}
		default:
			break;
	}
};
module.exports = {
	convert,
	lengthUnits,
	weightUnits,
	temperatureUnits,
	currencyUnits,
	numberUnits,
	timeUnits,
	scientificUnits1,
	scientificUnits2,
	dateUnits
};
