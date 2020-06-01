import React from 'react';
import PropTypes from 'prop-types';
import 'react-chat-elements-av/dist/main.css';
import _ from 'lodash';
import HashTable from '../hashtable/HashTable';
import Dashboard from '../dashboard/Dashboard';
import Mayre from 'mayre';
import { Modal, Select } from 'antd';
const Option = Select.Option;

class ChatData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			words: 0,
			visible: false,
			loadDashboard: false,
			selectedUser: '',
			globalData: ''
		};
	}

	componentDidMount() {
		this.setState({ globalData: this.justaTest(), visible: true });
	}

	handleOk = () => {
		this.setState({
			visible: false,
			loadDashboard: true
		});
	};

	arrayOfChatLinesAfterEnterRemoved = () => {
		let chatMessagesArray = this.props.chatBuffer.split('\n');
		let joinedMessage = '';
		let enteredPieceOfMessage = '';

		for (let index = 1; index < chatMessagesArray.length; index++) {
			const element = chatMessagesArray[index];
			if (!/^(([1-9])|((1)[0-2]))(\/)([1-9]|((1)[0-9])|((2)[0-9])|((3)[0-1]))(\/)(\d{2})/i.test(element)) {
				enteredPieceOfMessage = chatMessagesArray[index];
				if (index) {
					joinedMessage = chatMessagesArray[index - 1].concat(' ', enteredPieceOfMessage);
					chatMessagesArray.splice(index - 1, 1, joinedMessage);
					chatMessagesArray.splice(index, 1);
				}
				index -= 1;
			}
		}
		return chatMessagesArray;
	};

	arrayOfDatesPerChatLine = () => {
		let dates = [];
		let messageCount = 0;

		this.arrayOfChatLinesAfterEnterRemoved().forEach((individualMessage) => {
			for (let pointerInMessage = 0; pointerInMessage < individualMessage.length; pointerInMessage++) {
				if (individualMessage[pointerInMessage] === ',') {
					dates[messageCount] = individualMessage.slice(0, pointerInMessage);
					if (individualMessage[pointerInMessage] === undefined) {
						console.log('und', pointerInMessage);
					}
					break;
				}
			}
			messageCount++;
		});

		return dates;
	};

	arrayOfTimesPerChatLine = () => {
		let times = [];
		let messageCount = 0;
		let pointerInMessageForTime = 0;

		this.arrayOfChatLinesAfterEnterRemoved().forEach((individualMessage) => {
			for (let pointerInMessage = 0; pointerInMessage < individualMessage.length; pointerInMessage++) {
				if (individualMessage[pointerInMessage] === ',') {
					pointerInMessageForTime = pointerInMessage + 2;
					for (let i = pointerInMessageForTime; i < pointerInMessageForTime + 10; i++) {
						if (individualMessage[i] === '-') {
							times[messageCount] = individualMessage.slice(pointerInMessageForTime, i - 1);
						}
					}
					break;
				}
			}
			messageCount++;
		});

		return times;
	};

	arrayOfObjectsOfDatesAndTimes = () => {
		const countOfMessagesPerDate = this.countOfMessagesPerDate();
		let times = this.arrayOfTimesPerChatLine();
		let datesarr = [];
		let data = [];

		for (let i = 0; i < countOfMessagesPerDate.length; i++) {
			data[i] = {
				date: countOfMessagesPerDate[i].date,
				timesOnThisDate: []
			};
		}

		for (let i = 0; i < countOfMessagesPerDate.length; i++) {
			datesarr.push({ date: countOfMessagesPerDate[i].date });
			for (let j = 0; j < countOfMessagesPerDate[i].messages; j++) {
				data[i].timesOnThisDate.push(times[j]);
			}
			times.splice(0, countOfMessagesPerDate[i].messages);
		}

		return data;
	};

	arrayOfSenderPerChatLine = () => {
		let senders = [];
		let messageCount = 0;
		let pointerInMessageForSender = 0;
		let nameFound = false;
		let senderDelimCount = 0;

		this.arrayOfChatLinesAfterEnterRemoved().forEach((individualMessage) => {
			for (let pointerInMessage = 0; pointerInMessage < individualMessage.length; pointerInMessage++) {
				if (individualMessage[pointerInMessage] === '-') {
					pointerInMessageForSender = pointerInMessage + 2;
					nameFound = false;
					for (let i = pointerInMessageForSender; i < pointerInMessageForSender + 15; i++) {
						if (individualMessage[i] === ':') {
							++senderDelimCount;
							if (senderDelimCount < 2 && nameFound === false) {
								senders[messageCount] = individualMessage.slice(pointerInMessageForSender, i);
								nameFound = true;
							}
						}
					}
					senderDelimCount = 0;
					break;
				}
			}
			messageCount++;
		});

		return senders;
	};

	arrayOfMessageTextPerChatLine = () => {
		let messageContent = [];
		let messageCount = 0;
		let pointerInMessageForSender = 0;
		let pointerInMessageForContentInit = 0;
		let pointerInMessageForContentEnd = 0;

		this.arrayOfChatLinesAfterEnterRemoved().forEach((individualMessage) => {
			for (let pointerInMessage = 0; pointerInMessage < individualMessage.length; pointerInMessage++) {
				if (individualMessage[pointerInMessage] === '-') {
					pointerInMessageForSender = pointerInMessage + 2;
					for (let i = pointerInMessageForSender; i < pointerInMessageForSender + 15; i++) {
						if (individualMessage[i] === ':') {
							pointerInMessageForContentInit = i + 2;
							pointerInMessageForContentEnd = pointerInMessageForContentInit;
							while (pointerInMessageForContentEnd < individualMessage.length) {
								pointerInMessageForContentEnd++;
								if (pointerInMessageForContentEnd === individualMessage.length) {
									messageContent[messageCount] = individualMessage.slice(
										pointerInMessageForContentInit,
										pointerInMessageForContentEnd
									);
								}
							}
							pointerInMessageForContentEnd = pointerInMessageForContentInit;
						}
					}
					break;
				}
			}
			messageCount++;
		});

		return messageContent;
	};

	justaTest = () => {
		let pointerInMessageForTime = 0;
		let pointerInMessageForSender = 0;
		let pointerInMessageForContentInit = 0;
		let pointerInMessageForContentEnd = 0;
		let dateDelimCount = 0;
		let timeDelimCount = 0;
		let senderDelimCount = 0;
		let data = { date: [], time: [], sender: [], content: [], total: 0 };

		this.arrayOfChatLinesAfterEnterRemoved().forEach((individualMessage) => {
			let tempIndividualMessage = individualMessage;
			for (let pointerInMessage = 0; pointerInMessage < individualMessage.length; pointerInMessage++) {
				if (individualMessage[pointerInMessage] === ',') {
					++dateDelimCount;
					if (dateDelimCount < 2) {
						data.date.push(tempIndividualMessage.slice(0, pointerInMessage));
						pointerInMessageForTime = pointerInMessage + 2;

						for (let j = pointerInMessageForTime; j < pointerInMessageForTime + 10; j++) {
							if (individualMessage[j] === '-') {
								++timeDelimCount;
								if (timeDelimCount < 2) {
									pointerInMessageForSender = j + 2;
									data.time.push(tempIndividualMessage.slice(pointerInMessageForTime, j - 1));

									for (let i = pointerInMessageForSender; i < pointerInMessageForSender + 15; i++) {
										if (individualMessage[i] === ':') {
											++senderDelimCount;
											if (senderDelimCount < 2) {
												data.sender.push(
													tempIndividualMessage.slice(pointerInMessageForSender, i)
												);
												pointerInMessageForContentInit = i + 2;
												pointerInMessageForContentEnd = pointerInMessageForContentInit;

												while (pointerInMessageForContentEnd < individualMessage.length) {
													pointerInMessageForContentEnd++;
													if (pointerInMessageForContentEnd === individualMessage.length) {
														data.content.push(
															individualMessage.slice(
																pointerInMessageForContentInit,
																pointerInMessageForContentEnd
															)
														);
													}
												}
												pointerInMessageForContentEnd = pointerInMessageForContentInit;
											}
										}
									}
									senderDelimCount = 0;
									break;
								}
							}
						}
						timeDelimCount = 0;
					}
				}
			}
			dateDelimCount = 0;
		});

		data.total =
			data.content.length - data.date.length === 0 && data.sender.length - data.time.length === 0
				? data.content.length
				: -1;

		return data;
	};

	countOfMessagesPerDate = () => {
		let keys = _.keys(_.countBy(this.arrayOfDatesPerChatLine()));
		let values = _.values(_.countBy(this.arrayOfDatesPerChatLine()));
		let keysobj = [];
		let valuesobj = [];
		let data = [];

		for (let i = 0; i < keys.length; i++) {
			keysobj.push({ date: keys[i] });
			valuesobj.push({ messages: values[i] });
		}

		keysobj.map((item, i) => {
			item = { ...keysobj[i], ...valuesobj[i] };
			data.push(item);
			return data;
		});

		return data;
	};

	countOfMessagesPerSenderPerDate = () => {
		let keys = _.keys(_.countBy(this.arrayOfDatesPerChatLine()));
		let values = _.values(_.countBy(this.arrayOfDatesPerChatLine()));
		let keysobj = [];
		let valuesobj = [];
		let data = [];

		for (let i = 0; i < keys.length; i++) {
			keysobj.push({ date: keys[i] });
			valuesobj.push({ messages: values[i] });
		}

		keysobj.map((item, i) => {
			item = { ...keysobj[i], ...valuesobj[i] };
			data.push(item);
			return data;
		});

		return data;
	};

	countOfTotalMessagesPerSender = () => {
		//working = {{},{}}
		/* let data = {};
		let count = 0;
		for (let i = 0; i < this.getParticipants().length; i++) {
			for (let j = 0; j < this.justaTest().total; j++) {
				if (this.justaTest().sender[j] == this.getParticipants()[i]) {
					count++;
				}
			}
			data[`participant${i}`] = { name: this.getParticipants()[i], messages: count };
			count = 0;
		} */

		let data = [];
		let inner = {};
		let count = 0;
		let test = this.state.globalData;
		let participants = this.getParticipants();

		for (let i = 0; i < participants.length; i++) {
			for (let j = 0; j < test.total; j++) {
				if (test.sender[j] === participants[i]) {
					count++;
				}
			}

			inner = { name: participants[i].replace(/ /g, ''), messages: count };
			data.push(inner);
			count = 0;
		}

		return data;
	};

	arrayOfObjectsOfCountOfMessagesPerDate = () => {
		let test = this.state.globalData;
		let data = [];
		let info = { date: '', messagesPerSender: {}, messageData: { time: [], sender: [], content: [] }, messages: 0 };
		let dateCounter = 0;
		let temp = [];
		let temp2 = [];
		let participants = this.getParticipantsJoined();

		for (let i = 0; i < test.total; i++) {
			if (test.date[i] === undefined) {
				break;
			}
			if (test.date[i] === test.date[i + 1]) {
				info.messageData.time.push(test.time[i]);
				info.messageData.sender.push(test.sender[i]);
				info.messageData.content.push(test.content[i]);
				++dateCounter;
			} else {
				info.messageData.time.push(test.time[i]);
				info.messageData.sender.push(test.sender[i]);
				info.messageData.content.push(test.content[i]);
				info.messages = dateCounter + 1;
				dateCounter = 0;
			}

			if (dateCounter === 0) {
				info.date = test.date[i];
				data.push(info);
				info = { date: '', messageData: { time: [], sender: [], content: [] }, messages: 0 };
			}
		}

		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < data[i].messageData.sender.length; j++) {
				temp.push(data[i].messageData.sender[j].replace(/ /g, ''));
			}

			temp2 = _.countBy(temp);
			let keys = _.keys(temp2);
			let values = _.values(temp2);

			if (keys.length !== participants.length) {
				for (let j = 0; j < participants.length; j++) {
					keys = _.union(keys, participants);
				}
				for (let j = 0; j <= participants.length - keys.length; j++) {
					values.push(0);
				}
			}

			for (let j = 0; j < keys.length; j++) {
				data[i][keys[j]] = values[j];
			}
			temp = [];
		}

		return data;
	};

	arrayOfObjectsOfDateTextPositionTypeForChatComponent = () => {
		/*
			Had some hardcoded values that only worked with one specific chat,
			which I was using for testing purposes. Will update function in 
			further releases... In the mean time, chat view won't be working.
		*/
	};

	arrayOfCountOfMessagesPerHour = () => {
		const times = this.arrayOfObjectsOfDatesAndTimes();
		const timesRegex = [
			'^([1]):[0-5][0-9] (AM)',
			'^([2]):[0-5][0-9] (AM)',
			'^([3]):[0-5][0-9] (AM)',
			'^([4]):[0-5][0-9] (AM)',
			'^([5]):[0-5][0-9] (AM)',
			'^([6]):[0-5][0-9] (AM)',
			'^([7]):[0-5][0-9] (AM)',
			'^([8]):[0-5][0-9] (AM)',
			'^([9]):[0-5][0-9] (AM)',
			'^(1[0]|0[1]):[0-5][0-9] (AM)',
			'^(1[1]|0[1]):[0-5][0-9] (AM)',
			'^(1[2]|0[1]):[0-5][0-9] (AM)',

			'^([1]):[0-5][0-9] (PM)',
			'^([2]):[0-5][0-9] (PM)',
			'^([3]):[0-5][0-9] (PM)',
			'^([4]):[0-5][0-9] (PM)',
			'^([5]):[0-5][0-9] (PM)',
			'^([6]):[0-5][0-9] (PM)',
			'^([7]):[0-5][0-9] (PM)',
			'^([8]):[0-5][0-9] (PM)',
			'^([9]):[0-5][0-9] (PM)',
			'^(1[0]|0[1]):[0-5][0-9] (PM)',
			'^(1[1]|0[1]):[0-5][0-9] (PM)',
			'^(1[2]|0[1]):[0-5][0-9] (PM)'
		];
		let data = [];
		let messagesPerHour = [];
		for (let i = 0; i < timesRegex.length; i++) {
			if (i < 12) {
				messagesPerHour[i] = {
					hour: i + 1 + 'AM',
					count: 0
				};
			} else {
				messagesPerHour[i] = {
					hour: i - 12 + 1 + 'PM',
					count: 0
				};
			}
		}

		for (let i = 0; i < times.length; i++) {
			data[i] = {
				...times[i],
				countOfMessagesPerHour: messagesPerHour
			};
		}

		data.forEach((element, i) => {
			for (let j = 0; j < times[i].timesOnThisDate.length; j++) {
				for (let k = 0; k < timesRegex.length; k++) {
					let regexToEdit = new RegExp(timesRegex[k], 'i');
					if (regexToEdit.test(times[i].timesOnThisDate[j])) {
						element.countOfMessagesPerHour[k].count++;
					}
				}
			}
		});

		return data;
	};

	arrayOfObjectsOfDateTextPositionTypeForChatComponentByDate = () => {
		/*
			Had some hardcoded values that only worked with one specific chat,
			which I was using for testing purposes. Will update function in 
			further releases... In the mean time, chat view won't be working.
		*/
	};

	messagesToDisplay = (date, dateString) => {
		if (!dateString) {
			return [];
		}
		const messagesByDate = this.arrayOfObjectsOfDateTextPositionTypeForChatComponentByDate();
		const initialDate = dateString[0];
		const endDate = dateString[1];
		let data = [];

		for (let i = 0; i < messagesByDate.length; i++) {
			if (initialDate === messagesByDate[i].date) {
				for (let j = 0; j < messagesByDate[i].messages.length; j++) {
					data.push(messagesByDate[i].messages[j]);
				}
			}
		}

		return data;
	};

	onChange = (date, dateString) => {
		console.log(date, dateString);
	};

	averageMessage;

	singleChatBuffer = () => {
		return _.join(this.arrayOfMessageTextPerChatLine(), ' ');
	};

	removeAccents = (text) => {
		let accents = 'ÁáÓóÉéÍíÚúü',
			accentsOut = 'AaOoEeIiUuu',
			textNoAccents = [];

		for (let i in text) {
			let idx = accents.indexOf(text[i]);
			if (idx !== -1) textNoAccents[i] = accentsOut.substr(idx, 1);
			else textNoAccents[i] = text[i];
		}

		return textNoAccents.join('');
	};

	showSearchWordOccurrences = (value) => {
		let valueWithoutAccent = this.removeAccents(value);
		let singleChatWithoutAccents = this.removeAccents(this.singleChatBuffer());

		let words = singleChatWithoutAccents.split(' ');
		let wordCount = 0;
		let regexToEdit = new RegExp('\\b' + valueWithoutAccent + '\\b', 'i');
		for (let i = 0; i < words.length; i++) {
			const word = words[i];
			if (regexToEdit.test(word)) {
				wordCount++;
			}
		}
		this.setState({ words: wordCount });
		return wordCount;
	};

	uniqueWords = () => {
		let chatBuffer = this.removeAccents(this.singleChatBuffer());
		return _.uniq(chatBuffer.split(' '));
	};

	wordsToHashTable = (chatBuffer) => {
		chatBuffer.forEach((element) => {
			HashTable.put(element);
		});
	};

	getParticipants = () => {
		return _.uniq(this.arrayOfSenderPerChatLine());
	};

	getParticipantsJoined = () => {
		let p = _.uniq(this.arrayOfSenderPerChatLine());
		let t = [];
		for (let i = 0; i < p.length; i++) {
			t.push(p[i].replace(/ /g, ''));
		}
		return t;
	};

	onUserChange = (value) => {
		this.setState({ selectedUser: value });
	};

	render() {
		const participants = this.getParticipants();
		const noParticipants = participants.length ? false : true;

		return (
			<div>
				<Mayre
					of={
						<Modal title="Select yourself" centered visible={this.state.visible} onOk={this.handleOk}>
							<Select
								showSearch
								onChange={this.onUserChange}
								disabled={noParticipants}
								style={{ width: 200 }}
								placeholder="Whom are you?"
								optionFilterProp="children"
								filterOption={(input, option) =>
									option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
							>
								{participants.map((p, k) => (
									<Option value={p} key={k}>
										{p}
									</Option>
								))}
							</Select>
						</Modal>
					}
					or={
						<div>
							<p>Selected user: {this.state.selectedUser}</p>
							<Dashboard
								arrayOfDatesPerChatLine={this.arrayOfDatesPerChatLine()}
								arrayOfObjectsOfCountOfMessagesPerDate={this.arrayOfObjectsOfCountOfMessagesPerDate()}
								//arrayOfObjectsOfDateTextPositionTypeForChatComponentByDate={this.arrayOfObjectsOfDateTextPositionTypeForChatComponentByDate()}
								arrayOfObjectsOfDateTextPositionTypeForChatComponent={this.arrayOfObjectsOfDateTextPositionTypeForChatComponent()}
								countOfTotalMessagesPerSender={this.countOfTotalMessagesPerSender()}
								showSearchWordOccurrences={(value) => this.showSearchWordOccurrences(value)}
								participants={this.getParticipants()}
								participantsJoined={this.getParticipantsJoined()}
								countOfMessagesPerSenderPerDate={this.countOfMessagesPerSenderPerDate()}
								totalMessages={this.state.globalData.total}
							/>
						</div>
					}
					when={!this.state.loadDashboard}
				/>
			</div>
		);
	}
}

ChatData.propTypes = {
	chatBuffer: PropTypes.string
};

export default ChatData;
