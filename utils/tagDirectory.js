const uuidv4 = require('uuid/v4')


//calls a passed resolve function with a new promise and some data. then returns the resolve
//function of the new promise. this lets a promise return data without really ending.
const chainResolve = (resolve, data) => {
	let newResolve
	const promise = new Promise( res => newResolve = res )
	resolve({promise, ...data})
	return newResolve
}


module.exports = class TagDirectory {
	constructor(links={}, tags={}) {
		this.links = links
		this.tags = tags
	}


	validate() { return new Promise( notify => {
		Object.keys(this.links).forEach( lid => {
			const linkTags = this.links[lid].tags
			linkTags.forEach( tag => {
				if(!this.tags[tag].contains(lid))
					notify = chainResolve(notify, {done: false, event: 'tagMissingLink', lid, tag})
			})
		})
		Object.keys(this.tags).forEach( tag => {
			const taggedLids = this.tags[tag]
			taggedLids.forEach( lid => {
				if(!this.links[lid].tags.contains(tag))
					notify = chainResolve(notify, {done: false, event: 'linkMissingTag', lid, tag})
			})
		})
		notify({done: true})
	})}


	newLink(link) { return new Promise( notify => {
		//lid is short for for link UID.
		const lid = uuidv4()
		//yes, I could use the spread operator here, but I want to explicity list the link fields
		//in this section, as well as limit them (for now at least). -Trevor
		//The source is a string used as to identify what method is needed to access the conents of
		//	the link (e.g. "local-fs" for a link pointing to a local file).
		//The location's type is dependent on the source. It describes specifically where the link
		//	points to (e.g. "/home/trevor/Projects/Tagger/utils/tagDirectory.js" for a "local-fs"
		//	source).
		this.links[lid] = {
			source: link.source,
			location: link.location,
			tags: link.tags
		}
		link.tags.forEach( tag => {
			if(!(tag in this.tags)) {
				this.tags[tag] = []
				notify = chainResolve(notify, {done: false, event: 'tagCreated', tag})
			}
			this.tags[tag].push(lid)
		})
		notify({done: true})
	})}


	tagLinks(lids, tags) { return new Promise( notify => {
		lids.forEach( lid => {
			if(!(lids in this.links)) {
				notify = chainResolve(notify, {done: false, event: 'nonexistentLink', lid})
				return
			}
			tags.forEach( tag => {
				if(!(tag in this.tags)) {
					this.tags[tag] = []
					notify = chainResolve(notify, {done: false, event: 'tagCreated', tag})
				}
				this.links[lid].tags.push(tag)
				this.tags[tag].push(lid)
			})
		})
		notify({done: true})
	})}


	untagLinks(lids, tags) { return new Promise( notify => {
		lids.forEach( lid => {
			if(!(lid in this.links)) {
				notify = chainResolve(notify, {done: false, event: 'nonexistentLink', lid})
				return
			}
			tags.forEach( tag => {
				if(!(tag in this.tags)) {
					notify = chainResolve(notify, {done: false, event: 'nonexistentTag', tag})
					return
				}
				const link = this.links[lid]
				const tagIndex = link.tags.indexOf(tag)
				if(tagIndex == -1) {
					notify = chainResolve(notify, {done: false, event: 'tagNotInLink', lid, tag})
					return
				}
				const taggedLids = this.tags[tag]
				const lidIndex = taggedLids.indexOf(lid)

				link.tags.splice(tagIndex, 1)
				taggedLids.splice(lidIndex, 1)
			})
		})
		notify({done: true})
	})}


	removeLinks(lids) { return new Promise( notify => {
		lids.forEach( lid => {
			if(!(lid in this.links)) {
				notify = chainResolve(notify, {done: false, event: 'nonexistentLink', lid})
				return
			}
			const linkTags = this.links[lid].tags
			delete this.links[lid]
			linkTags.forEach( tag => {
				const lidIndex = this.tags[tag].indexOf(lid)
				this.tags[tag].splice(lidIndex, 1)
			})
		})
		notify({done: true})
	})}


	removeTags(tags) { return new Promise( notify => {
		tags.forEach( tag => {
			if(!(tag in this.tags)) {
				notify = chainResolve(notify, {done: false, event: 'nonexistentTag', tag})
				return
			}
			const taggedLids = this.tags[tag]
			delete this.tags[tag]
			taggedLids.forEach( lid => {
				const tagIndex = this.links[lid].tags.indexOf(tag)
				this.links[lid].tags.splice(tagIndex)
			})
		})
		notify({done: true})
	})}
}