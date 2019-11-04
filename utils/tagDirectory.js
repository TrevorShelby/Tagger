const uuidv4 = require('uuid/v4')


//calls a passed resolve function with a new promise and some data. then returns the resolve
//function of the new promise. this lets a promise return data without really ending.
const chainResolve = (resolve, data) => {
	let newResolve
	const promise = new Promise( res => newResolve = res )
	resolve({promise, ...data})
	return newResolve
}


class TagDirectory {
	constructor(links={}, tags={}) {
		this.links = links
		this.tags = tags
	}


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
				if(lidIndex == -1) {
					notify = chainResolve(notify, {done: false, event: 'linkNotInTags', lid, tag})
					return
				}

				link.tags.splice(tagIndex, 1)
				taggedLids.splice(lidIndex, 1)
			})
		})
		notify({done: true})
	})}
}



(() => {
	const tagDir = new TagDirectory()
	const promise = tagDir.newLink({
		source: 'local-fs',
		location: '/home/trevor/Projects/Tagger/index.js',
		tags: ['cli']
	})

	function logTag(promise) {
		promise.then( val => {
			if(val.done) console.log('done!')
			else {
				console.log(val.tag)
				logTag(val.promise)
			}
		})
	}
	logTag(promise)
})()