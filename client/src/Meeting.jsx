import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
import axios from 'axios';

const startMeeting = (meetingInfo) => {
	new AudioContext().resume();
	const client = ZoomMtgEmbedded.createClient();
	client
		.init({
			debug: true,
			patchJsMedia: true,
			zoomAppRoot: document.getElementById('meetingSDKElement'),
			language: 'en-US',
			customize: {
				video: {
					isResizable: true,
					viewSizes: {
						default: {
							width: 1000,
							height: 600,
						},
						ribbon: {
							width: 300,
							height: 700,
						},
					},
				},
			},
		})
		.then(() => {
			return client
				.join({
					signature: meetingInfo.jwtSignature,
					sdkKey: meetingInfo.sdkKey,
					meetingNumber: meetingInfo.meetingNumber,
					userName: meetingInfo.currentUserName ?? 'Guest',
					// zak: meetingInfo.zak ?? undefined,
				})
				.catch((e) => {
					console.log(e);
				});
		})
		.catch((error) => {
			console.log('Init error');
			console.log(error);
		});
};

const Meeting = () => {
	const meetingNumber = '5730692755';
	const userName = 'HM Nayem';

	const handleClick = async () => {
		try {
			const { data } = await axios.post('http://localhost:5001', {
				meetingNumber,
				role: 1,
			});
			startMeeting({
				sdkKey: import.meta.env.CLIENT_ID,
				jwtSignature: data.sdkJWT,
				meetingNumber,
				userName,
			});
		} catch (error) {
			console.log('Error', error);
			alert('Error');
		}
	};

	return (
		<div className='App'>
			<main>
				<h1>Zoom Meeting SDK Sample React</h1>
				<button onClick={handleClick}>Start Meeting</button>
				<div id='meetingSDKElement'></div>
			</main>
		</div>
	);
};

export default Meeting;
