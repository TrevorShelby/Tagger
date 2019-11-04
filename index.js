const parseArgs = require('minimist')
const initTagDir = require('./cmd/init')
const newLink = require('./cmd/newLink.js')


const getDirName = args => args.directory || args.d || 'tag-dir.json'
const getTags = args => {
	const csvTags = args.tags || args.t
	if(csvTags)
		return (csvTags).split(',')
	else
		return []
}

module.exports = () => {
	const args = parseArgs(process.argv.slice(2))
	const cmd = args._[0]

	if(cmd == 'i' || cmd == 'init' || cmd == 'initialize')
		initTagDir(getDirName(args))
	else if(cmd == 'newLink' || cmd == 'new' || cmd == 'link' || cmd == 'l')
		newLink(getDirName(args), args.source || args.s, args._[1], getTags(args))
	else
		console.log('Unrecognized command.')
}