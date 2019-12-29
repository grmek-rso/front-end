var proxyAddr = "https://35.225.177.157/";

function loadPageAllUsers() {
	var users = getUsers();
	
	var mainContent = "";
	
	mainContent += "<div><h2>All Users</h2>";
	for (var i = 0; i < users.length; i++) {
		mainContent += "<p><a href=\"javascript:deleteUser(" + users[i]["id"] + ");\">X</a> - <a href=\"javascript:loadPageAllAlbums(" + users[i]["id"] + ");\">" + users[i]["name"] + " (" + users[i]["id"] + ")</a></p>";
	}
	mainContent += "</div>";
	
	mainContent += "<div><div><h2>New User</h2><form action=\"javascript:addUser();\"><input id=\"user-name\" type=\"text\"><input type=\"submit\" value=\"Add\"></form></div>";
	
	document.getElementById("main").innerHTML = mainContent;
}

function addUser() {
	var request = new XMLHttpRequest();
	request.open("POST", proxyAddr + "image-managing/v1/users", false);
	request.setRequestHeader("Content-Type", "application/json");
	request.send("{\"name\":\"" + document.getElementById("user-name").value + "\"}");
	loadPageAllUsers();
}

function getUsers() {
	var request = new XMLHttpRequest();
	request.open("GET", proxyAddr + "image-managing/v1/users", false);
	request.send(null);
	if (request.readyState == 4 && request.status == 200) {
		return JSON.parse(request.responseText);
	}
	else {
		return null;
	}
}

function getUser(userId) {
	var request = new XMLHttpRequest();
	request.open("GET", proxyAddr + "image-managing/v1/users/" + userId, false);
	request.send(null);
	if (request.readyState == 4 && request.status == 200) {
		return JSON.parse(request.responseText)["name"];
	}
	else {
		return null;
	}
}

function deleteUser(userId) {
	var request = new XMLHttpRequest();
	request.open("DELETE", proxyAddr + "image-managing/v1/users/" + userId, false);
	request.send(null);
	loadPageAllUsers();
}

function loadPageAllAlbums(userId) {
	var userName = getUser(userId);
	var albums = getAlbums(userId);
	
	var mainContent = "";
	
	mainContent += "<div><h2>User</h2><p><b>" + userName + " (" + userId + ")</b></p><p><a href=\"javascript:loadPageAllUsers();\">Back to users ...</a></p></div>";
	
	mainContent += "<div><h2>All Albums</h2>";
	for (var i = 0; i < albums.length; i++) {
		mainContent += "<p><a href=\"javascript:deleteAlbum(" + userId + ", " + albums[i]["id"] + ");\">X</a> - <a href=\"javascript:loadPageAllImages(" + userId + ", " + albums[i]["id"] + ");\">" + albums[i]["name"] + " (" + albums[i]["id"] + ")</a></p>";
	}
	mainContent += "</div>";
	
	mainContent += "<div><h2>New Album</h2><form action=\"javascript:addAlbum(" + userId + ");\"><input id=\"album-name\" type=\"text\"><input type=\"submit\" value=\"Add\"></form></div>";
	
	var sharedAlbums = getSharedAlbums(userId);
	
	mainContent += "</div><div><h2>Shared Albums</h2>";
	for (var i = 0; i < sharedAlbums.length; i++) {
		var sharingUserId = sharedAlbums[i]["userId"];
		var sharingUserName = getUser(sharingUserId);
		var sharingAlbumId = sharedAlbums[i]["albumId"];
		var sharingAlbumName = getAlbum(sharingUserId, sharingAlbumId);
		mainContent += "<p><a href=\"javascript:deleteSharedAlbumFromAlbums(" + sharingUserId + ", " + sharingAlbumId + ", " + userId + ");\">X</a> - <a href=\"javascript:loadPageAllSharedImages(" + userId + ", " + sharingUserId + ", " + sharingAlbumId + ");\">" + sharingAlbumName + " (" + sharingAlbumId + ") from " + sharingUserName + " (" + sharingUserId + ")</a></p>";
	}
	mainContent += "</div>";
	
	document.getElementById("main").innerHTML = mainContent;
}

