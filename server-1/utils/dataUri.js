import DataUriParser from 'datauri/parser';
import path from 'path';

const getDataUri=(file)=>{
    const parser=new DataUriParser()

    const extname=path.extname(file.originalname).toString()

    return parser.format(extname,file.buffer).content
}


export default getDataUr;
