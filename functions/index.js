const functions = require('firebase-functions');
const admin = require('firebase-admin');
let FieldValue = require('firebase-admin').firestore.FieldValue;
const axios = require('axios');
admin.initializeApp();

const db = admin.firestore();
const express = require('express');
const app = express();
const mercadopago = require('mercadopago');

mercadopago.configure({
    sandbox: true,
    access_token: 'APP_USR-5546533367160765-050618-71ff81153356a8fdfadd20a6b59d2edb-1119276512'
});

exports.createPreferenceForOrder = functions.firestore
    .document('PagoCamionero/{PagoCamioneroId}')
    .onCreate(async (snap, _context) =>  {
      const data = snap.data();
      let preference = {
          items: [
              {
                  title: data.name,
                  quantity: 1,
                  currency_id: "MXN",
                  unit_price: data.numeroPago,
                  
              }
          ],
          payer: {
              email: data.email
          },
          external_reference: `${data.idPago}`,
      };

      let response = await mercadopago.preferences.create(preference);
      let preferenceId = response.body.id;

      snap.ref.set({"preference_id": preferenceId}, {merge: true});
      
    });



      exports.getWebhookMPer = functions.https.onRequest(async (req, res) => {
        console.log('POST Sended from MP to Cloud Function:', req.body);
      
        // Grab the text parameter.
        let id = req.body.id;
        let live_mode = req.body.live_mode;
        let type = req.body.type;
        let date_created = req.body.date_created;
        let idPayment = req.body.data.id;
        let user_id = req.body.user_id;
        let version = req.body.version;
        let api_version = req.body.api_version;
        let action = req.body.action;
        var random =Math.round(Math.random() * (100000000000 - 1) + 1);
        let external_reference = '';

    let url=`https://api.mercadopago.com/v1/payments/${idPayment}?access_token=APP_USR-5546533367160765-050618-71ff81153356a8fdfadd20a6b59d2edb-1119276512`
    console.log(url);
        try {
            let info = await axios.get(url);
            //external_reference = info.data.external_reference;
            //const writeResult = await admin.firestore().collection('payments').add({id: id, idPayment: idPayment, user_id: user_id, external_reference: external_reference});
            //como incrementar un contador en function firebase
              external_reference = info.data.external_reference;
             
                 if(info.data.status.includes("approved")){
                     
                   

                    let writeResulta = await admin.firestore().collection('EstadoPagoCamionero').doc(external_reference).update({id: id, idPayment: idPayment, user_id: user_id, external_reference: external_reference,"status":"Aprobado","folio":random,"activaciones":true,"horaDeActualizacion": admin.firestore.FieldValue.serverTimestamp()}, { merge: true },);

                    

                   
                     if(info.data.status.includes("pending")){
                         
                       

                        let writeResulta = await admin.firestore().collection('EstadoPagoCamionero').doc(external_reference).update({id: id, idPayment: idPayment, user_id: user_id, external_reference: external_reference,"status":"Pendiente","folio":random, "horaDeActualizacion": admin.firestore.FieldValue.serverTimestamp() }, { merge: true },);

                        
                        res.json({result: info.data});

                     } else{
                         
                         res.json({result: info.data});
                     }
                     
                 }else{
                    let writeResulta = await admin.firestore().collection('ActivacionesTotal').doc(external_reference).update({id: id, idPayment: idPayment, user_id: user_id, external_reference: external_reference,"status":"Pendiente","folio":random, "horaDeActualizacion": admin.firestore.FieldValue.serverTimestamp()}, { merge: true },);
                      res.json({result: info.data});
                 }
              
              
          } catch (error) {
            console.log('Error: ', error);
            res.status(500).send(`catch block hit: ${idPayment}`);
          }
      });






      exports.geMercadoPagoPrueba = functions.https.onRequest(async (req, res) => {
        console.log('POST Sended from MP to Cloud Function:', req.body);
      
        // Grab the text parameter.
        let id = req.body.id;
        let live_mode = req.body.live_mode;
        let type = req.body.type;
        let date_created = req.body.date_created;
        let idPayment = req.body.data.id;
        let user_id = req.body.user_id;
        let version = req.body.version;
        let api_version = req.body.api_version;
        let action = req.body.action;
        var random =Math.round(Math.random() * (100000000000 - 1) + 1);
        let external_reference = '';

    let url=`https://api.mercadopago.com/v1/payments/${idPayment}?access_token=TEST-5546533367160765-050618-c3fa6eca846f1f8f069e105609911e43-1119276512`
    console.log(url);
        try {
            let info = await axios.get(url);
            //external_reference = info.data.external_reference;
            //const writeResult = await admin.firestore().collection('payments').add({id: id, idPayment: idPayment, user_id: user_id, external_reference: external_reference});
            //como incrementar un contador en function firebase
              external_reference = info.data.external_reference;
             
                 if(info.data.status.includes("approved")){
                     
                   

                    let writeResulta = await admin.firestore().collection('EstadoPagoCamionero').doc(external_reference).update({id: id, idPayment: idPayment, user_id: user_id, external_reference: external_reference,"status":"Aprobado","folio":random,"activaciones":true,"horaDeActualizacion": admin.firestore.FieldValue.serverTimestamp()}, { merge: true },);

                    

                   
                     if(info.data.status.includes("pending")){
                         
                       

                        let writeResulta = await admin.firestore().collection('EstadoPagoCamionero').doc(external_reference).update({id: id, idPayment: idPayment, user_id: user_id, external_reference: external_reference,"status":"Pendiente","folio":random, "horaDeActualizacion": admin.firestore.FieldValue.serverTimestamp() }, { merge: true },);

                        
                        res.json({result: info.data});

                     } else{
                         
                         res.json({result: info.data});
                     }
                     
                 }else{
                    let writeResulta = await admin.firestore().collection('ActivacionesTotal').doc(external_reference).update({id: id, idPayment: idPayment, user_id: user_id, external_reference: external_reference,"status":"Pendiente","folio":random, "horaDeActualizacion": admin.firestore.FieldValue.serverTimestamp()}, { merge: true },);
                      res.json({result: info.data});
                 }
              
              
          } catch (error) {
            console.log('Error: ', error);
            res.status(500).send(`catch block hit: ${idPayment}`);
          }
      });

