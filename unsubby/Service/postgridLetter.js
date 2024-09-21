import axios from "axios";
import FormData from "form-data";
import {  
    POSTGRID_KEY,
    ENV
} from "../../config.js";
import {
    PostGrid
} from 'postgrid-node-client'
const client = new PostGrid(POSTGRID_KEY);


export default class PostGridLetter {

    static pingenAuthKey = '';
    static baseURL = ENV == 'production' ? 'https://api.postgrid.com' : 'https://api.postgrid.com';


    static async sendLetter(company,companyAddress, content, orderId) {

        console.log("paraaaaaaaaa", company,companyAddress, content.downloadUrl, orderId)

        //companyAddress = "Planet Fitness,4 Liberty Ln W,Hamp ton new NH 03842,USA";
        const addressArray  = companyAddress.split(',') //[street , city attta stateCode postal(4), country]
        const companyName = addressArray[0];
        const addressArea=addressArray[addressArray.length-2].split(' '); //Street
        const companyCity=addressArea.length>3?addressArea.slice(0,addressArea.length-2).join(" "):addressArea[0];
        const provinceOrState = addressArea[addressArea.length-2]; //Statecode
        const postal = addressArea[addressArea.length-1]; //postal

        let countryCode = 'US';
        if(addressArray[addressArray.length-1].indexOf('United Kingdom')>-1){
            countryCode = 'GB';
        }

        let data = {
            description: `${company} ${orderId}`,
            pdf: content.downloadUrl,
            to: {
                //firstName: 'Steve',
                //lastName: 'Smith',
                companyName: addressArray[0],
                addressLine1: addressArray[1].trim(),
                city: companyCity.trim(),
                provinceOrState: provinceOrState,
                postalOrZip: postal,
                countryCode: countryCode,
                skipVerification:true,

            },
            from: {
                firstName: content.voornaam.split(' ')[0],
                lastName: content.voornaam.split(' ')[1],
                //companyName: 'US Steel',
                addressLine1: content.adres,
                city: content.woonplaats,
                //provinceOrState: 'GA',
                postalOrZip: content.postcode,
                countryCode: 'US',
                skipVerification:true,

            },
            addressPlacement : 'top_first_page'
        }

        if(addressArray.length>4){
            data.to.addressLine2 = addressArray[2]
        }

        const letter = await client.letter.create(data);
        return letter;        

    }

}