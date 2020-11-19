import React from 'react';
import 'react-chat-elements-av/dist/main.css';
import ChatData from '../data/ChatData';
import Mayre from "mayre"

class Uploader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			chatBuffer: ''
		};
	}

	showFile = async (e) => {
		e.preventDefault();
		const reader = new FileReader();
		reader.onload = async (e) => {
			this.setState({ chatBuffer: e.target.result });
		};
		reader.readAsText(e.target.files[0]);
	};

	render() {
		let { chatBuffer } = this.state;
		return (
			<div>
				<input type="file" onChange={(e) => this.showFile(e)} />
				<br />
        <Mayre
          of={
            <ChatData chatBuffer={chatBuffer} />
          }when={chatBuffer.length > 0}
        />
			</div>
		);
	}
}

export default Uploader;
