const fs = require('fs')
const getJsonFilepath = require('../utils/getJsonFilepath')
const parse = require('../utils/parseSearchQuery')
const evaluate = require('../utils/evaluateSearchQuery')


module.exports = ({tagDirFilename='tag-dir.json', query}) => {
	const tagDirFilepath = getJsonFilepath(tagDirFilename)
	const tagDir = (() => {
		if(fs.existsSync(tagDirFilepath))
			return JSON.parse(fs.readFileSync(tagDirFilepath, {encoding: 'utf-8'}))
		else {
			console.error(`${tagDirFilepath} does not exist.`)
			process.exit(1)
		}
	})()
	const result = evaluate(parse(query).result, tagDir)
	if(result.success)
		result.data.forEach( matchedPath => console.log(matchedPath))
	else {
		console.error(`${result.err} is not a tag.`)
	}
}