class ServiceRegistry {
  constructor(log){
    this.log = log;
    this.service = {};
    this.timeout = 30;
  }

  register(name, version, ip, port) {
    const key = name + version + ip + port;

    if (!this.serices[key]) {
      this.services[key] = {};
      this.services[key].timestamp = Math.floor(new Date() / 1000);
      this.services[key].ip = ip;
      this.services[key].port = port;
      this.services[key].name = name;
      this.services[key].version = version;
      this.log.debug(`Added service ${name}, version ${version}, at ${ip}:${port}`);
      return key;
    }
    this.services[key].timestamp = Math.floor(new Date() / 1000);
    this.log.debug(`Updated service ${name}, version ${version}, at ${ip}:${port}`);
    return key;
  }
}

module.exports = ServiceRegistry;
