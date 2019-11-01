//create not flag
//check what comes first: an open paren character, a word character, or an exclamation point.
//if exclamation point
//	set not flag to true
//  do same checking process without exclamation point substringed out, keeping not flag set to true and crashing if exclamation point comes up again
//if open paren
//	set not flag to false
//	find index of matching closed paren
//	parse substring between as first pattern (w/ not flag on pattern being toggled if not flag here is true)
//if word character
//  set not flag to false
//  retrieve tag from this character plus consecutive word characters and make it first pattern
//if something else (with spaces cut out), crash!
//
//if an operator comes after the first pattern but before any non-whitespace character
//	make first pattern operand1
//	make operator character the operator
//  parse the rest of string after the operator as the second pattern, operand2
//	problem when parsing this way: expression nesting goes right-to-left
//otherwise, if the string ends before any non-whitespace character, or if a closed paren comes before any non-whitespace character
//	return first pattern as a tag
//otherwise, if something else comes after, crash!


const getClosingParenIndex = (str, openingParenIndex) => {
	let numUnmatchedParens = 0
	for(let i = openingParenIndex + 1; i < str.length; i++) {
		if(str[i] == '(')
			numUnmatchedParens++
		else if(str[i] == ')' && numUnmatchedParens > 0)
			numUnmatchedParens--
		else if(str[i] == ')')
			return i 
	}
	return -1
}



module.exports = (str, not=false) => {
	str = str.trimStart()
	if(str[0] == '!')
		return parse(str.substr(1), !not)
	const firstPattern = (() => {
		if(str[0] == '(') {
			const closingParenIndex = getClosingParenIndex(str, 1)
			if(closingParenIndex == -1)
				process.exit(1)
			return {
				endIndex: closingParenIndex,
				result: parse(str.substr(1, closingParenIndex + 1), not).result
			}
		}
		else if(/^\w+/.test(str)) {
			const match = str.match(/^\w+/)[0]
			return {
				endIndex: match.length - 1,
				result: {
					type: 'tag',
					tag: {
						name: match,
						not
					}
				}
			}
		}
		else
			process.exit(1)
	})()

	const strAfterFirstPattern = str.substr(firstPattern.endIndex + 1).trimStart()
	if(strAfterFirstPattern.length == 0 || strAfterFirstPattern[0] == ')')
		return {
			endIndex: str.length - 1,
			result: firstPattern.result
		}
	else if(strAfterFirstPattern[0] == '&' || strAfterFirstPattern[0] == '|') {
		const operator = (() => {
			const operatorChar = strAfterFirstPattern[0]
			if(operatorChar == '&') return 'and'
			else if(operatorChar == '|') return 'or'
		})()
		const operand1 = firstPattern.result
		const {endIndex, result: operand2} = parse(strAfterFirstPattern.substr(1))
		return { 
			endIndex,
			result: {
				type: 'exp',
				exp: { operator, operand1, operand2, not }
			}
		}
	}
	else
		process.exit(1)
}

// const parseParens = str => {
// 	const {parenPairIndexes, unclosedParenPairQueue} = getParenPairIndexes(str)
// 	if(unclosedParenPairQueue.length != 0) {
// 		console.log(`Unmatched parenthes${unclosedParenPairQueue.length == 1 ? 'is' : 'es'}.`)
// 		console.log(str)
// 		console.log(unclosedParenPairQueue
// 			.map( (unmatchedParenIndex_, i) => {
// 				const unmatchedParenIndex = parenPairIndexes[unmatchedParenIndex_][0]
// 				if(i == 0)
// 					return unmatchedParenIndex
// 				else {
// 					const prevUnmatchedParenIndex = parenPairIndexes[unmatchedParenIndex_ - 1][0]
// 					return unmatchedParenIndex - prevUnmatchedParenIndex - 1
// 				}
// 			})
// 			.reduce( (indicatorStr, numSpaces) => indicatorStr + ' '.repeat(numSpaces) + '^', '' )
// 		)
// 	}
// }

// parseParens('hello (world))')