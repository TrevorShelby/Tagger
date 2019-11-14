const Issue = {
	UNEXPECTED_TOKEN: 0,
	UNMATCHED_PARENTHESIS: 1
}

//TODO: Make expression nesting go left-to-right instead of right-to-left.

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


const parse = (str, not=false, onErr=()=>{}) => {
	str = str.trimStart()
	if(str[0] == '!')
		return parse(str.substr(1), !not, onErr)
	const firstPattern = (() => {
		if(str[0] == '(') {
			const closingParenIndex = getClosingParenIndex(str, 1)
			if(closingParenIndex == -1) {
				onErr(Issue.UNMATCHED_PARENTHESIS)
				throw new Error()
			}
			return {
				endIndex: closingParenIndex,
				result: parse(str.substr(1, closingParenIndex + 1), not, onErr)
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
		else {
			onErr(Issue.UNEXPECTED_TOKEN)
			throw new Error()
		}
	})()

	const strAfterFirstPattern = str.substr(firstPattern.endIndex + 1).trimStart()
	if(strAfterFirstPattern.length == 0 || strAfterFirstPattern[0] == ')')
		return firstPattern.result
	else if(strAfterFirstPattern[0] == '&' || strAfterFirstPattern[0] == '|') {
		const operator = (() => {
			const operatorChar = strAfterFirstPattern[0]
			if(operatorChar == '&') return 'and'
			else if(operatorChar == '|') return 'or'
		})()
		const operand1 = firstPattern.result
		const operand2 = parse(strAfterFirstPattern.substr(1), false, onErr)
		return {
			type: 'exp',
			exp: { operator, operand1, operand2, not }
		}
	}
	else {
		onErr(Issue.UNEXPECTED_TOKEN)
		throw new Error()
	}
}



module.exports = { parse, Issue }