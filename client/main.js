Meteor.Router.add({
  '/': 'mainPage',
  '/:room' : function(room){
    Session.set('roomName', room);
    return 'room';
  },
  '*/teacher' : 'teacherView',
  '/settings' : 'settings',
  '/statsView' : 'statsView'
});

Template.room.roomName = function(){
  return this.location.pathname;
};

Template.home.events({
  'click .submitRoomButton': function(event, target){
    event.preventDefault();
    Meteor.Router.to($('[name=roomName]').val());
  },
  'click .studentDemoButton': function(){
    Meteor.Router.to('studentdemo');
  },
  'click .teacherDemoButton': function(){
    Meteor.Router.to('studentdemo/teacher');
  }
});

Template.sidebar.events({
  'click li': function(event){
    switch(event.target.parentElement.id){
      case 'homeNav':
        Meteor.Router.to('/');
      break;
      case 'loginNav':
        Meteor.Router.to('/settings');
      break;
      case 'statsNav':
        Meteor.Router.to('/statsView');
      break;
    }
  }
});

Template.remoteStats.voteStats = function(){
  return [
    makeVoteStat('pause'),
    makeVoteStat('rewind'),
    makeVoteStat('play'),
    makeVoteStat('fastforward'),
    makeVoteStat('eject'),
  ];
};

var makeVoteStat = function(button){
  return {
    button: button,
    voteCount: getVoteCount(button)//count of uniqued votes where the value is play.
  };
};

var getVoteCount = function(button){
  // todo: do this uniquing with miniMongo somehow
  var uniquedVotes = {};

  Votes.find({}, {sort: {timestamp: 1}})
    .map(function(vote){
      uniquedVotes[vote.username] = vote;
    }); // turn uniqued votes into an array of votes

  return _(uniquedVotes).reduce(function(count, vote){
    return count + (vote.button === button ? 1 : 0);
  }, 0);
};

Template.remote.events({
  'click .remoteButton': function(event){
    var button = event.target.id;
    Votes.insert({
      room: this.location.pathname,
      username: Meteor.user().profile.name,
      userID: Meteor.user()._id,
      button: button,
      timestamp: Date()
    });

    $(".userselection").removeClass("userselection");
    $("#" + button).addClass('userselection');

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
