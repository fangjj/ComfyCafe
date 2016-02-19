Messages.permit(["insert"]).ifLoggedIn().apply();
Messages.permit(["remove"]).ifLoggedIn().ifOwner().apply();