//       var WooCommerceAPI = require('woocommerce-api');
      
//     exports.getWoocomerce= functions.https.onRequest(async (req, res) => {
//       let wooBodyData = req.body;
//       console.log(`la longitud es: ${Object.keys(wooBodyData).length}` );
//       if(Object.keys(wooBodyData).length>20){
//       let writeResulta = await admin.firestore().collection('wooComerce').add(wooBodyData);
//       res.json({result: `se aprobo${wooBodyData}`});
//       }else{
//         console.log("Es menor");
//         res.status(500).send(`catch block hit: es menor`);
//       }
// });

exports.onSaleCreate = functions.firestore
    .document("Earnings/{docId}")
    .onCreate((snap, context) => {
        const info = snap.data()
        const db = admin.firestore();
        const idChofer = info.storeId;
        db.collection("Censers").doc(idChofer).update({ventas: admin.firestore.FieldValue.increment(1)}).catch((er)=>{console.log(er)})
    });

     exports.onActivacionCreate = functions.firestore
     .document("ActivacionesTotal/{docId}")
     .onCreate((snap, context) => {
         const info = snap.data()
         const db = admin.firestore();
         const idChofer = info.idCamion;
         db.collection("Censers").doc(idChofer).update({activacionesRestantes: admin.firestore.FieldValue.increment(-1)}).catch((er)=>{console.log(er)})
     });

    exports.onActivacionUpdate = functions.firestore
    .document("EstadoPagoCamionero/{docId}")
    .onUpdate((change, context) => {
        const info = change.after.data();
        const db = admin.firestore();
        const idChofer = info.idCamion;
        db.collection("ActivacionesTotal").doc(idChofer).update({numeroActivacion: admin.firestore.FieldValue.increment(12)}).catch((er)=>{console.log(er)})
    });
    exports.onActivacionUpdateCamion = functions.firestore
    .document("EstadoPagoCamionero/{docId}")
    .onUpdate((change, context) => {
        const info = change.after.data();
        const db = admin.firestore();
        const idChofer = info.idCamion;
        db.collection("Censers").doc(idChofer).update({activacionesRestantes: admin.firestore.FieldValue.increment(12)}).catch((er)=>{console.log(er)})
    });


var routeList=[];
routeList.push({
    nombre:"Cienega grande",
    estado:"Yucatan",
    carretera:"Mex 025",
    longitud_km: 10.5,
    caseta_o_puente:"La joya",
    camion_4_ejes:247,
},
{
    nombre:"Cienega grande",
    estado:"Yucatan",
    carretera:"Mex 025",
    longitud_km: 10.5,
    caseta_o_puente:"La joya",
    camion_4_ejes:247,    
});
exports.addMessagePrueba = functions.https.onRequest(async (req, res) => {
    console.log("pruebas");
    res.json({result: routeList});
  });

//Web scraping
  const cheerio=require("cheerio");
  const links="http://app.sct.gob.mx/sibuac_internet/ControllerUI?action=cmdSolRutas&tipo=1&red=simplificada&edoOrigen=1&ciudadOrigen=1040&edoDestino=2&ciudadDestino=2080&vehiculos=11";
  const book_data=[];
  const nombreRutaL=[];
  exports.addMessagePruebass = functions.https.onRequest(async (req, res) => { 
    async function getBooks(url){
        try{
            const response = await axios.get(url,
                {
                    responseType: 'arraybuffer',
                  }
                );
            const $= cheerio.load(response.data.toString("latin1"));
            
        const nombreRuta = $(".texto3");
        nombreRuta.each(function () {
                 ruta=$(this).find("b").text().trim();
                 nombreRutaL.push(ruta);
             });
            const keys=[
                'nombre',
                'estado',
                'carretera',
                'longitud_km',
                'tiempo_hrs',
                'caseta_o_puente',
                'camion_4_ejes',
            ];
            $(".tr_blanco") .each((parentIndex, parentElemnt)=>{
                let keyIndex=0;
                const ruta={};
                $(parentElemnt).children().each((childId, childElemnt)=>{
                    const value =$(childElemnt).text().trim();
                        ruta[keys[keyIndex]]=value;
                        keyIndex++;
                });
                
                book_data.push(ruta);
            });
            book_data.shift();
            console.log(book_data);
        }
        catch(error){
            console.log(error);
        }
    
    }
   
    
getBooks(links);
const onbjRutas={
    "ruta":nombreRutaL[0],
    "result":book_data,
};
res.json(onbjRutas);
});
