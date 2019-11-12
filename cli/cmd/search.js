const fs = require('fs')
const getJsonFilepath = require('../utils/getJsonFilepath')
const parse = require('../utils/parseSearchQuery')
const evaluate = require('../utils/evaluateSearchQuery')
const handleIssue = require('../utils/handleIssue')


module.exports = ({tagDirFilename='tag-dir.json', query}) => {
	const tagDirFilepath = getJsonFilepath(tagDirFilename)
	const tagDir = (() => {
		if(fs.existsSync(tagDirFilepath))
			return JSON.parse(fs.readFileSync(tagDirFilepath, {encoding: 'utf-8'}))
		else
			handleIssue('error', '001', tagDirFilepath)
	})()
	const matches = evaluate(parse(query), tagDir)
	handleIssue('success', '105', matches)
}