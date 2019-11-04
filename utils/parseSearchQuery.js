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


//TODO: Make expression nesting go left-to-right instead of right-to-left.
module.exports = function parse(str, not=false, onErr=(type, data)=>{}) {
	str = str.trimStart()
	if(str[0] == '!')
		return parse(str.substr(1), !not, onErr)
	const firstPattern = (() => {
		if(str[0] == '(') {
			const closingParenIndex = getClosingParenIndex(str, 1)
			if(closingParenIndex == -1) {
				onErr('unmatchedParen', {query: str, parenIndex: 0})
				return
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
			onErr('unexpectedToken', {query: str, tokenIndex: 0})
			return
		}
	})()
	if(firstPattern == undefined) return

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
		if(operand2 == undefined) return
		return {
			type: 'exp',
			exp: { operator, operand1, operand2, not }
		}
	}
	else {
		onErr('unexpectedToken', {query: str, tokenIndex: firstPattern.endIndex + 1})
		return
	}
}