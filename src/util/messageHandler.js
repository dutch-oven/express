import amqp from 'amqplib';

let conn, ch, uri;

const establishConnection = async connString => {
  uri = connString;
  if(!conn) conn = await amqp.connect(uri);
  return conn;
}

const createChannel = async (connection, queue) => {
  if(!connection) await establishConnection(uri);
  if(!ch) ch = await conn.createChannel();
  ch.assertQueue(queue, {
    durable: false
  });
  return ch;
};

const write = async (queue, msg) => {
  if(!ch) await createChannel(establishConnection(uri), queue);
  ch.sendToQueue(queue, Buffer.from(msg));
};

const read = async (queue, handler) => {
  if(!ch) await createChannel(establishConnection(uri), queue);
  ch.consume(queue, handler, { noAck: true });
};

export default ({uri}) => {
  establishConnection(uri);
  return {
    read,
    write
  }
};
