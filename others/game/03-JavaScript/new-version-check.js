window.checkNewVersion = function () {
	const apiKey = "AIzaSyCu0F1pUOocM6R0wJ4tmug6SPTX19JRVQc"; // Google API key, restricted to Blogspot
	const dolBlogId = "7051760000701686365"; // Blogspot BlogID

	if (State.variables.notifyUpdate === undefined) State.variables.notifyUpdate = true;

	if (State.variables.notifyUpdate) {
		// get the list of last 10 posts and check their titles to find latest version
		$.ajax({
			url: "https://www.googleapis.com/blogger/v3/blogs/" + dolBlogId + "/posts?key=" + apiKey,
			dataType: "jsonp",
			success: handleVersionResponse,
		});
	}
};

function handleVersionResponse(response) {
	const titleRE = /Degrees of Lewdity\.*? version (\d+\.\d+(?:\.\d+(?:\.\d+)?)?)/;
	let version, postDate;

	// check if response is ok
	if ("items" in response) {
		// find the newest post with a title that matches new update title string
		for (let i = 0; i < response.items.length; i++) {
			if (titleRE.test(response.items[i].title)) {
				version = titleRE.exec(response.items[i].title)[1];
				postDate = new Date(Date.parse(response.items[i].updated || response.items[i].published));
				break;
			}
		}

		// make sure that such post was found within last 10 posts
		if (version && postDate) {
			const hours = Math.floor((Date.now() - postDate) / 1000 / 60 / 60); // hours since latest release
			const days = Math.floor(hours / 24); // whole days since latest release

			// check if latest version is newer than the current one
			if (version > StartConfig.version) {
				if (!State.variables.newVersionDismissed || (State.variables.newVersionDismissed && State.variables.remoteDoLVersion !== version)) {
					// create data for notification
					State.variables.newVersionData = { version, days, hours };
					delete State.variables.newVersionDismissed;

					// show notification if one isn't there already
					if ($("#new-version-notification").length === 0) $(".passage").prepend(new Wikifier(null, "<<newversionnotification>>").output);
				} else {
					delete State.variables.newVersionData;
				}
				State.variables.remoteDoLVersion = version;
			}
		}
	}
}
