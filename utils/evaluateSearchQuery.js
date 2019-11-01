const TagDirectory = require('../utils/tagDirectory')


const evaluate = (tree, tagDir, available=Object.keys(tagDir.files)) => {
	if(tree.type == 'tag') {
		if(!(tree.tag.name in tagDir.tags))
			return {success: false, err: tree.tag.name}
		return {success: true, data: evaluateTag(tree.tag, tagDir, available)}
	}
	else if(tree.type == 'exp') {
		return evaluateExp(tree.exp, tagDir, available)
	}
}

const evaluateTag = (tag, tagDir, available) => {
	if(tag.not)
		return available.filter( file => !tagDir.tags[tag.name].includes(file) )
	else
		return available.filter( file => tagDir.tags[tag.name].includes(file) )
}

const evaluateExp = (exp, tagDir, available) => {
	const operand1 = evaluate(exp.operand1, tagDir, available)
	if(!operand1.success) return operand1
	const result = (() => {	
		if(exp.operator == 'and')
			return evaluate(exp.operand2, operand1.data, tagDir)
		else if(exp.operator == 'or') {
			const operand2 = evaluate(exp.operand2, tagDir, available)
			if(!operand2.success) return operand2
			return operand2.data.reduce( (acc, file) => {
				if(acc.includes(file)) return acc
				else return acc.concat(file)
			}, operand1.data)
		}
	})()
	if(exp.not)
		return available.filter( file => !result.includes(file) )
	else
		return result
}


module.exports = evaluate