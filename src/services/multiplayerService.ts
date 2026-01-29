import { GameMessage } from '../types';

const CHANNEL = 'gemini_quiz_room';

export class MultiplayerService {
  private channel = new BroadcastChannel(CHANNEL);

  constructor(private onMessage: (msg: GameMessage) => void) {
    this.channel.onmessage = (e) => {
      if (e.data) this.onMessage(e.data as GameMessage);
    };
  }

  sendMessage(msg: GameMessage) {
    this.channel.postMessage(msg);
  }

  close() {
    this.channel.close();
  }
}
