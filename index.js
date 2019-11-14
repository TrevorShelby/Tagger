const parseArgs = require('minimist')

const initTagDir = require('./cli/cmd/init')
const addFiles = require('./cli/cmd/addFiles')
const tagFiles = require('./cli/cmd/tag')
const untagFiles = require('./cli/cmd/untag')
const removeFiles = require('./cli/cmd/removeFiles')
const removeTags = require('./cli/cmd/removeTags')
const listTags = require('./cli/cmd/listTags')
const search = require('./cli/cmd/search')


module.exports = () => {
	const args = parseArgs(process.argv.slice(2))
	const cmd = args._[0]

	//TODO: Add errors for missing fields.
	if(cmd == 'i' || cmd == 'init' || cmd == 'initialize')
		initTagDir({tagDirFilename: args._[1] || 'tag-dir.json'})
	else if(cmd == 'a' || cmd == 'add' || cmd == 'add-files') {
		addFiles({
			tagDirFilename: args.d || args.directory || 'tag-dir.json',
			filenames: args._.slice(1)
		})
	}
	else if(cmd == 't' || cmd == 'tag')
		tagFiles({
			tagDirFilename: args.d || args.directory || 'tag-dir.json',
			tags: [(args.tag || args.t)],
			filenames: args._.slice(1)
		})
	else if(cmd == 'un' || cmd == 'untag')
		untagFiles({
			tagDirFilename: args.d || args.directory || 'tag-dir.json',
			tags: [(args.tag || args.t)],
			filenames: args._.slice(1)
		})
	else if(cmd == 'rf' || cmd == 'remove-files')
		removeFiles({
			tagDirFilename: args.d || args.directory || 'tag-dir.json',
			filenames: args._.slice(1)
		})
	else if(cmd == 'rt' || cmd == 'remove-tags')
		removeTags({
			tagDirFilename: args.d || args.directory || 'tag-dir.json',
			tags: args._.slice(1)
		})
	else if(cmd == 'tags') {
		listTags({tagDirFilename: args._[1] || 'tag-dir.json'})
	}
	else if(cmd == 'search')
		search({
			tagDirFilename: args.d || args.directory || 'tag-dir.json',
			query: args._.slice(1).join(' ')
		})
	else
		console.log('Unrecognized command.')
	//TODO: Create a rename command to rename all instances of a path in the tag directory.
	//TODO: Add help and version command.
}