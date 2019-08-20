import amqp from 'amqplib';

let conn, ch, uri;

// const defer = (callback, {timeout} = {timeout: 500}) => {
//   let id;
//   return (...args) => {
//     if(id) clearTimeout(id);
//     id = setTimeout(() => callback(...args), timeout);
//   }
// }

// const close = defer(() => {
//   conn.close();
//   conn = undefined;
//   ch = undefined;
// }, {timeout: 5000});

const establishConnection = async connString => {
  uri = connString;
  if(!conn) conn = await amqp.connect(uri);
  // close();
  return conn;
}

const createChannel = async (connection, queue) => {
  if(!connection) await establishConnection(uri);
  if(!ch) ch = await conn.createChannel();
  ch.assertQueue(queue, {
    durable: false
  });
  // close();
  return ch;
};

const write = async (queue, msg) => {
  if(!ch) await createChannel(establishConnection(uri), queue);
  ch.sendToQueue(queue, Buffer.from(msg));
  // close();
};

const read = async (queue, handler) => {
  if(!ch) await createChannel(establishConnection(uri), queue);
  ch.consume(queue, handler, { noAck: true });
  // close();
};

export default ({uri}) => {
  establishConnection(uri);
  return {
    read,
    write
  }
};
