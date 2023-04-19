require('dotenv').config();

const Sib = require('sib-api-v3-sdk')

const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.SMTP_API_KEY

const tranEmailApi = new Sib.TransactionalEmailsApi()

const sender = {
    email: 'noreply@mattlyon.co.uk',
    name: 'noreply'
}

const receivers = [
    {email: 'matthewlyon18@gmail.com'}
]

// tranEmailApi
// 	.sendTransacEmail({
// 		sender,
// 		to: receivers,
// 		subject: 'This is a test',
// 		textContent: `
//         This is simply a test, there is no need to be alarmed.
//         `,
// 		htmlContent: `
//         <h1>Look</h1>
//         <a href="https://www.google.co.uk/">html!</a>
//                 `,
// 	})
// 	.then(console.log)
// 	.catch(console.log)

tranEmailApi
	.sendTransacEmail({
		sender,
		to: receivers,
		subject: 'This is a test',
		textContent: `
        This is simply a test, there is no need to be alarmed.
        Here is an example link: https://www.google.co.uk
        `
	})
	.then(console.log)
	.catch(console.log)