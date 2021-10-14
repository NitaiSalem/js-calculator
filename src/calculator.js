import React, { useState } from 'react';
import { evaluate } from 'mathjs';

const Calculator = () => {
	const [resultNum, setResultNum] = useState(['0']);
	const [enteredNums, setEnteredNums] = useState([]);

	const zeroStartRegex = /^0$|^[-+/X]0/;
	const operatorOrZeroRegex = /^[+/X]|^0$/;
	const operatorAsLastRegex = /[-+/*X]+$/;
	const addOperatorRegex = /\d\D$|\d$/;
	const equalRegex = /=/;
	const minusRegex = /^-$/;
	const dotRegex = /\.$|\d*\.\d*/;
	const secondDotRegex = /\d*\.\d+[-+*/]+\d*$/;
	
	const enteredNumsString = enteredNums.join('');

	const addToken = ({ target: { value } }) => {
		
		switch (value) {
			case '+':
				if (equalRegex.test(enteredNumsString) && !minusRegex.test(enteredNumsString)) {
					setEnteredNums(resultNum.concat(['+']));
				} else if (operatorAsLastRegex.test(resultNum.join('')) && !minusRegex.test(enteredNumsString)) {
					setEnteredNums(enteredNumsString.replace(operatorAsLastRegex, '+').split(''));
				} else if (!minusRegex.test(enteredNumsString)) {
					setEnteredNums(enteredNums.concat(['+']));
				}
				setResultNum(['+']);
				break;

			case '-':
				if (equalRegex.test(enteredNumsString)) {
					setEnteredNums(resultNum.concat(['-']));
				} else if (addOperatorRegex.test(enteredNumsString) || enteredNums.length === 0) {
					setEnteredNums(enteredNums.concat(['-']));
				} else if (operatorAsLastRegex.test(enteredNumsString)) {
					setEnteredNums(enteredNumsString.replace(operatorAsLastRegex, '-').split(''));
				}
				setResultNum(['-']);
				break;

			case '*':
				if (equalRegex.test(enteredNumsString) && !minusRegex.test(enteredNumsString)) {
					setEnteredNums(resultNum.concat(['*']));
				} else if (operatorAsLastRegex.test(enteredNumsString) && !minusRegex.test(enteredNumsString)) {
					setEnteredNums(enteredNumsString.replace(operatorAsLastRegex, '*').split(''));
				} else if (enteredNums.length !== 0 && !minusRegex.test(enteredNumsString)) {
					setEnteredNums(enteredNums.concat(['*']));
				}
				setResultNum(['X']);
				break;

			case '/':
				if (equalRegex.test(enteredNumsString) && !minusRegex.test(enteredNumsString)) {
					setEnteredNums(resultNum.concat(['/']));
				} else if (operatorAsLastRegex.test(enteredNumsString) && !minusRegex.test(enteredNumsString)) {
					setEnteredNums(enteredNumsString.replace(operatorAsLastRegex, '/').split(''));
				} else if (enteredNums.length !== 0 && !minusRegex.test(enteredNumsString)) {
					setEnteredNums(enteredNums.concat(['/']));
				}
				setResultNum(['/']);
				break;

			case '.':
				if (equalRegex.test(enteredNumsString)) {
					setEnteredNums(['0', '.']);
					setResultNum(['0', '.']);
				} else if (operatorAsLastRegex.test(enteredNumsString) || enteredNums.length === 0) {
					setEnteredNums(enteredNums.concat(['0', '.']));
					setResultNum(['0', '.']);
				} else if (!dotRegex.test(resultNum.join('')) || secondDotRegex.test(enteredNumsString)) {
					setEnteredNums(enteredNums.concat(['.']));
					setResultNum(resultNum.concat(['.']));
				}
				break;

			default:
				if (equalRegex.test(enteredNumsString)) {
					setEnteredNums([value]);
					setResultNum([value]);
				} else if (value === '0' && resultNum.length < 23 && resultNum !== 'Digit limit met') {
					if (operatorAsLastRegex.test(resultNum.join('')) || enteredNums.length === 0) {
						setEnteredNums(enteredNums.concat(['0']));

						setResultNum(['0']);
					} else if (!zeroStartRegex.test(resultNum.join('')) && resultNum !== 'Digit limit met') {
						setEnteredNums(enteredNums.concat(['0']));
						setResultNum(resultNum.concat(['0']));
					}
				} else if (resultNum.length < 23 && resultNum !== 'Digit limit met') {
					if (operatorOrZeroRegex.test(enteredNums.join('')) || enteredNums.length === 0) {
						setEnteredNums([value]);
						setResultNum([value]);
					} else if (operatorAsLastRegex.test(resultNum.join(''))) {
						setEnteredNums(enteredNums.concat([value]));
						setResultNum([value]);
					} else {
						if (!zeroStartRegex.test(resultNum.join(''))) {
							setEnteredNums(enteredNums.concat([value]));
							setResultNum(resultNum.concat([value]));
						}
					}
				} else if (resultNum.length === 23) {
					setResultNum('Digit limit met');
					setTimeout(() => {
						setResultNum(enteredNums);
					}, 700);
				}
		}
	};

	const clearCalculator = () => {
		setEnteredNums([]);
		setResultNum(['0']);
	};

	const calculateResult = () => {
		if (operatorAsLastRegex.test(enteredNumsString) && !equalRegex.test(enteredNumsString)) {
			const calculatedNum = evaluate(enteredNumsString.replace(operatorAsLastRegex, ''));

			setEnteredNums([enteredNumsString.replace(operatorAsLastRegex, '=') + calculatedNum]);

			setResultNum([calculatedNum]);
		} else if (!equalRegex.test(enteredNumsString)) {
			const calculatedNum = evaluate(enteredNumsString);
			setEnteredNums([enteredNumsString + '=' + calculatedNum]);
			setResultNum([calculatedNum]);
		}
	};
	return (
		<div className="calculator-container">
			<div className="display" id="display">
				{enteredNums}
				<div className="resultnum">{resultNum}</div>
			</div>

			<div className="button-container">
				<button id="clear" value="clear" onClick={clearCalculator}>
					AC
				</button>
				<button id="divide" value="/" onClick={addToken}>
					/
				</button>
				<button id="multiply" value="*" onClick={addToken}>
					x
				</button>

				<button id="seven" value="7" onClick={addToken}>
					7
				</button>
				<button id="eight" value="8" onClick={addToken}>
					8
				</button>
				<button id="nine" value="9" onClick={addToken}>
					9
				</button>

				<button id="subtract" value="-" onClick={addToken}>
					-
				</button>

				<button id="four" value="4" onClick={addToken}>
					4
				</button>
				<button id="five" value="5" onClick={addToken}>
					5
				</button>
				<button id="six" value="6" onClick={addToken}>
					6
				</button>

				<button id="add" value="+" onClick={addToken}>
					+
				</button>

				<button id="one" value="1" onClick={addToken}>
					1
				</button>
				<button id="two" value="2" onClick={addToken}>
					2
				</button>
				<button id="three" value="3" onClick={addToken}>
					3
				</button>

				<button id="equals" value="=" onClick={calculateResult}>
					=
				</button>

				<button id="zero" value="0" onClick={addToken}>
					0
				</button>
				<button id="decimal" value="." onClick={addToken}>
					.
				</button>
			</div>
		</div>
	);
};

export default Calculator;
