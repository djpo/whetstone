goal: {
  name: String,
  content_type: String,
  frequency: Number,
  duration: Number,
  publish: String,
  members: Array,
  timing: {
    is_active: Boolean,
    start_date: Date,
    end_date: Date,
    current_week: Number
  },
  all_submissions: [
    /* week 1: */ [
                    /* user 1: */ [submissions],
                    // ...
                    /* user 4: */ [submissions]
                  ],
    // ...
    /* week 12: */ [
                    /* user 1: */ [submissions],
                    // ...
                    /* user 4: */ [submissions]
                   ]
  ]
}

submission: {
  user_id: String,
  content: {
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: {type: String, require: true, unique: true},
    path: String,
    size: Number
  }
}

user: {
  username        : String,
  email           : { type: String, required: true, unique: true },
  activeGoal      : String,
  submitted_today : Boolean
}