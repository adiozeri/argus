const fs = require("fs");
const crypto = require("crypto");

class FileUtils {

    constructor(filePath, password) {
        this.filePath = filePath;
        this.password = password;
    }

    encryptAsync(data) {
        return new Promise((resolve, reject) => {
            try {
                var cipher = crypto.createCipher('aes-256-cbc', this.password);
                var encrypted = Buffer.concat([cipher.update(new Buffer(JSON.stringify(data), "utf8")), cipher.final()]);
            } catch (exception) {
                reject({ message: exception.message });
            }
            fs.writeFile(this.filePath, encrypted, error => {
                if(error) {
                    reject(error)
                }
                resolve({ message: "Encrypted" });
            });
        });
    }

    decryptAsync() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.filePath, (error, data) => {
                if(error) {
                    reject(error);
                }
                try {
                    var decipher = crypto.createDecipher("aes-256-cbc", this.password);
                    var decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
                    resolve(JSON.parse(decrypted.toString()));
                } catch (exception) {
                    reject({ message: exception.message });
                }
            });
        });
    }
}

exports.FileUtils = FileUtils;