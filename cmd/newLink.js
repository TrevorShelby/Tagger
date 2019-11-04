const path = require('path')
const fs = require('fs')

const TagDirectory = require('../utils/tagDirectory')
const TagDirectoryFile = require('../utils/tagDirectoryFile')
const handleIssue = require('../utils/handleIssue')


//TODO: Create source-based functions that check for locations with repeat listings. e.g. for
//local-fs, a function that checks to see if there are any other links that use the same filepath
//for their location.
const getLocalFsPath = filename => {
	const filepath = path.resolve(process.cwd(), filename)
	if(!fs.existsSync(filepath)) return
	else return filepath
}

const reportNewLinkIssues = val => {
	if(val.done) handleIssue('info', '101')
	else {
		if(val.event == 'tagCreated') handleIssue('info', '018', val.tag)
		val.promise.then(reportNewLinkIssues)
	}
}

const reportTagDirIssues = val => {
	if(!val.done) {
		//TODO: Consider removing process.exit(1) from handleIssues, so that multiple errors can be
		//listed.
		//TODO: Replace val.lid with a function that prints out an appropriate display for the
		//links location, given its source (which should be partially applied to this function).
		if(val.event == 'linkMissingTag') handleIssue('error', '012', val.lid, val.tag)
		else if(val.event == 'tagMissingLink') handleIssue('error', '013', val.lid, val.tag)
		val.promise.then(reportTagDirIssues)
	}
}

module.exports = (tagDirFilepath='tag-dir.json', source, arg, tags) => {
	const location = (() => {
		if(source == 'local-fs') return getLocalFsPath(arg)
	})()
	if(location == undefined) throw Error('undefined location')
	const tagDirFile = new TagDirectoryFile(tagDirFilepath)
	if(!tagDirFile.exists())
		handleIssue('error', '001', tagDirFilepath)
	else {
		const tagDir = new TagDirectory(tagDirFile.read())
		tagDir.validate().then(reportTagDirIssues)
		tagDir.newLink({source, location, tags}).then(reportNewLinkIssues)
		tagDirFile.write(tagDir)
	}
}