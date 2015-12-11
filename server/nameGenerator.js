Meteor.methods({
  generateName: function () {
    var data = Meteor.http.get("http://localhost:5000/");
    return data.content.substring(1, data.content.length - 2)
  }
});
