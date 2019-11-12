const { Notification, NotificationType } = require('../utils/tagDirectory.js')



const messages = {
	[Notification.FILE_ALREADY_EXISTS]: (file) => `${file} is already listed in this directory.`,
	[Notification.FILE_ALREADY_TAGGED]: (file, tag) => `${file} already has the tag '${tag}'.`,
	[Notification.NONEXISTENT_FILE]: (file) => `${file} isn't listed in this directory.`,
	[Notification.NONEXISTENT_TAG]: (tag) => `${tag} isn't listed in this directory.`,
	[Notification.TAG_NOT_IN_FILE]: (file, tag) => `${file} does not have the tag '${tag}'.`,
	[Notification.FILE_NOT_IN_TAG]: (file, tag) => `${file} has the tag '${tag}', but is not listed as having that tag in this directory.`,
	[Notification.ADDED_FILE]: (file) => `Added ${file} to this directory.`,
	[Notification.TAGGED_FILE]: (file, tag) => `Added the tag '${tag}' to ${file}.`,
	[Notification.UNTAGGED_FILE]: (file, tag) => `Removed the tag '${tag}' from ${file}.`,
	[Notification.REMOVED_FILE]: (file) => `Removed ${file} from this directory.`,
	[Notification.ADDED_TAG]: (tag) => `Created the tag '${tag}' for this directory.`,
	[Notification.REMOVED_TAG]: (tag) => `Removed all instances of the tag '${tag}' from this directory.`
}


const notify = (notification, ...data) => {
	const type = Notification.types[notification]
	const message = messages[notification](...data)
	if(type === NotificationType.ERROR || type == NotificationType.WARNING) {
		console.error(message)
		if(type == Notification.ERROR)
			process.exit(1)
	}
	else if(type == NotificationType.INFO)
		console.log(message)	
}



module.exports = notify