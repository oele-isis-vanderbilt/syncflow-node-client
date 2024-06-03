'use-strict';

export class SyncFlowClient {
  serverUrl: string;
  apiKey: string;
  apiSecret: string;

  constructor(serverUrl: string, apiKey: string, apiSecret: string) {
    this.serverUrl = serverUrl;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  //ToDos
  async createRoom() {}

  async deleteRoom() {}

  async getLivekitServerHealth() {}

  async listEgresses() {}

  async listParticipants() {}

  async listRooms() {}

  async beginTrackEgress() {}

  async generateLivekitToken() {}
}

export class SyncFlowClientBuilder {
  private serverUrl: string;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.serverUrl = process.env.SYNCFLOW_SERVER_URL || '';
    this.apiKey = process.env.SYNCFLOW_API_KEY || '';
    this.apiSecret = process.env.SYNCFLOW_API_SECRET || '';
  }

  setServerUrl(serverUrl: string): SyncFlowClientBuilder {
    this.serverUrl = serverUrl;
    return this;
  }

  setApiKey(apiKey: string): SyncFlowClientBuilder {
    this.apiKey = apiKey;
    return this;
  }

  setApiSecret(apiSecret: string): SyncFlowClientBuilder {
    this.apiSecret = apiSecret;
    return this;
  }

  build(): SyncFlowClient {
    if (!this.serverUrl) {
      throw new Error('Server URL is required');
    }
    if (!this.apiKey) {
      throw new Error('API Key is required');
    }
    if (!this.apiSecret) {
      throw new Error('API Secret is required');
    }

    return new SyncFlowClient(this.serverUrl, this.apiKey, this.apiSecret);
  }
}
