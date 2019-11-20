import React from 'react';
import '../style/home.css';

import { List } from 'antd';

const data = [
    'Can I change my tickets booked online?',
    'Can I change booking online if I have done Online Check-In?',
    'How do I book an Extra-legroom Seat?',
    'What is the difference between "Economy" and "Restricted Economy" tickets?',
    'How much baggage can I check in?',
    'How much baggage can I bring on board?',
    'Is there extra free baggage allowance for sporting equipment?',
    'What type of mobile device can access Mobile Check-In?',
    'Is Mobile Check-In available for all Cathay Pacific and Cathay Dragon flights?',
];

export default class Help extends React.Component {
    render() {
        return (
            <div>
            <List
                header={<div>Essential FAQs</div>}
                footer={<div>...</div>}
                bordered
                dataSource={data}
                renderItem={item => (<List.Item><a>{item}</a></List.Item>)}
            />
            </div>
        );
    }
}
