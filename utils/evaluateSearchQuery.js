const evaluate = (tree, tagDir, available=Object.keys(tagDir.files), onMissingTag=()=>{}) => {
	if(tree.type == 'tag') {
		if(!(tree.tag.name in tagDir.tags)) {
			onMissingTag(tree.tag.name)
			throw new Error()
		}
		return evaluateTag(tree.tag, tagDir, available)
	}
	else if(tree.type == 'exp')
		return evaluateExp(tree.exp, tagDir, available, onMissingTag)
}

const evaluateTag = (tag, tagDir, available) => {
	if(tag.not)
		return available.filter( file => !tagDir.tags[tag.name].includes(file) )
	else
		return available.filter( file => tagDir.tags[tag.name].includes(file) )
}

const evaluateExp = (exp, tagDir, available, onMissingTag) => {
	const operand1 = evaluate(exp.operand1, tagDir, available, onMissingTag)
	const result = (() => {	
		if(exp.operator == 'and')
			return evaluate(exp.operand2, tagDir, operand1, onMissingTag)
		else if(exp.operator == 'or') {
			const operand2 = evaluate(exp.operand2, tagDir, available, onMissingTag)
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