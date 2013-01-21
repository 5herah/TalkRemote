Meteor.startup(function () {
  if (Students.find().count() === 0) {
    var names = ["Sherah Smith",
                 "CJ Winslow",
                 "Nathan Houle",
                 "Mark Rosetti",
                 "Megan Tulac"];
    for (var i = 0; i < names.length; i++)
      Students.insert({name: names[i], Play: 0, Pause: 0, Rewind: 0, FastForward:0});
  }
});
