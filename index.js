const parseArgs = require('minimist')

const initTagDir = require('./cmd/init')
const tagFiles = require('./cmd/tag')
const untagFiles = require('./cmd/untag')
const removeFiles = require('./cmd/removeFiles')
const removeTags = require('./cmd/removeTags')
const search = require('./cmd/search')


module.exports = () => {
	const args = parseArgs(process.argv.slice(2))
	const cmd = args._[0]

	if(cmd == 'init')
		initTagDir({tagDirFilename: args._[1] || 'tag-dir.json'})
	else if(cmd == 'tag')
		tagFiles({
			tagDirFilename: args._[1] || 'tag-dir.json',
			tags: (args.tags || args.t).split(','),
			filenames: (args.files || args.f).split(',')
		})
	else if(cmd == 'untag')
		untagFiles({
			tagDirFilename: args._[1] || 'tag-dir.json',
			tags: (args.tag || args.t).split(','),
			filenames: (args.files || args.f).split(',')
		})
	else if(cmd == 'remove-files')
		//TODO: Try to figure out a way where filenames can be non-option arguments while still
		//accounting for the optional tagDirFilename argument.
		removeFiles({
			tagDirFilename: args._[1] || 'tag-dir.json',
			filenames: (args.files || args.f).split(',')
		})
	else if(cmd == 'remove-tags')
		removeTags({
			tagDirFilename: args._[1] || 'tag-dir.json',
			tags: (args.tag || args.t).split(',')
		})
	else if(cmd == 'search')
		search({
			tagDirFilename: args._[1] || 'tag-dir.json',
			query: args.q || args.query
		})
	else
		console.log('Unrecognized command.')
	//TODO: Create a rename command to rename all instances of a path in the tag directory.
	//TODO: Add help and version command.
}