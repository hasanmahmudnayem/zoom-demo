require('dotenv').config();
const express = require('express');
const cors = require('cors');
const KJUR = require('jsrsasign');

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());
app.options('*', cors());

app.post('/', (req, res) => {
	const iat = Math.round(new Date().getTime() / 1000) - 30;
	const exp = iat + 60 * 60 * 2;
	const oHeader = { alg: 'HS256', typ: 'JWT' };

	const { meetingNumber, role } = req.body;
	const key = process.env.ZOOM_MEETING_SDK_KEY_OR_CLIENT_ID;
	const secret = process.env.ZOOM_MEETING_SDK_SECRET_OR_CLIENT_SECRET;

	const oPayload = {
		sdkKey: key,
		appKey: key,
		mn: meetingNumber,
		role: parseInt(role) || 1,
		iat: iat,
		exp: exp,
		tokenExp: exp,
	};

	const sHeader = JSON.stringify(oHeader);
	const sPayload = JSON.stringify(oPayload);
	const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, secret);

	console.log('SDK JWT', sdkJWT);
	res.json({ sdkJWT });
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
