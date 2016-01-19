Posts.permit(["insert"]).ifLoggedIn().apply();
Posts.permit(["remove"]).ifLoggedIn().ifCreated().apply();
