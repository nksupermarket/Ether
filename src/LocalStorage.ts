const LocalStorage = {
  getAll: function () {
    const config = JSON.parse(JSON.stringify(localStorage));
    for (const key of Object.keys(config)) {
      config[key] = JSON.parse(config[key]);
    }
    return config;
  },
  format: function () {
    return JSON.stringify(this.getAll(), null, 2);
  },
};
export default LocalStorage;
