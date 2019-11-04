const TagDirectory = require('../utils/tagDirectory')


const evaluate = (tree, tagDir, available=Object.keys(tagDir.links), onErr=(tag)=>{}) => {
	if(tree.type == 'tag') {
		if(!(tree.tag.name in tagDir.tags)) {
			onErr(tag)
			return
		}
		return evaluateTag(tree.tag, tagDir, available, onErr)
	}
	else if(tree.type == 'exp')
		return evaluateExp(tree.exp, tagDir, available, onErr)
}

const evaluateTag = (tag, tagDir, available) => {
	if(tag.not)
		return available.filter( lid => !tagDir.tags[tag.name].includes(lid) )
	else
		return available.filter( lid => tagDir.tags[tag.name].includes(lid) )
}

const evaluateExp = (exp, tagDir, available) => {
	const operand1 = evaluate(exp.operand1, tagDir, available, tag)
	if(operand1 == undefined) return
	const result = (() => {	
		if(exp.operator == 'and')
			return evaluate(exp.operand2, tagDir, operand1)
		else if(exp.operator == 'or') {
			const operand2 = evaluate(exp.operand2, tagDir, available)
			if(operand2 == undefined) return
			return operand2.reduce( (acc, lid) => {
				if(acc.includes(lid)) return acc
				else return acc.concat(lid)
			}, operand1)
		}
	})()
	if(exp.not)
		return available.filter( lid => !result.includes(lid) )
	else
		return result
}


module.exports = evaluate