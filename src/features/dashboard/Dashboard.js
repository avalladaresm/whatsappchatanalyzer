import React from 'react';
import PropTypes from 'prop-types';
import { Card, DatePicker, Descriptions, Input, Modal, Button, Radio, Affix, message } from 'antd';
import { Chart, Tooltip, Axis, Line, Legend } from 'viser-react';
import { MessageBox, SystemMessage } from 'react-chat-elements-av';
import InfiniteScroll from 'react-infinite-scroller';
import Mayre from 'mayre';
import moment from 'moment';
import 'react-chat-elements-av/dist/main.css';
import _ from 'lodash';
//import HashTable from '../hashtable/HashTable';
import { LineChartOutlined } from '@ant-design/icons';
const DataSet = require('@antv/data-set');
const { RangePicker } = DatePicker;
const dateFormat = 'MM/DD/YY';

const { Search } = Input;

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			words: 0,
			visible: false,
			showGraph: 1,
			page: 0,
			hasMore: true,
			loading: false,
			isShowingMessages: false,
			allMessages: [],
			messagesToShow: [],
			datesChanged: 0
		};
	}

	showChatModal = () => {
		let allMessages = this.props.messagesToDisplayOnChatComponent;
		let temp = [];
		if (allMessages.length > 0) {
			if (!this.state.isShowingMessages || this.props.datesChanged !== this.state.datesChanged) {
				let range = [ 0, 20 ];
				for (let i = range[0]; i < range[1]; i++) {
					if (allMessages[i]) {
						temp.push(allMessages[i]);
					} else {
						break;
					}
				}

				this.setState({
					visible: true,
					allMessages: this.props.messagesToDisplayOnChatComponent,
					page: 0,
					messagesToShow: temp,
					isShowingMessages: true,
					datesChanged: this.props.datesChanged,
					hasMore: true
				});
			} else {
				let range = [ 0, (this.state.page + 1) * 20 ];
				for (let i = range[0]; i < range[1]; i++) {
					if (allMessages[i]) {
						temp.push(allMessages[i]);
					} else {
						break;
					}
				}

				this.setState({
					visible: true,
					allMessages: this.props.messagesToDisplayOnChatComponent,
					messagesToShow: temp,
					isShowingMessages: true,
					datesChanged: this.props.datesChanged
				});
			}
		} else {
			message.error('Whoops! No messages were found, try selecting a date range with messages on it!');
		}
	};

	handleCancel = () => {
		this.setState({
			visible: false
		});
	};

	changeCurrentGraph = (e) => {
		this.setState({ showGraph: e.target.value });
	};

	getAllMessages = () => {
		let { allMessages } = this.state;
		let remainingMessagesToShow = allMessages.length - this.state.messagesToShow.length;
		let range = [
			this.state.page * 20,
			remainingMessagesToShow <= 20
				? (this.state.page + 1) * 20 - (20 - remainingMessagesToShow)
				: (this.state.page + 1) * 20
		];
		let temp = [];
		if (this.state.page > 0) {
			for (let i = range[0]; i < range[1]; i++) {
				temp.push(allMessages[i]);
			}
		}
		return temp;
	};

	handleInfiniteOnLoad = () => {
		let { messagesToShow } = this.state;
		this.setState({
			loading: true
		});
		if (messagesToShow.length >= this.state.allMessages.length) {
			message.info('All messages loaded.');

			this.setState({
				hasMore: false,
				loading: false
			});
			return;
		}
		let temp = this.getAllMessages();
		messagesToShow = messagesToShow.concat(temp);
		this.setState({
			messagesToShow: messagesToShow,
			page: this.state.page + 1,
			loading: false
		});
	};

	render() {
		let {
			arrayOfDatesPerChatLine,
			arrayOfObjectsOfCountOfMessagesPerDate,
			countOfTotalMessagesPerSender,
			showSearchWordOccurrences,
			participants,
			participantsJoined,
			totalMessages,
			datesWithMessages
		} = this.props;
		const uniqDates = _.uniq(arrayOfDatesPerChatLine);
		let p = () => {
			for (let i = 0; i < participants.length; i++) {
				participants[i].replace(/ /g, '');
			}
			return participants;
		};

		const label = {
			textStyle: {
				fill: '#aaaaaa'
			}
		};

		const labelFormat = {
			textStyle: {
				fill: '#aaaaaa'
			}
		};

		const data = arrayOfObjectsOfCountOfMessagesPerDate;

		const dv = new DataSet.View().source(arrayOfObjectsOfCountOfMessagesPerDate);
		dv.transform({
			type: 'fold',
			fields: participantsJoined,
			key: 'person',
			value: 'messages'
		});
		const data2 = dv.rows;

		const scale = [
			{
				dataKey: 'date',
				min: 0,
				max: 1
			}
		];

		return (
			<div>
				<Descriptions title="General Info">
					<Descriptions.Item label="Total messages">{totalMessages}</Descriptions.Item>
					{countOfTotalMessagesPerSender.map((item, k) => {
						return (
							<Descriptions.Item key={k} label={'Messages by ' + item.name}>
								{item.messages}
							</Descriptions.Item>
						);
					})}
				</Descriptions>
				<br />
				<Affix offsetTop={20}>
					<Button type="primary" onClick={this.showChatModal} icon={<LineChartOutlined />}>
						View chat
					</Button>
				</Affix>
				<Search
					placeholder="Search for a word"
					onSearch={showSearchWordOccurrences}
					style={{ width: 200 }}
					enterButton
				/>
				<p>{this.state.words}</p>
				<br />
				<RangePicker
					defaultValue={[ moment() ]}
					format={dateFormat}
					inputReadOnly
					onChange={datesWithMessages}
					dateRender={(current) => {
						const style = {};
						for (let i = 0; i < uniqDates.length; i++) {
							let splittedDate = uniqDates[i].split('/');
							if (current.year() === parseInt(splittedDate[2]) + 2000) {
								if (current.month() === parseInt(splittedDate[0] - 1)) {
									if (current.date() === parseInt(splittedDate[1])) {
										style.border = '1px solid #1890ff';
										style.borderRadius = '50%';
									}
								}
							}
						}
						return (
							<div className="ant-picker-cell-inner" style={style}>
								{current.date()}
							</div>
						);
					}}
				/>

				<Radio.Group size="large" buttonStyle="solid" defaultValue={1} onChange={this.changeCurrentGraph}>
					<Radio.Button value={1}>
						<span>
							<LineChartOutlined />
						</span>
					</Radio.Button>
					<Radio.Button value={2}>
						<span>
							<LineChartOutlined />
						</span>
					</Radio.Button>
				</Radio.Group>
				<Mayre
					of={
						<Card title="Total messages per day over time">
							<Chart
								forceFit
								data={data}
								height={400}
								padding={[ 30, 20, 50, 30 ]}
								scale={[
									{
										dataKey: 'date',
										tickCount: 10
									}
								]}
							>
								<Tooltip crosshairs={true} />
								<Axis dataKey="date" label={labelFormat} />
								<Axis dataKey="messages" label={label} />
								<Line position="date*messages" />
							</Chart>
						</Card>
					}
					or={
						<Card title="Messages per person per day">
							<Chart forceFit data={data2} height={400} scale={scale}>
								<Legend />
								<Tooltip crosshairs={true} />
								<Axis />
								{/* <Axis dataKey="messages" label={this.label} /> */}
								<Line position="date*messages" color="person" />
							</Chart>
						</Card>
					}
					when={this.state.showGraph === 1}
				/>
				<Modal
					title="Chat View"
					visible={this.state.visible}
					onCancel={this.handleCancel}
					footer={null}
					className="chatModal"
				>
					<InfiniteScroll
						initialLoad={false}
						pageStart={0}
						loadMore={this.handleInfiniteOnLoad}
						hasMore={!this.state.loading && this.state.hasMore}
						useWindow={false}
					>
						{this.state.messagesToShow.map((message, key) => {
							return (
								<MessageBox
									key={key}
									position={message.position}
									type={message.type}
									text={message.text}
									dateString={message.date}
								/>
							);
						})}
					</InfiniteScroll>
					<SystemMessage type="text" text={'End of conversation'} />
				</Modal>
			</div>
		);
	}
}

Dashboard.propTypes = {
	arrayOfDatesPerChatLine: PropTypes.array,
	arrayOfObjectsOfCountOfMessagesPerDate: PropTypes.array,
	countOfTotalMessagesPerSender: PropTypes.object,
	showSearchWordOccurrences: PropTypes.func,
	participants: PropTypes.array,
	participantsJoined: PropTypes.array,
	countOfMessagesPerSenderPerDate: PropTypes.array,
	totalMessages: PropTypes.number,
	datesWithMessages: PropTypes.func,
	messagesToDisplayOnChatComponent: PropTypes.array,
	datesChanged: PropTypes.number
};

export default Dashboard;
