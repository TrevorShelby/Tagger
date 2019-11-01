const TagDirectory = require('../utils/tagDirectory')
const handleIssue = require('../utils/handleIssue')


const evaluate = (tree, tagDir, available=Object.keys(tagDir.files)) => {
	if(tree.type == 'tag') {
		if(!(tree.tag.name in tagDir.tags)) {
			handleIssue('error', '022', tree.tag.name)
			return
		}
		return evaluateTag(tree.tag, tagDir, available)
	}
	else if(tree.type == 'exp')
		return evaluateExp(tree.exp, tagDir, available)
}

const evaluateTag = (tag, tagDir, available) => {
	if(tag.not)
		return available.filter( file => !tagDir.tags[tag.name].includes(file) )
	else
		return available.filter( file => tagDir.tags[tag.name].includes(file) )
}

const evaluateExp = (exp, tagDir, available) => {
	const operand1 = evaluate(exp.operand1, tagDir, available)
	const result = (() => {	
		if(exp.operator == 'and')
			return evaluate(exp.operand2, tagDir, operand1)
		else if(exp.operator == 'or') {
			const operand2 = evaluate(exp.operand2, tagDir, available)
			return operand2.reduce( (acc, file) => {
				if(acc.includes(file)) return acc
				else return acc.concat(file)
			}, operand1)
		}
	})()
	if(exp.not)
		return available.filter( file => !result.includes(file) )
	else
		return result
}


module.exports = evaluate