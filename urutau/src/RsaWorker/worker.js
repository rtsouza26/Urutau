import registerPromiseWorker from "promise-worker/register";
import Rsa_Crypt from "./Rsa_Crypt";
let crypt = new Rsa_Crypt();
registerPromiseWorker((message)=>{
    switch (message.type) {
        case 'generate-keys':
            return crypt.generateKeypair();
            break;
    }
});
