import axios from "axios";
import FormData from "form-data";
import {
    MY_SENDING_BOX_KEY,
    ENV
} from "../../config.js";



export default class MySendingBoxLetter {

    static pingenAuthKey = '';
    static baseURL = ENV == 'production' ? 'https://api.mysendingbox.fr' : 'https://api.mysendingbox.fr';

    static async sendLetter(company, downloadUrl, orderId) {

        // if(!PingenLetter.pingenAuthKey){
        //     await PingenLetter.getAuthkey();
        // }
        //extract address from company address
        // const address = "MoreFit,Grazerstraße 12,8280 Fürstenfeld,Österreich";
        // const addressArray = address.split(',');
        // companyName = addressArray[0];
        // postal = addressArray[addressArray.length - 1].split(' ')[0]
        // city = addressArray[addressArray.length - 1].split(' ')[1]
        const data = {
            "description": company + " " + orderId,
            "color": "bw",
            "postage_type": "prioritaire",
            "postage_speed": "D1",
            "read_address_from_pdf": {
                "active": true,
                "x": 61.64813232421875,
                "y": 165.1666488647461,
                "width": 272.99999999999994,
                "height": 80.99999999999999
            },
            // "to": {
            //     "name": "Streamz",
            //     "address_line1": "Medialaan 38",
            //     "address_line2": "Medialaan 38",
            //     "address_city": "Paris",
            //     "address_postalcode": "75015",
            //     "address_country": "France"
            // },
            "metadata": {
                "orderId": orderId
            },
            "source_file": downloadUrl,
            "source_file_type": "remote"

        };

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${MySendingBoxLetter.baseURL}/letters`,
            headers: {
                'Content-Type': 'application/json'
            },
            auth: {
                username: MY_SENDING_BOX_KEY
            },
            data: data
        };

        return axios.request(config);

    }


    static async getLetters() {
        let config = {
            method: 'get',
            url: `${MySendingBoxLetter.baseURL}/letters`,
            headers: {
                'Content-Type': 'application/json'                
            },
            auth: {
                username: MY_SENDING_BOX_KEY
            }
        };

        return axios.request(config);

    }

}