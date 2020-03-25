import React, {Component} from 'react';

export default class Loader extends Component{
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <div className="mt-5 mb-5 text-center">
                <div className="spinner-border text-grey" style={{width: '6rem', height: '6rem'}} role="status">

                </div>
            </div>
        );
    }

}