function addAlbum(userId) {
	var request = new XMLHttpRequest();
	request.open("POST", proxyAddr + "image-managing/v1/users/" + userId + "/albums", false);
	request.setRequestHeader("Content-Type", "application/json");
	request.send("{\"name\":\"" + document.getElementById("album-name").value + "\"}");
	loadPageAllAlbums(userId);
}

function getAlbums(userId) {
	var request = new XMLHttpRequest();
	request.open("GET", proxyAddr + "image-managing/v1/users/" + userId + "/albums", false);
	request.send(null);
	if (request.readyState == 4 && request.status == 200) {
		return JSON.parse(request.responseText);
	}
	else {
		return null;
	}
}

function getAlbum(userId, albumId) {
	var request = new XMLHttpRequest();
	request.open("GET", proxyAddr + "image-managing/v1/users/" + userId + "/albums/" + albumId, false);
	request.send(null);
	if (request.readyState == 4 && request.status == 200) {
		return JSON.parse(request.responseText)["name"];
	}
	else {
		return null;
	}
}

function deleteAlbum(userId, albumId) {
	var request = new XMLHttpRequest();
	request.open("DELETE", proxyAddr + "image-managing/v1/users/" + userId + "/albums/" + albumId, false);
	request.send(null);
	loadPageAllAlbums(userId);
}

function loadPageAllImages(userId, albumId) {
	var userName = getUser(userId);
	var albumName = getAlbum(userId, albumId);
	var images = getImages(userId, albumId);
	
	var mainContent = "";
	
	mainContent += "<div><h2>User</h2><p><b>" + userName + " (" + userId + ")</b></p><p><a href=\"javascript:loadPageAllUsers();\">Back to users ...</a></p></div>";
	
	mainContent += "<div><h2>Album</h2><p><b>" + albumName + " (" + albumId + ")</b></p><p><a href=\"javascript:loadPageAllAlbums(" + userId + ");\">Back to albums ...</a></p></div>";
	
	mainContent += "<div><h2>All Images</h2>";
	for (var i = 0; i < images.length; i++) {
		mainContent += "<p><a href=\"javascript:deleteImage(" + userId + ", " + albumId + ", " + images[i]["id"] + ");\">X</a> - <a href=\"javascript:loadPageImage(" + userId + ", " + albumId + ", " + images[i]["id"] + ");\">" + images[i]["name"] + " (" + images[i]["id"] + ")</a></p>";
	}
	mainContent += "</div>";
	
	mainContent += "<div><h2>New Image</h2><form action=\"javascript:addImage(" + userId + ", " + albumId + ");\"><input id=\"image-name\" type=\"text\"><input id=\"image-file\" type=\"file\"><input type=\"submit\" value=\"Upload\"><label id=\"uploading-label\"></label></form></div>";
	
	var usersWithAccess = getUsersWithAccess(userId, albumId);
	
	mainContent += "<div><h2>Shared with</h2>";
	for (var i = 0; i < usersWithAccess.length; i++) {
		userWithAccessName = getUser(usersWithAccess[i]);
		mainContent += "<p><a href=\"javascript:deleteSharedAlbumFromImages(" + userId + ", " + albumId + ", " + usersWithAccess[i] + ");\">X</a> - " + userWithAccessName + " (" + usersWithAccess[i] + ")</p>";
	}
	mainContent += "</div>";
	
	mainContent += "<div><h2>Share Album with another user (enter the ID)</h2><form action=\"javascript:addSharedAlbum(" + userId + ", " + albumId + ");\"><input id=\"shared-with-user-id\" type=\"text\"><input type=\"submit\" value=\"Share\"></form></div>";
	
	document.getElementById("main").innerHTML = mainContent;
}

