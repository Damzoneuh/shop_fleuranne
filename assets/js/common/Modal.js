import React, {Component} from 'react';
import logo from '../../img/logo.png';

export default class Modal extends Component{
    constructor(props) {
        super(props);
        this.onValidation = this.onValidation.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onValidation(){
        this.props.onValidation();
    }

    onCancel(){
        this.props.onCancel()
    }

    render() {
        const {message} = this.props;
        return (
            <div className="modal d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.onCancel}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="text-center"><img src={logo} alt="logo"/></div>
                            <p>
                                {message}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.onCancel}>Annuler</button>
                            <button type="button" className="btn btn-primary" onClick={this.onValidation}>Confirmer</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}