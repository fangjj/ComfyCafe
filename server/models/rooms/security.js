Rooms.permit(["insert"]).ifLoggedIn().apply();
Rooms.permit(["remove"]).ifLoggedIn().ifOwner().apply();
