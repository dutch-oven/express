import rabbot from  'rabbot';

export default async ({host, user, pass, port, vhost}) => {

  return await rabbot.configure({
    connection: {
      name: 'default',
      host,
      user,
      pass,
      port,
      vhost,
      replyQueue: 'customReplyQueue'
    }
  })
};