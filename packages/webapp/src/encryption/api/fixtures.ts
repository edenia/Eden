import { EncryptedData } from "encryption/interfaces";

export const fixtureEncryptedData: EncryptedData = {
    id: "0",
    keys: [
        {
            sender_key:
                "PUB_K1_7wmbaNsGvxBUg16UfqeiLvQ4zV2dh7NyirVDSxuGGT3W7LWDTy",
            recipient_key:
                "EOS7vz6S1LVdztSk7fViBzD2LP2TPvED5K49iDQskSzJ42i75Kg19",
            key: new Uint8Array([
                95, 99, 126, 234, 207, 56, 34, 6, 120, 243, 241, 87, 213, 204,
                6, 12, 136, 154, 255, 29, 186, 67, 245, 147,
            ]),
        },
        {
            sender_key:
                "PUB_K1_7wmbaNsGvxBUg16UfqeiLvQ4zV2dh7NyirVDSxuGGT3W7LWDTy",
            recipient_key:
                "EOS8S8oAAT5oa2idwX6e1ZDThQgzRTeXNZ2vpQfnCpxo5Z9sSamYg",
            key: new Uint8Array([
                95, 99, 126, 234, 207, 56, 34, 6, 120, 243, 241, 87, 213, 204,
                6, 12, 136, 154, 255, 29, 186, 67, 245, 147,
            ]),
        },
    ],
    data: new Uint8Array([
        222, 60, 130, 181, 135, 148, 255, 255, 180, 174, 81, 126, 253, 221, 206,
        198, 50, 164, 111, 52, 129, 156, 88, 74, 216, 95, 46, 105, 221, 168,
        149, 244, 106, 151, 98, 15, 89, 126, 42, 60, 8, 5, 223, 31, 212, 150,
        165, 201, 235, 172, 112, 45, 216, 146, 157, 219, 62, 126, 189, 242, 127,
        74, 199, 120, 56, 108, 141, 128, 202, 16, 156, 154, 189, 203, 29, 153,
        220, 182, 194, 162, 104, 2, 55, 253, 211, 2, 117, 89, 54, 187,
    ]),
};
