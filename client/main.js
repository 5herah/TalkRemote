Meteor.Router.add({
  '/': 'mainPage',
  '/teacher': 'teacherView',
  '/teacherRemote':'teacherRemote',
  '/student': 'studentView',
  '/studentRemote':'studentRemote',
  '/studentTotalsPane':'studentTotalsPane',
  '*': 'not_found'
});

Template.mainPage.events({
  'click .teacher' : function(){
    Meteor.Router.to("/teacher");
  },
  'click .student' : function(){
    Meteor.Router.to("/student");
  }
});

Template.not_found.events({
  'click p': function(){
    return this.location.pathname;
  }
});

Template.not_found.roomName = function(){
  return this.location.pathname;
};

Template.remote.events({
  'click .remoteButton': function(event){
    var button = event.target.parentElement.id;
    var push = {};
    push[button] = 1;

    var roomName = this.location.pathname;
    var room = {};
    room["room"] = roomName;

    Votes.insert(push, room);
    var query = {};
    query[button] = {$exists: true };
    $("#" + button + "Stats").html(Votes.find(query).count());
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
