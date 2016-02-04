goal: {
  name: String,
  content_type: String,
  frequency: Number,
  duration: Number,
  publish: String,
  members: Array,
  is_active: Boolean,
  start_date: Date,
  end_date: Date,
  current_week: Number,
  subs: {
    user_id [
      // week 0 submissions
      [sub_0, sub_1],
      // week 0 submissions
      [sub_0, sub_1]
    ]
  }
}

submission: {
  user_id     : String,
  created_at  : Date,
  content     : {
    fieldname   : String,
    originalname: String,
    encoding    : String,
    mimetype    : String,
    destination : String,
    filename    : {type: String, require: true, unique: true},
    path        : String,
    size        : Number
  }
}

user: {
  username        : String,
  email           : { type: String, required: true, unique: true },
  activeGoal      : String,
  submitted_today : Boolean
}