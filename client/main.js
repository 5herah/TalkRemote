Meteor.Router.add({
  '/': 'mainPage',
  '/:room' : function(room){
    Session.set('roomName', room);
    return 'room';
  },
  '*/teacher' : 'teacherView'
});

// use this code to manage active state on buttons
// $("li a").click( function() {
//   $(".active").removeClass("active");
//   $(this).parent("li").addClass("active");
// });

Template.room.roomName = function(){
  return this.location.pathname;
};

Template.remoteStats.voteStats = function(){
  var uniquedVotes = {};

  Votes.find({}, {sort: {timestamp: 1}})
    .map(function(vote){
      uniquedVotes[vote.username] = vote;
    }); // turn uniqued votes into an array of votes

  
  // var getVotes = function(button){
  //   var votes = 0;

  //   _.each(uniquedVotes, function(){
  //       if value = button
  //       votes = votes + 1;
  //     })
  // }

  var voteStats = [
    {
      button: 'play',
      voteCount: 0//count of uniqued votes where the value is play.
    }
  ];
  return voteStats;

  // return [
  //   {
  //     votes: Votes.find({button:"eject", room:Session.get('roomName')}).count(),
  //     button: 'eject'
  //   }
  // ];
}


Template.remote.events({
  'click .remoteButton': function(event){
    var button = event.target.parentElement.id;

    Votes.insert({
      room: this.location.pathname,
      username: 'dude',//Meteor.user().profile.name,
      userID: '23534',//Meteor.user()._id,
      button: button,
      timestamp: Date()
    });
  }
});

Template.studentList.selected_name = function () {
  var student = Students.findOne(Session.get("selected_student"));
  return student && student.name;
};

Template.student.selected = function () {
  return Session.equals("selected_student", this._id) ? "selected" : '';
};

Template.studentList.events({
  'click input.play': function (event) {
    var value = String(event.target.value);
    Students.update(Session.get("selected_student"), {$inc: {Play: 1}});
  },
  'click input.pause': function (event) {
    var value = String(event.target.value);
    Students.update(Session.get("selected_student"), {$inc: {Pause: 1}});
  },
  'click input.rewind': function (event) {
    var value = String(event.target.value);
    Students.update(Session.get("selected_student"), {$inc: {Rewind: 1}});
  },
  'click input.fastforward': function (event) {
    var value = String(event.target.value);
    Students.update(Session.get("selected_student"), {$inc: {FastForward: 1}});
  }
});

Template.student.events({
  'click': function () {
    Session.set("selected_student", this._id);
  }
});
