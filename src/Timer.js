import React from 'react'

export default class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        }
    }
    componentDidMount() {
        setInterval(this.updateTime)
    }
     updateTime = () => {
        this.setState({date: new Date()});
     };
    render() {
        return (
            <div>
                {this.state.date.toLocaleTimeString()}
            </div>
        );
    }
}