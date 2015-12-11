if (Meteor.isServer) {
  Meteor.methods({
    generateName: function () {
      var data = Meteor.http.get("http://localhost:5000/");
      return data.content;
    }
  });
}
