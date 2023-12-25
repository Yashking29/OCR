const vision = require('@google-cloud/vision');
const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const path = require('path');

require('dotenv').config();







const client = new vision.ImageAnnotatorClient({
    credentials: {
        private_key: process.env.GOOGLE_CREDENTIALS.private_key,
        client_email: process.env.GOOGLE_CREDENTIALS.client_email
    }
});

const fileName = 'uploads/j1.jpg';
let ename=''; 
let elname='';
let edb='';
let id='';

const extractInformation = async (fileName) => {
    try {
        const [result] = await client.textDetection(fileName);
        const detections = result.textAnnotations;

        let ename='';
        let elname='';
        let edb='';
        let id='';

        const t=detections[0].description;
        console.log(t);
        const nameRegex = /Name \s*([^,\n]+)/i;
        const lastnameRegex = /Last name \s*([^,\n]+)/i;
        const dbRegex = /Date of Birth \s*([^,\n]+)/i;
        const idRegex = /\b\d{1,2} \d{4} \d{5} \d{2} \d{1}\b/;
        const dateRegex = /(?:Date of Issue[^\n]*\n\s*)(\b\d{1,2} [a-zA-Z]+\.? \d{4}\b)/;


        const match = t.match(nameRegex);
        const extractedName = match ? match[1].trim() : null;
        ename=extractedName;

        const lmatch = t.match(lastnameRegex);
        const lextractedName = lmatch ? lmatch[1].trim() : null;
        elname=lextractedName;

        const dbmatch = t.match(dbRegex);
        const dbextractedName = dbmatch ? dbmatch[1].trim() : null;
        edb=dbextractedName ;


        const idmatch = t.match(idRegex);
        const idextractedName = idmatch[0];
        id=idextractedName;

     
        console.log('Extracted Name:', extractedName);
        console.log('Extracted last name:', lextractedName);
        console.log('Extracted date of birth:', dbextractedName);
        console.log('Extracted Id:', idextractedName);
        console.log('Extracted date of issue:', dateextractedName);

            

          
    } catch (error) {
        console.error('Error during text detection:', error);
    }
};

// Helper function to extract values from text
const extractValue = (text) => {
    const startIndex = text.indexOf(':') + 1;
    return text.substring(startIndex).trim();
};




router.get('/', (req, res) => {
    // Replace this with the logic to retrieve the data you want to send
    const dataToSend = { Name: ename, LastName: elname, DateBirth:edb, ID:id };
    res.json(dataToSend);
  });
  


  module.exports = {
     extractInformation
  };












