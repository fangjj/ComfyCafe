Comments.permit(["insert"]).ifLoggedIn().apply();
Comments.permit(["remove"]).ifLoggedIn().ifOwner().apply();
