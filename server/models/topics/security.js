Topics.permit(["insert"]).ifLoggedIn().apply();
Topics.permit(["remove"]).ifLoggedIn().ifOwner().apply();
