const path = require('path')
const fs = require('fs')

const TagDirectory = require('../utils/tagDirectory')
const TagDirectoryFile = require('../utils/tagDirectoryFile')
const handleIssue = require('../utils/handleIssue')


const reportNewLinkIssues = val => {
	if(val.done) handleIssue('info', '101')
	else {
		if(val.event == 'tagCreated') handleIssue('info', '018', val.tag)
		val.promise.then(reportNewLinkIssues)
	}
}

const reportTagDirIssues_ = (links, getDisplayName) => val => {
	if(!val.done) {
		//TODO: Consider removing process.exit(1) from handleIssues, so that multiple errors can be
		//listed.
		const location = links[val.lid].location
		if(val.event == 'linkMissingTag')
			handleIssue('error', '012', getDisplayName(location), val.tag)
		else if(val.event == 'tagMissingLink')
			handleIssue('error', '013', getDisplayName(location), val.tag)
		val.promise.then(reportTagDirIssues)
	}
}

const sourceScripts = {
	'local-fs': {
		cliInputToLocation: filename => path.resolve(process.cwd(), filename),
		getLinkInfo: (location, fields) => {
			const linkInfo = {}
			fields.forEach( field => {
				if(field == 'exists')
					linkInfo.exists = fs.existsSync(location)
				else if(field == 'equals')
					linkInfo.equals = otherLocation => location == otherLocation
				else if(field == 'displayName')
					linkInfo.displayName = location
			})
			return linkInfo
		}
	}
}


module.exports = async (tagDirFilepath='tag-dir.json', source, arg, tags) => {
	//TODO: Figure something out if sourceScripts doesn't have the listed source.
	const { cliInputToLocation, getLinkInfo } = sourceScripts[source]
	const location = cliInputToLocation(arg)
	const {
		exists: linkExists,
		equals: linkEquals,
		displayName
	} = getLinkInfo(location, ['exists', 'equals', 'displayName'])

	//TODO: Handle error more effectively.
	if(!linkExists)
		throw new Error('location doesn\'t exist.')

	const tagDirFile = new TagDirectoryFile(tagDirFilepath)
	if(!tagDirFile.exists())
		handleIssue('error', '001', tagDirFilepath)
	else {
		const tagDir = new TagDirectory(tagDirFile.read())

		//Checks for a duplicate link.
		const lids = Object.keys(tagDir.links)
		const duplicateLinkLid = lids
			.filter( lid => tagDir.links[lid].source == source )
			.find( lid => linkEquals(tagDir.links[lid].location) )
		if(duplicateLinkLid != undefined)
			handleIssue('error', '019', displayName, duplicateLinkLid)

		await tagDir.validate().then(reportTagDirIssues_(
			tagDir.links,
			location => getLinkInfo(location, ['displayName']).displayName
		))
		await tagDir.newLink({source, location, tags}).then(reportNewLinkIssues)
		tagDirFile.write(tagDir)
	}
}