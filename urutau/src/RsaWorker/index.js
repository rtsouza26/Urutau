import PromiseWorker from "promise-worker";
import Worker from 'worker-loader!./worker';

const promiseWorker  = new PromiseWorker(new Worker());

const send = (messageType,messageId,message) => promiseWorker.postMessage({
    type: messageType,
    Id:messageId,
    message
});

export default {
    send
}
