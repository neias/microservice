const axios = require('axios');

class CircuitBreaker {

  constructor() {
    this.state = {};
    this.failureThreshold = 5;
    this.cooldownPeriod = 10;
    this.requestTimeout = 1;
  }

  async callService(requestOptions){
    const endpoint = `${requestOptions.method}:${requestOptions.url}`;

    if (!this.canRequest(endpoint)) return false;

    requestOptions.timeout = this.requestTimeout * 1000;

    try{
      const response = await axios(requestOptions);
      this.onSuccess(endpoint);
      return response.data;
    } catch(err){
      this.onFailure(endpoint);
      return false;
    }
  }

  onSuccess(endpoint){
    this.iniState(endpoint);
  }

  onFailure(endpoint){
    const state = this.state[endpoint];
    state.failures += 1;
    if(state.failures > this.failureThreshold){
      state.circuit = 'OPEN';
      state.nextTry = new Date() / 1000 + this.cooldownPeriod;
      console.log(`ALERT! Circuit for ${endpoint} is in state 'OPEN'`);
    }
  }

  canRequest(endpoint){
    if (!this.states[endpoint]) this.iniState(endpoint);
    const state = this.state[endpoint];
    if (state.circuit === 'CLOSED') return true;
    const now = new Date() / 1000;
    if (state.nextTry <= now) {
      state.circuit = 'HALF';
      return true;
    }
    return false;
  }

  initState(endpoint) {
    this.state[endpoint] = {
      failures: 0,
      cooldownPeriod: this.cooldownPeriod,
      circuit: 'CLOSED',
      nextTry: 0,
    };
  }

}

module.exports = CircuitBreaker
