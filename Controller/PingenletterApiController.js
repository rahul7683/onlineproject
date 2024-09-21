import axios from "axios";
import FormData from "form-data";
import { PINGEN_CLIENT_ID, PINGEN_CLIENT_SECRET,PINGEN_ORGANIZATION_ID } from "../config.js";
export const getAuthkey = async () => {
  let data = new FormData();
  data.append("grant_type", "client_credentials");
  data.append("client_id", PINGEN_CLIENT_ID);
  data.append("client_secret", PINGEN_CLIENT_SECRET);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://identity.pingen.com/auth/access-tokens",
    headers: {
      Cookie:
        "4c70be817f600537d4e6e085864838e7=ae408327cf676efdad3ba079e51c0e80",
      ...data.getHeaders(),
    },
    data: data,
  };
  try {
    let token = await axios.request(config);
    if (token?.data) {
        return "Bearer " + token?.data?.access_token;  
    }
  } catch (err) {
    console.log(err);
  }
};


export const getUploadFile=async(Authkey)=>{
    let data = new FormData();
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://api.v2.pingen.com/file-upload',
      headers: { 
        'Accept': 'application/vnd.api+json', 
        'Authorization': Authkey
      },
      data : data
    };   
    try{
       let fileUpload=await axios.request(config)
       if(fileUpload?.data){
            console.log(fileUpload?.data?.data?.attributes);
        return fileUpload?.data?.data?.attributes
       }
    }catch(err){
        console.log(err)
    }
}

const PutUploadFile=async(url,fileContent)=>{
let data = fileContent
let config = {
  method: 'put',
  maxBodyLength: Infinity,
  url:url,
  headers: { 
    'Content-Type': 'text/plain'
  },
  data : data
};

await axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
}


export const sendLetterApi=async(company,content,orderId)=>{
  // const {}=req
  // console.log(req)
  let Authkey=await getAuthkey()
  let getFileUploadUrl= await getUploadFile(Authkey)
  console.log("file reponse--------------------------")
  let putFile= await PutUploadFile(getFileUploadUrl?.url,content)
    let data = JSON.stringify({
      "data": {
        "type": "letters",
        "attributes": {
          "file_original_name": `${company}-${orderId}-letter.pdf`,
          "file_url":getFileUploadUrl?.url,
          "file_url_signature":getFileUploadUrl.url_signature,
          "address_position": "left",
          "auto_send":true,
          "delivery_product":"fast",
          "print_mode":"simplex",
          "print_spectrum":"grayscale"
        }
      }
    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.v2.pingen.com/organisations/15c76764-84db-496c-8f93-fd948be7d844/letters',
      headers: { 
        'Content-Type': 'application/vnd.api+json', 
        'Accept': 'application/vnd.api+json', 
        'Authorization': Authkey
      },
      data : data
    };
    
   return axios.request(config)  
}
export const getLetterApi=async(letterId)=>{
  let Authkey=await getAuthkey()
  console.log("file reponse--------------------------")
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.pingen.com/organisations/15c76764-84db-496c-8f93-fd948be7d844/letters/${letterId}`,
      headers: { 
        'Content-Type': 'application/vnd.api+json', 
        'Accept': 'application/vnd.api+json', 
        'Authorization': Authkey
      },
    };
    
   return axios.request(config)  
}

