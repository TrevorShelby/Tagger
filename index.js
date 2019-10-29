const parseArgs = require('minimist')

const initTagDir = require('./cmd/init')
const addTags = require('./cmd/tag')
const removeTags = require('./cmd/untag')


module.exports = () => {
	const args = parseArgs(process.argv.slice(2))
	const cmd = args._[0]

	if(cmd == 'init')
		initTagDir({tagDirFilename: args._[1] || 'tag-dir.json'})
	else if(cmd == 'tag')
		addTags({
			tagDirFilename: args._[1] || 'tag-dir.json',
			tags: (args.tags || args.t).split(','),
			filenames: (args.files || args.f).split(',')
		})
	else if(cmd == 'untag')
		removeTags({
			tagDirFilename: args._[1] || 'tag-dir.json',
			tags: (args.tag || args.t).split(','),
			filenames: (args.files || args.f).split(',')
		})
}