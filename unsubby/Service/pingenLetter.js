import axios from "axios";
import FormData from "form-data";
import {
    PINGEN_CLIENT_ID,
    PINGEN_CLIENT_SECRET,
    ENV, 
    PINGEN_ORGANIZATION_ID
} from "../../config.js";


export default class PingenLetter {

	static pingenAuthKey = '';
    static baseURL = ENV == 'production' ? 'https://api.pingen.com' : 'https://api-staging.pingen.com';
    static async getAuthkey() {
        let data = new FormData();
        data.append("grant_type", "client_credentials");
        data.append("client_id", PINGEN_CLIENT_ID);
        data.append("client_secret", PINGEN_CLIENT_SECRET);
        const accessURL = ENV == 'production' ? 'https://identity.pingen.com/auth/access-tokens' : 'https://identity-staging.pingen.com/auth/access-tokens';

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: accessURL,
            headers: {
                Cookie: "4c70be817f600537d4e6e085864838e7=ae408327cf676efdad3ba079e51c0e80",
                ...data.getHeaders(),
            },
            data: data,
        };
        try {
            let token = await axios.request(config);
            if (token ?.data) {
                PingenLetter.pingenAuthKey = "Bearer " + token ?.data ?.access_token;
            }
        } catch (err) {
            console.log('Error in pingen getAuthkey', err);
        }

    }


    static async sendLetter(company,content,orderId) {

    	if(!PingenLetter.pingenAuthKey){
    		await PingenLetter.getAuthkey();
    	}
        
        let getFileUploadUrl = await PingenLetter.getUploadFile(PingenLetter.pingenAuthKey);
        if(!getFileUploadUrl){
            await PingenLetter.getAuthkey();
            getFileUploadUrl = await PingenLetter.getUploadFile(PingenLetter.pingenAuthKey);
        }
        console.log("file reponse--------------------------")
        let putFile = await PingenLetter.putUploadFile(getFileUploadUrl?.url, content)
        let data = JSON.stringify({
            "data": {
                "type": "letters",
                "attributes": {
                    "file_original_name": `${company}-${orderId}-letter.pdf`,
                    "file_url": getFileUploadUrl ?.url,
                    "file_url_signature": getFileUploadUrl.url_signature,
                    "address_position": "left",
                    "auto_send": true,
                    "delivery_product": "fast",
                    "print_mode": "simplex",
                    "print_spectrum": "grayscale"
                }
            }
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${PingenLetter.baseURL}/organisations/${PINGEN_ORGANIZATION_ID}/letters`,
            headers: {
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json',
                'Authorization': PingenLetter.pingenAuthKey
            },
            data: data
        };

        return axios.request(config);

    }


    static async getUploadFile(Authkey) {
        let data = new FormData();
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${PingenLetter.baseURL}/file-upload`,
            headers: {
                'Accept': 'application/vnd.api+json',
                'Authorization': Authkey
            },
            data: data
        };
        try {
            let fileUpload = await axios.request(config)
            if (fileUpload ?.data) {
                console.log(fileUpload ?.data ?.data ?.attributes);
                return fileUpload ?.data ?.data ?.attributes
            }
        } catch (err) {
            console.log(err)
        }
    }

    static async putUploadFile(url, fileContent) {
        let data = fileContent
        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'Content-Type': 'text/plain'
            },
            data: data
        };

        await axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
    }

}