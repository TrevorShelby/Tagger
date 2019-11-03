const parseArgs = require('minimist')

const initTagDir = require('./cmd/init')

module.exports = () => {
	const args = parseArgs(process.argv.slice(2))
	const cmd = args._[0]

	if(cmd == 'i' || cmd == 'init' || cmd == 'initialize')
		initTagDir({tagDirFilename: args._[1] || 'tag-dir.json'})
	else
		console.log('Unrecognized command.')
}