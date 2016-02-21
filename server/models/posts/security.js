Posts.permit(["insert"]).ifLoggedIn().apply();
Posts.permit(["remove"]).ifLoggedIn().ifOwner().apply();
