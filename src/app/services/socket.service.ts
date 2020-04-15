import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';

export class SocketioService {
    socket;

    constructor() {}

    connect() {
        this.socket = io(environment.apiUrl);
    }
}