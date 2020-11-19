const mongoose = require('mongoose');
const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI;

mongoose
  .connect(MONGO_ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    console.log(`Successfully connected to the database ${MONGO_ATLAS_URI}`)
  )
  .catch((error) => {
    console.error(
      `An error ocurred trying to connect to the database ${MONGO_ATLAS_URI}: `,
      error
    );
    process.exit(1);
  });