function loadPageAllSharedImages(userId, sharingUserId, sharingAlbumId) {
	var userName = getUser(userId);
	var sharingUserName = getUser(sharingUserId);
	var sharingAlbumName = getAlbum(sharingUserId, sharingAlbumId);
	var images = getImages(sharingUserId, sharingAlbumId);
	
	var mainContent = "";
	
	mainContent += "<div><h2>User</h2><p><b>" + userName + " (" + userId + ")</b></p><p><a href=\"javascript:loadPageAllUsers();\">Back to users ...</a></p></div>";
	
	mainContent += "<div><h2>Shared Album</h2><p><b>" + sharingAlbumName + " (" + sharingAlbumId + ") from " + sharingUserName + " (" + sharingUserId + ")</b></p><p><a href=\"javascript:loadPageAllAlbums(" + userId + ");\">Back to albums ...</a></p></div>";
	
	mainContent += "<div><h2>All Images</h2>";
	for (var i = 0; i < images.length; i++) {
		mainContent += "<p><a href=\"javascript:loadPageSharedImage(" + userId + ", " + sharingUserId + ", " + sharingAlbumId + ", " + images[i]["id"] + ");\">" + images[i]["name"] + " (" + images[i]["id"] + ")</a></p>";
	}
	mainContent += "</div>";
	
	document.getElementById("main").innerHTML = mainContent;
}

function addImage(userId, albumId) {
	document.getElementById('uploading-label').innerHTML = ' ... upload in progress.';
	
	var formData = new FormData();
	formData.append("image-name", document.getElementById("image-name").value);
	formData.append("image-file", document.getElementById("image-file").files[0]);

	var request = new XMLHttpRequest();
	request.open("POST", proxyAddr + "image-managing/v1/users/" + userId + "/albums/" + albumId + "/images", false);
	request.send(formData);
	loadPageAllImages(userId, albumId);
}

function getImages(userId, albumId) {
	var request = new XMLHttpRequest();
	request.open("GET", proxyAddr + "image-managing/v1/users/" + userId + "/albums/" + albumId + "/images", false);
	request.send(null);
	if (request.readyState == 4 && request.status == 200) {
		return JSON.parse(request.responseText);
	}
	else {
		return null;
	}
}

function getImage(userId, albumId, imageId) {
	var request = new XMLHttpRequest();
	request.open("GET", proxyAddr + "image-managing/v1/users/" + userId + "/albums/" + albumId + "/images/" + imageId, false);
	request.send(null);
	if (request.readyState == 4 && request.status == 200) {
		return JSON.parse(request.responseText);
	}
	else {
		return null;
	}
}

function deleteImage(userId, albumId, imageId) {
	var request = new XMLHttpRequest();
	request.open("DELETE", proxyAddr + "image-managing/v1/users/" + userId + "/albums/" + albumId + "/images/" + imageId, false);
	request.send(null);
	loadPageAllImages(userId, albumId);
}

function addSharedAlbum(userId, albumId) {
	var sharedWithUserId = document.getElementById("shared-with-user-id").value
	if (getUser(sharedWithUserId) != null && userId != sharedWithUserId) {
		var request = new XMLHttpRequest();
		request.open("POST", proxyAddr + "sharing/v1/shared-albums?shared-with-user=" + sharedWithUserId, false);
		request.setRequestHeader("Content-Type", "application/json");
		request.send("{\"userId\":\"" + userId + "\", \"albumId\":\"" + albumId + "\"}");
	}
	loadPageAllImages(userId, albumId);
}

function getSharedAlbums(sharedWithUserId) {
	var request = new XMLHttpRequest();
	request.open("GET", proxyAddr + "sharing/v1/shared-albums?shared-with-user=" + sharedWithUserId, false);
	request.send(null);
	if (request.readyState == 4 && request.status == 200) {
		return JSON.parse(request.responseText);
	}
	else {
		return null;
	}
}

