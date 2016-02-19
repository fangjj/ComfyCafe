Invites.permit(["insert"]).ifLoggedIn().apply();
Invites.permit(["update", "remove"]).ifLoggedIn().ifOwner().apply();
