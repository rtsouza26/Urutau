import Crypt from 'node-jsencrypt'

export default class Rsa_Crypt{

    constructor(){
        if(Rsa_Crypt.exists){
            return Rsa_Crypt.instance;
        }
        Rsa_Crypt.instance = this;
        Rsa_Crypt.exists = true;
        this._crypt=null;
        this._privateKey = null;
        this._publicKey = null;
        return this;

    }

    getCrypt() {
        return this._crypt;
    }

    getPrivateKey() {
        return this._privateKey;
    }

    getPublicKey() {
        return this._publicKey;
    }

    seTcrypt(value) {
        this._crypt = value;
    }

    setPrivateKey(value) {
        this._privateKey = value;
    }

    setPublicKey(value) {
        this._publicKey = value;
    }

    onmessage(e){
        const[ messageType, messageId, text, key] = e.data;
        let result;
        switch (messageType) {
            case 'generate-keys':
                result = this.generateKeypair();
                break;
            case 'encrypt':
                result = this.encrypt(text,key);
                break;
            case 'decrypt':
                result = this.decrypt(text);
                break;
        }
        self.postMessage([messageId,result]);
    }
    generateKeypair () {
        this.seTcrypt(new Crypt({default_key_size: 2056}));
        this.setPrivateKey(this.getCrypt().getPrivateKey());

        // Only return the public key, keep the private key hidden
        this.setPublicKey(this.getCrypt().getPublicKey());
        return this.getPublicKey();
    }
    encrypt(content){
        this.crypt.setKey(this.publicKey);
        return this.crypt.encrypt(content);
    }
    decrypt (content) {
        this.crypt.setKey(this.privateKey);
        return this.crypt.decrypt(content);
    }

}

