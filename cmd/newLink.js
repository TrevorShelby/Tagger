const path = require('path')
const fs = require('fs')

const TagDirectory = require('../utils/tagDirectory')
const TagDirectoryFile = require('../utils/tagDirectoryFile')
const handleIssue = require('../utils/handleIssue')


const getLocalFsPath = filename => {
	const filepath = path.resolve(process.cwd(), filename)
	if(!fs.existsSync(filepath)) return
	else return filepath
}

const thenChain = val => {
	if(val.done) handleIssue('info', '101')
	else {
		if(val.event == 'tagCreated') handleIssue('info', '018', val.tag)
		val.promise.then(thenChain)
	}
}

module.exports = (tagDirFilepath='tag-dir.json', source, arg, tags) => {
	const location = (() => {
		if(source == 'local-fs') return getLocalFsPath(arg)
	})()
	const tagDirFile = new TagDirectoryFile(tagDirFilepath)
	if(!tagDirFile.exists())
		handleIssue('error', '001', tagDirFilepath)
	else {
		const tagDir = new TagDirectory(tagDirFile.read())
		tagDir.validate()
		tagDir.newLink({source, location, tags}).then(thenChain)
	}
}