import React, {Component} from 'react';

export default class ButtonPinkLoader extends Component{
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <div className="spinner-border text-pink " style={{width: '1.5rem', height: '1.5rem'}} role="status">

            </div>
        );
    }


}