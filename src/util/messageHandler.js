import amqp from 'amqplib';

let conn, ch, uri;

const establishConnection = connString => {
  uri = connString;
  amqp.connect(uri, (err, connection) => {
    if (err) throw err;
    conn = connection;
  });
}

const createChannel = conn => {
  conn.createChannel((err, channel) => {
    if(err) throw err;

    channel.assertQueue(queue, {
      durable: false
    });

    ch = channel;
  });
};

const write = (msg, queue) => {
  if(!ch) createChannel(establishConnection(uri));
  ch.sendToQueue(queue, Buffer.from(msg));
};

const read = (handler, queue) => {
  if(!ch) createChannel(establishConnection(uri));
  ch.consume(queue, handler, { noAck: true });
};