function deleteSharedAlbumFromAlbums(userId, albumId, sharedWithUserId) {
	var request = new XMLHttpRequest();
	request.open("DELETE", proxyAddr + "sharing/v1/shared-albums?shared-with-user=" + sharedWithUserId, false);
	request.setRequestHeader("Content-Type", "application/json");
	request.send("{\"userId\":\"" + userId + "\", \"albumId\":\"" + albumId + "\"}");
	loadPageAllAlbums(sharedWithUserId);
}

function deleteSharedAlbumFromImages(userId, albumId, sharedWithUserId) {
	var request = new XMLHttpRequest();
	request.open("DELETE", proxyAddr + "sharing/v1/shared-albums?shared-with-user=" + sharedWithUserId, false);
	request.setRequestHeader("Content-Type", "application/json");
	request.send("{\"userId\":\"" + userId + "\", \"albumId\":\"" + albumId + "\"}");
	loadPageAllImages(userId, albumId);
}

function getUsersWithAccess(userId, albumId) {
	var request = new XMLHttpRequest();
	request.open("GET", proxyAddr + "sharing/v1/users-with-access?user=" + userId + "&album=" + albumId, false);
	request.send(null);
	if (request.readyState == 4 && request.status == 200) {
		return JSON.parse(request.responseText);
	}
	else {
		return null;
	}
}

function loadPageImage(userId, albumId, imageId) {
	var userName = getUser(userId);
	var albumName = getAlbum(userId, albumId);
	var image = getImage(userId, albumId, imageId);
	
	var mainContent = "";
	
	mainContent += "<div><h2>User</h2><p><b>" + userName + " (" + userId + ")</b></p><p><a href=\"javascript:loadPageAllUsers();\">Back to users ...</a></p></div>";
	
	mainContent += "<div><h2>Album</h2><p><b>" + albumName + " (" + albumId + ")</b></p><p><a href=\"javascript:loadPageAllAlbums(" + userId + ");\">Back to albums ...</a></p></div>";
	
	mainContent += "<div><h2>Image</h2>";
	mainContent += "<p><b>" + image["name"] + " (" + imageId + ")</b></p>";
	mainContent += "<p><a href=\"javascript:loadPageAllImages(" + userId + ", " + albumId + ");\">Back to images ...</a></p>";
	mainContent += "<p></p>";
	mainContent += "<p><img src=\"" + image["url"] + "\" height=\"400\"></p>";
	mainContent += "<p></p>";
	mainContent += "<p>" + image["labels"] + "</p>";
	mainContent += "</div>";
	
	var comments = getComments(userId, albumId, imageId);
	
	mainContent += "<div><h2>Comments</h2>";
	for (var i = 0; i < comments.length; i++) {
		commentUserName = getUser(comments[i]["commentUserId"]);
		mainContent += "<p><a href=\"javascript:deleteCommentFromOwnImage(" + comments[i]["id"] + ", " + userId + ", " + albumId + ", " + imageId + ");\">X</a> - " + commentUserName + " (" + comments[i]["commentUserId"] + "): " + comments[i]["commentText"] + "</p>";
	}
	mainContent += "</div>";
	
	mainContent += "<div><h2>New comment</h2><form action=\"javascript:addCommentToImage(" + userId + ", " + userId + ", " + albumId + ", " + imageId + ");\"><input id=\"comment\" type=\"text\"><input type=\"submit\" value=\"Add\"></form></div>";
	
	document.getElementById("main").innerHTML = mainContent;
}

