BlogPosts.permit(["insert"]).ifLoggedIn().apply();
BlogPosts.permit(["remove"]).ifLoggedIn().ifOwner().apply();
