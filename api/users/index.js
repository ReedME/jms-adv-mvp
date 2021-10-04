// Load mongoose
const mongoose = require("mongoose");
// Connect to the database
mongoose.connect(
  process.env.CONNECTION_STRING, // Retrieve connection string
  {
    // boiler plate values
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Create the schema or structure of our object in Mongoose
const userSchema = new mongoose.Schema({
  userId: String,
  userData: {
    businessPhones: Array,
    givenName: String,
    surname: String,
    userPrincipalName: String,
    displayName: String,
    id: String,
    jobTitle: String,
    mail: String,
    mobilePhone: String,
    officeLocation: String,
  },
});

// Create a model using our schema
// This model will be used to access the database
const UserModel = mongoose.model("user", userSchema);
console.log(UserModel);

// Export our function
module.exports = async function (context, req) {
  // setup our default content type (we always return JSON)
  context.res = {
    header: {
      "Content-Type": "application/json",
    },
  };

  // Read the method and determine the requested action
  switch (req.method) {
    // If get, return all tasks
    case "GET":
      await getUser(context);
      break;
    // If post, create new task
    case "POST":
      await createUser(context);
      break;
    /* // If put, update task
        case 'PUT':
            await updateTask(context);
            break;
    */
  }
};

// Return user with supplied UID
async function getUser(context) {
  console.log(context);
  // load user found from database
  const user = await UserModel.find({ userId: context.bindingData.id });
  // return user
  context.res.body = { user: user };
}

// Create new User
async function createUser(context) {
  // Read the uploaded user
  const body = context.req.body;
  // Save to database
  const user = await UserModel.create(body);
  // Set the HTTP status to created
  context.res.status = 201;
  // return new object
  context.res.body = user;
}
/*
// Update an existing function
async function updateTask(context) {
    // Grab the id from the URL (stored in bindingData)
    const id = context.bindingData.id;
    // Get the task from the body
    const task = context.req.body;
    // Update the item in the database
    const result = await TaskModel.updateOne({ _id: id }, task);
    // Check to ensure an item was modified
    if (result.nModified === 1) {
        // Updated an item, status 204 (empty update)
        context.res.status = 204;
    } else {
        // Item not found, status 404
        context.res.status = 404;
    }
}
    */