function loadPageSharedImage(userId, sharingUserId, sharingAlbumId, sharingImageId) {
	var userName = getUser(userId);
	var sharingUserName = getUser(sharingUserId);
	var sharingAlbumName = getAlbum(sharingUserId, sharingAlbumId);
	var image = getImage(sharingUserId, sharingAlbumId, sharingImageId);
	
	var mainContent = "";
	
	mainContent += "<div><h2>User</h2><p><b>" + userName + " (" + userId + ")</b></p><p><a href=\"javascript:loadPageAllUsers();\">Back to users ...</a></p></div>";
	
	mainContent += "<div><h2>Shared Album</h2><p><b>" + sharingAlbumName + " (" + sharingAlbumId + ") from " + sharingUserName + " (" + sharingUserId + ")</b></p><p><a href=\"javascript:loadPageAllAlbums(" + userId + ");\">Back to albums ...</a></p></div>";
	
	mainContent += "<div><h2>Image</h2>";
	mainContent += "<p><b>" + image["name"] + " (" + sharingImageId + ")</b></p>";
	mainContent += "<p><a href=\"javascript:loadPageAllSharedImages(" + userId + ", " + sharingUserId + ", " + sharingAlbumId + ");\">Back to images ...</a></p>";
	mainContent += "<p></p>";
	mainContent += "<p><img src=\"" + image["url"] + "\" height=\"400\"></p>";
	mainContent += "<p></p>";
	mainContent += "<p>" + image["labels"] + "</p>";
	mainContent += "</div>";
	
	var comments = getComments(sharingUserId, sharingAlbumId, sharingImageId);
	
	mainContent += "<div><h2>Comments</h2>";
	for (var i = 0; i < comments.length; i++) {
		commentUserName = getUser(comments[i]["commentUserId"]);
		if (userId == comments[i]["commentUserId"]) {
			mainContent += "<p><a href=\"javascript:deleteCommentFromSharedImage(" + comments[i]["id"] + ", " + userId + ", " + sharingUserId + ", " + sharingAlbumId + ", " + sharingImageId + ");\">X</a> - " + commentUserName + " (" + comments[i]["commentUserId"] + "): " + comments[i]["commentText"] + "</p>";
		}
		else {
			mainContent += "<p>X - " + commentUserName + " (" + comments[i]["commentUserId"] + "): " + comments[i]["commentText"] + "</p>";
		}
	}
	mainContent += "</div>";
	
	mainContent += "<div><h2>New comment</h2><form action=\"javascript:addCommentToImage(" + userId + ", " + sharingUserId + ", " + sharingAlbumId + ", " + sharingImageId + ");\"><input id=\"comment\" type=\"text\"><input type=\"submit\" value=\"Add\"></form></div>";
	
	document.getElementById("main").innerHTML = mainContent;
}

function addCommentToImage(commentUserId, userId, albumId, imageId) {
	var request = new XMLHttpRequest();
	request.open("POST", proxyAddr + "commenting/v1/comments?user=" + userId + "&album=" + albumId + "&image=" + imageId, false);
	request.setRequestHeader("Content-Type", "application/json");
	request.send("{\"commentUserId\":\"" + commentUserId + "\", \"commentText\":\"" + document.getElementById("comment").value + "\"}");
	if (commentUserId == userId) { 
		loadPageImage(userId, albumId, imageId);
	}
	else {
		loadPageSharedImage(commentUserId, userId, albumId, imageId);
	}
}

function getComments(userId, albumId, imageId) {
	var request = new XMLHttpRequest();
	request.open("GET", proxyAddr + "commenting/v1/comments?user=" + userId + "&album=" + albumId + "&image=" + imageId, false);
	request.send(null);
	if (request.readyState == 4 && request.status == 200) {
		return JSON.parse(request.responseText);
	}
	else {
		return null;
	}
}

function deleteCommentFromOwnImage(commentId, userId, albumId, imageId) {
	var request = new XMLHttpRequest();
	request.open("DELETE", proxyAddr + "commenting/v1/comments?id=" + commentId, false);
	request.send(null);
	loadPageImage(userId, albumId, imageId);
}

function deleteCommentFromSharedImage(commentId, userId, sharingUserId, sharingAlbumId, sharingImageId) {
	var request = new XMLHttpRequest();
	request.open("DELETE", proxyAddr + "commenting/v1/comments?id=" + commentId, false);
	request.send(null);
	loadPageSharedImage(userId, sharingUserId, sharingAlbumId, sharingImageId);
}
