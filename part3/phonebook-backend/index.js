const app = require("./app");
const { logInfo } = require("./utils/logger");
const config = require("./utils/config");

app.listen(config.PORT || 3001, () => {
  logInfo(`Server running on port ${config.PORT}`);
});
