import {createClient} from 'redis';
import util from 'util';

const {promisify} = util;

export default ({url}) => {
    const client = createClient(url);
    const hgetall = promisify(client.hgetall).bind(client);
    const hget = promisify(client.hget).bind(client);
    return {
        get: (hash, id) => id ? hget(hash, id) : hgetall(hash)
    }
}