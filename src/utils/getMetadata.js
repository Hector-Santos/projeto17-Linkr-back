import urlMetadata from "url-metadata";

async function getMetadata(url){

     const metadata = await urlMetadata(url);
     return metadata;

 };

 export default getMetadata;