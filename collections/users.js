// Users.findOne({"emails.address": "test@b.c"})
Users = Meteor.users; // this just allows to type Users.find() instead of Meteor.users.find();

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Allow / deny rules
//////////////////////////////////////////////////////////////////////////////////////////////////////

var blacklist = ["createdAt", "_id"]; // maybe "heartbeat"
var subscriptionFields = ["subscriptionType","remainingEntries","endOfSubscription"];

Users.allow({
  insert: function (userId, doc, fields, modifier) {
      return !Meteor.userId();
  },
  update: function (userId, doc, fieldNames, modifier) {
    console.log("in update function, modifier: " + modifier + " fieldNames: " + fieldNames)
    if ( !(isOwner(userId,doc) || Roles.userIsInRole(userId, "admin") )) {
      return false;
    }
    if (editBlacklistField(fieldNames, blacklist)) {
      return false;
    }
    if (editSubscriptionField(fieldNames, subscriptionFields)) {
      return false;
    }
    return true
  },
  remove: function(userId, doc){
    return false
  }
});

// //////////////////////////////////////////////////////////////////////////////////////////////////////
// // Functions
// //////////////////////////////////////////////////////////////////////////////////////////////////////

function isOwner(userId, doc){
  if (userId && doc._id === userId) {
    return true
  }
};

function editBlacklistField(fieldNames, blacklist){
  _.contains(_.map(fieldNames,function(f){return _.contains(blacklist,f)}), true)
};

function editSubscriptionField(fieldNames, subscriptionFields){
  _.contains(_.map(fieldNames,function(f){return _.contains(subscriptionFields,f)}), true)
};

function checkAdmin(userId){
  if ( this.isSet && this.isUpdate &&  !Roles.userIsInRole(userId, "admin") ) {
    return "unauthorized";
  }
};

Meteor.methods({
  'updatePassword' : function(doc) {
    check(doc, Schema.updatePasswordSchema);
    if (doc.password === doc.passwordConfirmation && Meteor.user()){
      Accounts.setPassword(Meteor.userId(), doc.password)
    }
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Schema
//////////////////////////////////////////////////////////////////////////////////////////////////////

Schema = {};

// note the subscription form has its own schema (below)
Schema.UserProfile = new SimpleSchema({
  firstName: {
    type: String,
    label: "First Name",
    min: 1,
    optional: false,
  },
  lastName: {
    type: String,
    min: 1,
    label: "Last Name",
    optional: false,
  },
  birthday: {
    type: Date,
    label: "Birthday",
    autoform: {type: "bootstrap-datepicker"},
    optional: true,
  }
});

Schema.UserSubscription = new SimpleSchema({
  subscriptionType: {
    type: String,
    label: "Subscription Type",
    optional: false,
    allowedValues: ["Single Entries", "Subscription"],
    optional: true,
    custom: function() { checkAdmin() }
  },
  startOfSubscription: {
    type: Date,
    min: moment().add(-14, 'months').toDate(),
    max: moment().add(14, 'months').toDate(),
    defaultValue: moment().toDate(),
    optional: false,
    autoform: {type: "bootstrap-datepicker"},
    custom: function() { checkAdmin() }
  },
  endOfSubscription: {
    type: Date,
    min: moment().toDate(),
    max: moment().add(14, 'months').toDate(),
    defaultValue: moment().toDate(),
    optional: false,
    autoform: {type: "bootstrap-datepicker"},
    custom: function() { checkAdmin() }
  },
  additionalEntries: {
    type: Number,
    label: 'Number of additional entries',
    autoValue: function(){return 0},
    optional: true,
    custom: function() { checkAdmin() }
  }
});
Schema.UserSubscription.messages({
   "unauthorized" : "You do not have permission to update this field"
})

Schema.User = new SimpleSchema({
  emails: {
    type: Array,
    optional: false
  },
  "emails.$": {
    type: Object
  },
  "emails.$.address": {
    type: String,
    label: "Email address",
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean,
    defaultValue: false, 
    optional: true
  },
  createdAt: {
    type: Date
  },
  profile: {
    type: Schema.UserProfile,
    optional: true
  },
  subscription: {
    type: Schema.UserSubscription,
    optional: false
  },
  // Make sure this services field is in your schema if you're using any of the accounts packages
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  // Add `roles` to your schema if you use the meteor-roles package.
  // Option 1: Object type
  // If you specify that type as Object, you must also specify the
  // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
  // Example:
  // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
  // You can't mix and match adding with and without a group since
  // you will fail validation in some cases.
  // roles: {
  //     type: Object,
  //     optional: true,
  //     blackbox: true
  // },
  // Option 2: [String] type
  // If you are sure you will never need to use role groups, then
  // you can specify [String] as the type
  roles: {
    type: Array,
    optional: true
  },
  'roles.$': {
    type: String
  },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true
  }
});

Meteor.users.attachSchema(Schema.User);

Schema.createUserFormSchema = new SimpleSchema({
  firstName: {
      type: String,
      label: "First Name",
      optional: false,
      min: 2,
      // regEx: /^[a-z0-9A-Z_]{3,15}$/
  },
  lastName: {
      type: String,
      label: "Last Name",
      optional: false,
      min: 2,
      // regEx: /^[a-z0-9A-Z_]{3,15}$/
  },
  email: {
      type: String,
      label: "Email address",
      optional: false,
      regEx: SimpleSchema.RegEx.Email
  },
  password: {
    type: String,
    label: "Password",
    min: 6,
    autoform: {
      type: "password"
    }
  },
  passwordConfirmation: {
    type: String,
    min: 6,
    label: "Password confirmation",
    autoform: {
      type: "password"
    },
    custom: function() {
      if (this.value !== this.field('password').value) {
        return ("passwordMissmatch");
      }
    }
  }
});
Schema.createUserFormSchema.messages({
  "passwordMissmatch": "Passwords do not match"
});

Users.before.insert(function (userId, doc) {
  doc.subscription.subscriptionType = "Single Entries"
});