import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class SocketioService {
    socket;

    constructor() {
        this.connect();
    }

    /**
     * Connect to a socket.io instance
     */
    connect() {
        this.socket = io(environment.apiUrl);
    }

    /**
     * Listen to a socket
     * 
     * @param emitter socket emitter name
     * @param callback callback method
     */
    listen(emitter: string, callback: any) {
        this.socket.on(emitter, (data) => {
            callback(data);
        })
    }

    /**
     * Send a message to a socket
     * 
     * @param emitter socket emitter name
     * @param data data to send
     */
    send(emitter: string, data:any) {
        this.socket.emit(emitter, data);
    }
}