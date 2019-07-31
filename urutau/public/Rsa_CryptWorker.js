import Rsa_Crypt from "../src/RsaWorker/Rsa_Crypt";

onmessage = function(e){
    let crypt = new Rsa_Crypt();
    const[ messageType, messageId, text, key] = e.data;
    let result;
    switch (messageType) {
        case 'generate-keys':
            result = crypt.generateKeypair();
            break;
        case 'encrypt':
            result = crypt.encrypt(text,key);
            break;
        case 'decrypt':
            result = crypt.decrypt(text);
            break;
    }
    postMessage([messageId , result]);
};

