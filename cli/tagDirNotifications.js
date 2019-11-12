const { Notification, NotificationType } = require('../utils/tagDirectory.js')



const messages = {
	[Notification.FILE_ALREADY_EXISTS]: (file) => `${file} is already listed in this directory.`,
	[Notification.ADDED_FILE]: (file) => `Added ${file} to this directory.`
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