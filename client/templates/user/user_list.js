//  https://themeteorchef.com/snippets/simple-search/#tmc-wiring-up-our-template-to-a-publication

Template.userList.onCreated( () => {
  // if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
  //   let template = Template.instance();

  //   template.searchQuery = new ReactiveVar();
  //   template.searching   = new ReactiveVar( false );

  //   template.autorun( () => {
  //     template.subscribe( 'albums', template.searchQuery.get(), () => {
  //       setTimeout( () => {
  //         template.searching.set( false );
  //       }, 300 );
  //     });
  //   });
  // }
});

Template.userList.helpers({
    'userListItems': function(){
        return Users.find();
    }
});

Template.userList.events({
  'click #user-list-item': function(event, template){
    event.preventDefault();
    Session.set('userToModify', this)
    Modal.show('modifyUserSubscriptionModal')
  },
  'click #export-emails': function(event, template){
    $( event.target ).button( 'loading' );
    Meteor.call('getAllUserEmails', function(error, response){
      if (error) {
        FlashMessages.sendError("Cannont find emails! " + error);
        $( event.target ).button( 'reset' );
      } else{
        fileName = 'UserEmails_' + moment().format('YYYYMMDD-HHmm') + '.csv'
        var dl = document.createElement('a');
        dl.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(response.toString()));
        dl.setAttribute('download', fileName);
        dl.click();
        $( event.target ).button( 'reset' );
      }
    });
  }
})