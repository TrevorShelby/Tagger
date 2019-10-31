const getJsonFilepath = require('../utils/getJsonFilepath')
const TagDirectory = require('../utils/tagDirectory')


const evaluate = (tree, available, tagDir) => {
	if(tree.type == 'tag') {
		if(!(tree.tag.name in tagDir.tags))
			return {success: false, err: tree.tag.name}
		return {success: true, data: evaluateTag(tree.tag, available, tagDir)}
	}
	else if(tree.type == 'exp') {
		return evaluateExp(tree.exp, available, tagDir)
	}
}

const evaluateTag = (tag, available, tagDir) => {
	if(tag.not)
		return available.filter( file => !tagDir.tags[tag.name].includes(file) )
	else
		return available.filter( file => tagDir.tags[tag.name].includes(file) )
}

const evaluateExp = (exp, available, tagDir) => {
	const operand1 = evaluate(exp.operand1, available, tagDir)
	if(!operand1.success) return operand1
	const result = (() => {	
		if(exp.operator == 'and')
			return evaluate(exp.operand2, operand1.data, tagDir)
		else if(exp.operator == 'or') {
			const operand2 = evaluate(exp.operand2, available, tagDir)
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