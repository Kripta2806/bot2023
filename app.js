const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
} = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MongoAdapter = require('@bot-whatsapp/database/mongo')
const { HostLayer } = require('venom-bot/dist/api/layers/host.layer')


/**
 * Declaramos las conexiones de Mongo
 */

const MONGO_DB_URI = 'mongodb://0.0.0.0:27017'
const MONGO_DB_NAME = 'db_bot2023'

/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer([
    '📄 Aquí tenemos el flujo secundario',
])

const flowDocs = addKeyword([
    'doc',
    'documentacion',
    'documentación',
]).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encontras un ejemplo rapido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)



const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowDiscord = addKeyword(['discord']).addAnswer(
    [
        '🤪 Únete al discord',
        'https://link.codigoencasa.com/DISCORD',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)
/**
 * Empieza el area de soporte técnico
 */
const flowSoporteTecnico = addKeyword(['Soporte Técnico'])
    .addAnswer(['Bienvenidos al Dpto. de Soporte Técnico🤖👷‍♂️', '¿Nos indica cual de estas fallas esta presentando?'],
        {buttons:[
            {body:"Sin servicio"},
            {body:"Lentitud"},
            {body:"Intermitencia"}
        ],
        capture: false,delay:(0)})

const flowSinServicio = addKeyword(['Sin Servicio'])
    .addAnswer(['De acuerdo, vamos a realizar los siguientes pasos para verificar que todo', 'este correctamente conectado y funcional'])
    .addAnswer(['1.- Verifique la conexión eléctrica de su Antena y Router', '2.- Chequee que los cables esten bien conectados al POE de la antena y a su ROUTER', "3.- Si es posible chequee que la antena se encuentre encendida, verifique los LED's en la antena que esten encendidose",'4.- Observe si el cable no se encuentra Dañado/Roto en algun lugar de su recorrido'])
    .addAnswer(['Una vez realizados los pasos anteriores', '¿nos indica si retorno el servicio?'],
        {buttons:[
            {body:"Si"},
            {body:"No"},
        ],
        capture: false,delay:(0)})

const flowSi = addKeyword(['Si']).addAnswer(['Perfecto, cualquier otro inconveniente estamos para servirle', 'Gracias por comunicarse con el Nuevo CHATBOT de ECONET'])
const flowNo = addKeyword(['No'])
    .addAnswer('Ok, dependiendo de la ciudad de la cual nos escribe, le dejamos el numero del Dpto. de Soporte Técnico para ofrecerle una atencion mas personalizada y solventar su falla')
    .addAnswer(['*Barcelona* Anzoategui Zona Norte *0412-9451924*','*Porlamar* Nva. Esparta *0412-3576407*','*El Tigre* Anzoategui Zona Sur *0412-1016573*', '*Puerto Ordaz* Edo. Bolivar *0412-9245071*' ])

const flowLentitud = addKeyword(['Lentitud'])
    .addAnswer(['De acuerdo, vamos a realizar los siguientes pasos para verificar que todo', 'este correctamente conectado y funcional'])
    .addAnswer(['1.- Apague su equipo *ROUTER* por un lapso de tiempo de 30 segundos, y vuelva a encenderlo', '2.- Chequee que los cables esten bien conectados al POE de la antena y a su ROUTER', '3.- Realice una prueba directa desde el POE, la cual consiste en conectar el POE a una Laptop o PC de escritorio y hacer un Test de Velocidad de Conexión'])
    .addAnswer(['Una vez realizados los pasos anteriores', '¿nos indica si retorno el servicio?'],
        {buttons:[
            {body:"Si"},
            {body:"No"},
        ],
        capture: false,delay:(0)})

const flowIntermitencia = addKeyword(['Intermitencia'])
    .addAnswer(['De acuerdo, vamos a realizar los siguientes pasos para verificar que todo', 'este correctamente conectado y funcional'])
    .addAnswer(['1.- Verifique la conexión eléctrica de su Antena y Router','2.- Chequee que los cables esten bien conectados al POE de la antena y a su ROUTER', '3.- Observe si los conectores *RJ-45* se encuentran en buen estado (sin sulfato, agua o quemados), tanto del cable como en el POE', '4.- Observe si el cable no se encuentra Dañado/Roto en algun lugar de su recorrido'])
    .addAnswer(['Una vez realizados los pasos anteriores', '¿nos indica si retorno el servicio?'],
        {buttons:[
            {body:"Si"},
            {body:"No"},
        ],
        capture: false,delay:(0)})

/**
 * Aqui empieza Administración
 */

const flowAdministracion = addKeyword(['Administración'])
    .addAnswer(['Bienvenidos al Dpto. de Administración 🤖👩‍🏫', '¿Nos indica como podria ayudarle?'],
        {buttons:[
            {body:"Facturación"},
            {body:"Tasa del Día"},
            {body:"Nuestros Planes"}
        ],
        capture: false,delay:(0)})

const flowFacturacion = addKeyword(['Facturación'])
    .addAnswer(['Ingrese en la siguiente dirección Web para realizar la consulta de su Factura',, 'https://zonaclientes.sytes.net:8092\n'])
    .addAnswer(['*Recuerde que el dia de corte son los dias Seis (06) de cada mes*'])
    .addAnswer(['Estos son los numeros de los Dptos. de Administración de cada una de nuestras sedes para ofrecerle una atencion mas personalizada'])
    .addAnswer(['*Barcelona* Anzoategui Zona Norte *0412-8407046*', '*Porlamar* Nva. Esparta *0412-3576407*', '*El Tigre* Anzoategui Zona Sur *0412-1039004*', '*Puerto Ordaz* Edo. Bolivar *0412-1836183*'])


const flowTasa = addKeyword(['Tasa del Día'])
    .addAnswer(['la Tasa del BCV del día de hoy es: 17,41Bs'])
    .addAnswer(['*Recuerde que el dia de corte son los dias Seis (06) de cada mes*'])

const flowPlanes = addKeyword(['Nuestros Planes'])
    .addAnswer('Ok, esta es nuestra lista de Planes y sus costos', {
        media: 'https://i.ibb.co/7nczGGg/Planes.jpg'
    })

    .addAnswer(['*Recuerde que el dia de corte son los dias Seis (06) de cada mes*'])
    


/**
* Aqui empieza Ventas
*/

const flowVentas = addKeyword(['Ventas'])
    .addAnswer(['Bienvenidos al Dpto. de Ventas🤖👩‍💻', '¿Nos indica como podria ayudarle?'],
    {buttons:[
        {body:"Cambio de Plan"},
        {body:"Promoción del Mes"},
        {body:"Nuevo Servicio"}
    ],
    capture: false,delay:(0)})

const flowCambio = addKeyword(['Cambio de Plan'])
    .addAnswer(['Ingrese en la siguiente dirección Web para realizar su Cambio de Plan', 'https://econetwifi.com/', '_leyfer crear campo_'])

const flowPromo = addKeyword(['Promoción del Mes'])
    .addAnswer('Nuestra pormocion para este mes es:',
        {media: 'https://i.ibb.co/r0c5Dxx/promof.jpg'})

const flowNServicio = addKeyword(['Nuevo Servicio'])
    .addAnswer(['Ingrese en la siguiente dirección Web para realizar su Solicitud de Servicio', 'https://econetwifi.com/formulario/'])

    

 /**
 * Aqui empieza El Bot una vez el cliente escriba el primer mensaje
 */


const flowPrincipal = addKeyword([''])
    .addAnswer(["Hola! y✌️ Bienvenido a este 🤖 CHATBOT de ECONET, Gracias por comunicarse con nosotros, sera atendido por nuestro Operador Virtual *Ondy*", 'Estamos implementando esta nueva herramienta para mejorar nuestra atencion al cliente'])
    .addAnswer('Si desea saber cual es nuestra *_PROMOCION_* del mes, pulse el *Boton* con la opción *Ventas*')
    .addAnswer('Nos indica a nombre de quien se encuentra el Servicio y Ciudad la cual nos escribe', {capture:true},async(ctx,{flowDynamic})=> {
        const nombre=ctx.body
        var msg=
        {body: 'Hola, un gusto atenderlo. Soy el Asistente Virtual 🤖 *Ondy*'}
        flowDynamic(msg);
    })
    .addAnswer(['¿Nos indica en que área lo podemos ayudar?'],
        {buttons:[
            {
                body: "Soporte Técnico"
            },
            {
                body: "Administración"
            },
            {
                body: "Ventas"
            }
        ],
        capture: false,delay:(0)})
    

const main = async () => {
    const adapterDB = new MongoAdapter({
        dbUri: MONGO_DB_URI,
        dbName: MONGO_DB_NAME,
    })
    const adapterFlow = createFlow([flowPrincipal, flowSoporteTecnico, flowSinServicio, flowSi, flowNo, flowLentitud, flowIntermitencia, flowAdministracion, flowFacturacion, flowTasa, flowPlanes, flowVentas, flowCambio, flowPromo, flowNServicio])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()
