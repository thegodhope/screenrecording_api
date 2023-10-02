import { app, PORT } from "./config/app_config.js";
//import connectDB from "./config/db_config.js";

const main = async () => {
  try {
    // connectDB();
    app.listen(PORT, () => {
      console.log(`Server is up and running at port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
