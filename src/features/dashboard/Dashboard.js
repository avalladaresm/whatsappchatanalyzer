import React from 'react';
import PropTypes from 'prop-types';
import { Card, DatePicker, Descriptions, Input, Modal, Button, Radio, Select } from 'antd';
import { Chart, Tooltip, Axis, Line, Legend } from 'viser-react';
import { MessageBox, SystemMessage } from 'react-chat-elements-av';
import moment from 'moment';
import 'react-chat-elements-av/dist/main.css';
import _ from 'lodash';
//import HashTable from '../hashtable/HashTable';
import { LineChartOutlined } from '@ant-design/icons';
const DataSet = require('@antv/data-set');
const { RangePicker } = DatePicker;
const dateFormat = 'MM/DD/YY';

const { Search } = Input;
const Option = Select.Option;

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			words: 0,
			visible: false
		};
	}

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	handleCancel = () => {
		this.setState({
			visible: false
		});
	};

	render() {
		let {
			arrayOfDatesPerChatLine,
			arrayOfObjectsOfCountOfMessagesPerDate,
			arrayOfObjectsOfDateTextPositionTypeForChatComponent,
			countOfTotalMessagesPerSender,
			showSearchWordOccurrences,
			participants,
			participantsJoined
		} = this.props;
		const uniqDates = _.uniq(arrayOfDatesPerChatLine);
		let p = () => {
			for (let i = 0; i < participants.length; i++) {
				participants[i].replace(/ /g, '');
			}
			return participants;
		};

		const noParticipants = participants.length ? false : true;

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
					{/* <Descriptions.Item label="Total messages">
						{arrayOfObjectsOfDateTextPositionTypeForChatComponent.length}
					</Descriptions.Item> */}
					{countOfTotalMessagesPerSender.map((item, k) => {
						return (
							<Descriptions.Item key={k} label={'Messages by ' + item.name}>
								{item.messages}
							</Descriptions.Item>
						);
					})}
				</Descriptions>
				<br />
				<Select
					showSearch
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
				<Search
					placeholder="Search for a word"
					onSearch={showSearchWordOccurrences}
					style={{ width: 200 }}
					enterButton
				/>
				<p>{this.state.words}</p>
				<br />
				<RangePicker
					defaultValue={[ moment('9/7/17', dateFormat), moment('9/7/17', dateFormat) ]}
					format={dateFormat}
					onChange={this.messagesToDisplay}
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
							<div className="ant-calendar-date" style={style}>
								{current.date()}
							</div>
						);
					}}
				/>
				<Card title="Messages">
					<div>
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
					</div>
				</Card>

				<Radio.Group size="large" buttonStyle="solid">
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
				<Card title="Messages per person">
					<div>
						<Chart forceFit data={data2} height={400} scale={scale}>
							<Legend />
							<Tooltip crosshairs={true} />
							<Axis />
							{/* <Axis dataKey="messages" label={this.label} /> */}
							<Line position="date*messages" color="person" />
						</Chart>
					</div>
				</Card>
				{/*<Button type="primary" onClick={this.showModal} icon={<LineChartOutlined />}>
					Open Modal
				</Button>
				 <Modal
					title="Basic Modal"
					visible={this.state.visible}
					onCancel={this.handleCancel}
					style={{ top: 20 }}
				>
					{arrayOfObjectsOfDateTextPositionTypeForChatComponent.map((message, key) => (
						<MessageBox
							key={key}
							position={message.position}
							type={message.type}
							text={message.text}
							dateString={message.date}
						/>
					))}

					<SystemMessage type="text" text={'End of conversation'} />
				</Modal> */}
			</div>
		);
	}
}

Dashboard.propTypes = {
	arrayOfDatesPerChatLine: PropTypes.array,
	arrayOfObjectsOfCountOfMessagesPerDate: PropTypes.array,
	arrayOfObjectsOfDateTextPositionTypeForChatComponentByDate: PropTypes.array,
	arrayOfObjectsOfDateTextPositionTypeForChatComponent: PropTypes.array,
	countOfTotalMessagesPerSender: PropTypes.object,
	showSearchWordOccurrences: PropTypes.func,
	participants: PropTypes.array,
	participantsJoined: PropTypes.array,
	countOfMessagesPerSenderPerDate: PropTypes.array,
	justaTest: PropTypes.object
};

export default Dashboard;
