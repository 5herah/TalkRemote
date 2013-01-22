Meteor.Router.add({
  '/': 'mainPage',
  '/teacherRemote':'teacherRemote',
  '/studentRemote':'studentRemote',
  '/studentTotalsPane':'studentTotalsPane',
  '*/teacher': 'teacherView',
  '*': 'room'
});

// use this code to manage active state on buttons
// $("li a").click( function() {
//   $(".active").removeClass("active");
//   $(this).parent("li").addClass("active");
// });

Template.mainPage.events({
});

Template.room.roomName = function(){
  return this.location.pathname;
};

Template.remote.votes = function(){
  var initialbuttons = ["pause", "rewind", "play", "fastforward", "eject"];

  for(var i; i<initialbuttons.length; i++){
    $("#" + initialbuttons[i] + "Stats").html(Votes.find(query).count());
  }
}

Template.remote.events({
  'click .remoteButton': function(event){
    //determine if this is a student or teacher iew. if teacher view, don't allow incrementation. otherwise move forward with the base logic.
    // if(){

    // }else{
    var button = event.target.parentElement.id;
    var push = {};
    push[button] = 1;

    var roomName = this.location.pathname;
    var room = {};
    room["room"] = roomName;

    var username= Meteor.user().profile.name;
    var name = {};
    name["username"] = username;

    Votes.insert(push, room, name);

    var query = {};
    query[button] = {$exists: true };
    $("#" + button + "Stats").html(Votes.find(query).count());
    //}

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
