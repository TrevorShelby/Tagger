const path = require('path')
const { readTagDirectory, writeTagDirectory } = require('../tagDirIo')
const notify = require('../tagDirNotifications')



//TODO: Allow for the tagging of directories
module.exports = ({tagDirFilename='tag-dir.json', filenames, tags}) => {
	const tagDir = readTagDirectory(tagDirFilename)

	const filepaths = filenames.map(filename => path.resolve(process.cwd(), filename))
	tags = tags.filter( tag => {
		if(/^\w+$/.test(tag)) return true
		else {
			console.error(`${tag} is not a valid tag. Tags may only contain letters, numbers, and underscores.`)
			return false
		}
	})

	tagDir.tagFiles(filepaths, tags, notify)
	writeTagDirectory(tagDirFilename, tagDir)
}