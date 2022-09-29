const express = require("express");
const Iyzipay = require("iyzipay");
const serverless = require("serverless-http");
const {v4: uuidv4} = require("uuid");
var iyzipay = new Iyzipay({
	apiKey: "sandbox-zb5J26e0gCHYNTRxbgek3bP16PUjTD1U",
	secretKey: "sandbox-UqnemRG8p7Sonc9KgvguaHAQlg8hrYFW",
	uri: "https://sandbox-api.iyzipay.com",
});

const PORT = 3001;

const app = express();
const server = app.listen(PORT, () => {
	console.info(`Server is running on ${PORT}`);
});

app.use(express.json());
const router = express.Router();
app.use("/.netlify/functions/server", router);
router.get("/", (req, res) => {
	res.send("Bunu görüyorsan kuruldu.");
});

router.get("/test", (req, res) => {
	res.json({test: "Test success"});
});

router.post("/pay", (req, res) => {
	let conversationId = uuidv4();
	var request = {
		locale: Iyzipay.LOCALE.TR,
		conversationId: conversationId,
		price: "1",
		paidPrice: "1.2",
		currency: Iyzipay.CURRENCY.TRY,
		basketId: "B67832",
		paymentGroup: Iyzipay.PAYMENT_GROUP.LISTING,
		callbackUrl: `http://localhost:3001/paymentresult?id=${conversationId}`,
		enabledInstallments: [2, 3, 6, 9],
		buyer: {
			id: "BY789",
			name: "John",
			surname: "Doe",
			gsmNumber: "+905350000000",
			email: "email@email.com",
			identityNumber: "74300864791",
			lastLoginDate: "2015-10-05 12:43:35",
			registrationDate: "2013-04-21 15:12:09",
			registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
			ip: "85.34.78.112",
			city: "Istanbul",
			country: "Turkey",
			zipCode: "34732",
		},
		shippingAddress: {
			contactName: "Jane Doe",
			city: "Istanbul",
			country: "Turkey",
			address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
			zipCode: "34742",
		},
		billingAddress: {
			contactName: "Jane Doe",
			city: "Istanbul",
			country: "Turkey",
			address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
			zipCode: "34742",
		},
		basketItems: [
			{
				id: "BI101",
				name: "Binocular",
				category1: "Collectibles",
				category2: "Accessories",
				itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
				price: "0.3",
			},
			{
				id: "BI102",
				name: "Game code",
				category1: "Game",
				category2: "Online Game Items",
				itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
				price: "0.5",
			},
			{
				id: "BI103",
				name: "Usb",
				category1: "Electronics",
				category2: "Usb / Cable",
				itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
				price: "0.2",
			},
		],
	};
	iyzipay.checkoutFormInitialize.create(request, function (err, result) {
		console.log(result);
		console.log(
			result.checkoutFormContent +
				'<div id="iyzipay-checkout-form" class="responsive"></div>',
		);
		res.send(result);
	});
});

router.post("/pay3d", (req, res) => {
	var request = {
		locale: Iyzipay.LOCALE.TR,
		conversationId: "123456789",
		price: "1",
		paidPrice: "1.2",
		currency: Iyzipay.CURRENCY.TRY,
		installment: "1",
		basketId: "B67832",
		paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
		paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
		callbackUrl: "http://localhost:3001/paymentresult",
		paymentCard: {
			cardHolderName: "John Doe",
			cardNumber: "5890040000000016",
			expireMonth: "12",
			expireYear: "2030",
			cvc: "123",
			registerCard: "0",
		},
		buyer: {
			id: "BY789",
			name: "John",
			surname: "Doe",
			gsmNumber: "+905350000000",
			email: "email@email.com",
			identityNumber: "74300864791",
			lastLoginDate: "2015-10-05 12:43:35",
			registrationDate: "2013-04-21 15:12:09",
			registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
			ip: "85.34.78.112",
			city: "Istanbul",
			country: "Turkey",
			zipCode: "34732",
		},
		shippingAddress: {
			contactName: "Jane Doe",
			city: "Istanbul",
			country: "Turkey",
			address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
			zipCode: "34742",
		},
		billingAddress: {
			contactName: "Jane Doe",
			city: "Istanbul",
			country: "Turkey",
			address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
			zipCode: "34742",
		},
		basketItems: [
			{
				id: "BI101",
				name: "Binocular",
				category1: "Collectibles",
				category2: "Accessories",
				itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
				price: "0.3",
			},
			{
				id: "BI102",
				name: "Game code",
				category1: "Game",
				category2: "Online Game Items",
				itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
				price: "0.5",
			},
			{
				id: "BI103",
				name: "Usb",
				category1: "Electronics",
				category2: "Usb / Cable",
				itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
				price: "0.2",
			},
		],
	};
	iyzipay.threedsInitialize.create(request, function (err, result) {
		console.log(err, result);
		// result.threeDSHtmlContent = atob(result.threeDSHtmlContent);
		res.send(result);
	});
});

router.post("/paymentresult", (req, res) => {
	console.log(req);
	console.log(req.body);
	console.log(req.params);
	res.send(req);
});

module.exports.handler = serverless(app);
