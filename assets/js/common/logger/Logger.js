import React, {Component} from 'react';

export default class Logger extends Component{
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            message: null
        }
    }

    render() {
        const {type, message} = this.props;
        if (type && message){
            return (
                <div className={ "alert-" + type + " alert alert-dismissible fade show fixed-top w-75 mt-3 ml-2"} role="alert">
                    <h4 className="alert-heading">{type === 'success' ? 'Succès' : 'Erreur'}</h4>
                    <hr />
                        <p className="mb-0">{message}</p>
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
        }
        else { return (<div> </div>)}
    }
}