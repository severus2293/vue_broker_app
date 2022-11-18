import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import {Server, Socket} from "socket.io";
import brokers from "../json_files/brokers.json";
import path from "path";
import stocks from "../json_files/stocks.json";
import fs from "fs";
import stocks_info from "../json_files/stocks_info.json";
import settings from "../json_files/settings.json";
import {clearInterval} from "timers";

@WebSocketGateway(80,{

  cors: {
    origin: '*',
  },
  namespace: 'bargainsocket',
})
export class BargainGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
  @SubscribeMessage('changeParticipationStocks')
  ChangeParticipationStocks(client: Socket, body): void {
    const __dirname = path.resolve() + '/src/json_files';
    for (let i = 0; i < stocks.length; i++) {
      if (stocks[i].id === parseInt(body.id)) {
        stocks[i].participation = !stocks[i].participation
        break;
      }
    }
    fs.writeFileSync(__dirname + '/stocks.json', JSON.stringify(stocks));
    const res = [];
    for (let i = 0; i < stocks.length; i++) {
      if (stocks[i].participation) {
        res.push({ data: stocks[i], info: stocks_info[i] });
      }
    }
    this.server.emit('BargainStocks', res);
  }
  @SubscribeMessage('start_bargaing')
  StartBargaing(client: Socket, body): void {   // передать что клиент зашёл в аккаунт
    var timer
    if(body.process === true){
      var time = settings.speed
      var cur_day = ''+ settings.start.split('-')[1] +'/'+ settings.start.split('-')[2] + '/'+ settings.start.split('-')[0]
      var end = ''+ settings.end.split('-')[1] +'/'+ settings.end.split('-')[2] + '/'+ settings.end.split('-')[0]
      timer = setInterval(() => {
        if(cur_day === end){
          clearInterval(timer)
        }
        if (time > 0) {
          time -= 1;
          console.log(time);
          console.log('i am here')
          const message = {
            speed: time,
            date: cur_day
          }
          this.server.emit('ChangeTime',message)
        } else {
          time = settings.speed
          let day = new Date(cur_day);
          const offset = day.getTimezoneOffset();
          day = new Date(day.getTime() - offset * 60 * 1000);
          day.setDate(day.getDate() + 1);
          const tmp = day.toISOString().split('T')[0].split('-');
          cur_day = '' + tmp[1] + '/' + tmp[2] + '/' + tmp[0];
          const message = {
            speed: time,
            date: cur_day
          }
          this.server.emit('ChangeTime',message)
        }
      }, 1000);
    }
  }
  afterInit(server: Server) {
    //this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    // this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    //this.logger.log(`Client connected: ${client.id}`);
    // console.log('connect...' + client.id);
    this.server.emit('authorization_status', brokers); // при заходе на авторизацию показать какой профиль свободен
  }
}
