module.exports = (results, resultHandlers) => {
	Object.keys(resultHandlers).forEach( key => {
		const getMessage = resultHandlers[key]
		results[key].forEach( result => console.log(getMessage(result)) )
		if(results[key].length != 0) console.log()
	})
}