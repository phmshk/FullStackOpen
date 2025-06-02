const app = require("./app");
const { PORT } = require("./utils/config");
const { logInfo } = require("./utils/logger");

app.listen(PORT, () => {
  logInfo(`Server running on port ${PORT}`);
});
