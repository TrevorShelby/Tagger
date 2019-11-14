const readTagDirectory = require('../tagDirIo').readTagDirectory
const { parse, Issue: parseIssue } = require('../../utils/parseSearchQuery')
const evaluate = require('../../utils/evaluateSearchQuery')


module.exports = ({tagDirFilename='tag-dir.json', query}) => {
	const tagDir = readTagDirectory(tagDirFilename)
	if(query == undefined) {
		const untaggedFiles = tagDir.files.filter( fileTags => fileTags.length == 0 )
		console.log(`Found ${untaggedFiles.length != 1 ? 'these untagged files:' : 'this untagged file:'}`)
		untaggedFiles.forEach( file => console.log('  - ' + file) )
		return
	}

	const parseTree = parse(query, false, (err, query, index) => {
		if(err == parseIssue.UNEXPECTED_TOKEN)
			console.error('Unexpected token: ' + query[index])
		else if(err == parseIssue.UNMATCHED_PARENTHESIS)
			console.error('Unmatched parenthesis')
		console.error(query)
		console.error(' '.repeat(index) + '^')
		process.exit(1)
	})
	const matches = evaluate(parseTree, tagDir, Object.keys(tagDir.files), tag => {
		console.error(`The tag '${tag}' doesn't exist in this directory.`)
		process.exit(1)
	})
	console.log(`Found ${matches.length != 1 ? 'these files:' : 'this file:'}`)
	matches.forEach( file => console.log('  - ' + file))
}